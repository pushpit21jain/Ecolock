import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken } from './auth.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, '..', 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}.wav`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Simple voice analysis function (placeholder for real biometric analysis)
function analyzeVoice(audioData) {
  // In a real implementation, this would use ML models for voice biometrics
  // For now, we'll simulate analysis results
  
  const confidence = Math.random() * 20 + 80; // 80-100%
  const liveness = Math.random() * 15 + 85; // 85-100%
  const quality = Math.random() * 10 + 90; // 90-100%
  
  return {
    confidence: Math.round(confidence * 10) / 10,
    liveness: Math.round(liveness * 10) / 10,
    quality: Math.round(quality * 10) / 10,
    features: {
      pitch: Math.random() * 100 + 100,
      tempo: Math.random() * 50 + 100,
      energy: Math.random() * 0.5 + 0.5
    }
  };
}

// Register voice profile
router.post('/register', authenticateToken, upload.single('audio'), [
  body('profileName').trim().isLength({ min: 2, max: 50 }),
  body('phrase').trim().isLength({ min: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const { profileName, phrase } = req.body;
    const db = await getDatabase();

    // Check if profile name already exists for this user
    const existingProfile = await db.get(
      'SELECT id FROM voice_profiles WHERE user_id = ? AND profile_name = ? AND is_active = 1',
      [req.user.id, profileName]
    );

    if (existingProfile) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(409).json({ error: 'Profile name already exists' });
    }

    // Analyze voice data
    const analysis = analyzeVoice(req.file.path);
    
    // Create voice profile
    const profileId = uuidv4();
    const voiceData = JSON.stringify({
      filePath: req.file.filename,
      phrase,
      analysis,
      recordedAt: new Date().toISOString()
    });

    await db.run(
      'INSERT INTO voice_profiles (id, user_id, profile_name, voice_data) VALUES (?, ?, ?, ?)',
      [profileId, req.user.id, profileName, voiceData]
    );

    res.status(201).json({
      message: 'Voice profile registered successfully',
      profile: {
        id: profileId,
        name: profileName,
        analysis
      }
    });
  } catch (error) {
    console.error('Voice registration error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Voice registration failed' });
  }
});

// Authenticate with voice
router.post('/authenticate', authenticateToken, upload.single('audio'), [
  body('profileId').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const { profileId } = req.body;
    const db = await getDatabase();

    // Get voice profile
    const profile = await db.get(
      'SELECT * FROM voice_profiles WHERE id = ? AND user_id = ? AND is_active = 1',
      [profileId, req.user.id]
    );

    if (!profile) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Voice profile not found' });
    }

    // Analyze current voice sample
    const currentAnalysis = analyzeVoice(req.file.path);
    const profileData = JSON.parse(profile.voice_data);
    const storedAnalysis = profileData.analysis;

    // Calculate similarity scores (simplified)
    const confidenceDiff = Math.abs(currentAnalysis.confidence - storedAnalysis.confidence);
    const livenessDiff = Math.abs(currentAnalysis.liveness - storedAnalysis.liveness);
    
    const confidenceScore = Math.max(0, 100 - confidenceDiff);
    const livenessScore = Math.max(0, 100 - livenessDiff);
    
    // Determine authentication result
    const isAuthenticated = confidenceScore >= profile.confidence_threshold * 100 && 
                           livenessScore >= profile.liveness_threshold * 100;

    // Log authentication attempt
    const logId = uuidv4();
    await db.run(
      'INSERT INTO auth_logs (id, user_id, profile_id, auth_type, status, confidence_score, liveness_score, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        logId,
        req.user.id,
        profileId,
        'voice',
        isAuthenticated ? 'success' : 'failed',
        confidenceScore,
        livenessScore,
        req.ip,
        req.get('User-Agent')
      ]
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      authenticated: isAuthenticated,
      scores: {
        confidence: confidenceScore,
        liveness: livenessScore,
        quality: currentAnalysis.quality
      },
      thresholds: {
        confidence: profile.confidence_threshold * 100,
        liveness: profile.liveness_threshold * 100
      },
      analysis: currentAnalysis
    });
  } catch (error) {
    console.error('Voice authentication error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Voice authentication failed' });
  }
});

// Get user's voice profiles
router.get('/profiles', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const profiles = await db.all(
      'SELECT id, profile_name, voice_data, created_at, updated_at FROM voice_profiles WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC',
      [req.user.id]
    );

    const formattedProfiles = profiles.map(profile => {
      const data = JSON.parse(profile.voice_data);
      return {
        id: profile.id,
        name: profile.profile_name,
        phrase: data.phrase,
        analysis: data.analysis,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      };
    });

    res.json({ profiles: formattedProfiles });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch voice profiles' });
  }
});

// Delete voice profile
router.delete('/profiles/:profileId', authenticateToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    const db = await getDatabase();

    // Get profile to delete associated file
    const profile = await db.get(
      'SELECT voice_data FROM voice_profiles WHERE id = ? AND user_id = ? AND is_active = 1',
      [profileId, req.user.id]
    );

    if (!profile) {
      return res.status(404).json({ error: 'Voice profile not found' });
    }

    // Soft delete profile
    await db.run(
      'UPDATE voice_profiles SET is_active = 0 WHERE id = ?',
      [profileId]
    );

    // Delete associated file
    const data = JSON.parse(profile.voice_data);
    const filePath = join(__dirname, '..', 'uploads', data.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Voice profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete voice profile' });
  }
});

// Update profile thresholds
router.patch('/profiles/:profileId/thresholds', authenticateToken, [
  body('livenessThreshold').isFloat({ min: 0.6, max: 0.99 }),
  body('confidenceThreshold').isFloat({ min: 0.7, max: 0.99 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { profileId } = req.params;
    const { livenessThreshold, confidenceThreshold } = req.body;
    const db = await getDatabase();

    const result = await db.run(
      'UPDATE voice_profiles SET liveness_threshold = ?, confidence_threshold = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ? AND is_active = 1',
      [livenessThreshold, confidenceThreshold, profileId, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Voice profile not found' });
    }

    res.json({ message: 'Thresholds updated successfully' });
  } catch (error) {
    console.error('Update thresholds error:', error);
    res.status(500).json({ error: 'Failed to update thresholds' });
  }
});

export default router; 