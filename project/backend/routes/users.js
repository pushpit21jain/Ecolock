import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { getDatabase } from '../database/init.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get user's authentication logs
router.get('/logs', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const db = await getDatabase();

    let query = `
      SELECT al.*, vp.profile_name 
      FROM auth_logs al 
      LEFT JOIN voice_profiles vp ON al.profile_id = vp.id 
      WHERE al.user_id = ?
    `;
    let params = [req.user.id];

    if (status) {
      query += ' AND al.status = ?';
      params.push(status);
    }

    query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const logs = await db.all(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM auth_logs WHERE user_id = ?';
    let countParams = [req.user.id];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const countResult = await db.get(countQuery, countParams);
    const total = countResult.total;

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to fetch authentication logs' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();

    // Get total authentications
    const totalAuth = await db.get(
      'SELECT COUNT(*) as total FROM auth_logs WHERE user_id = ?',
      [req.user.id]
    );

    // Get successful authentications
    const successAuth = await db.get(
      'SELECT COUNT(*) as total FROM auth_logs WHERE user_id = ? AND status = "success"',
      [req.user.id]
    );

    // Get voice profiles count
    const profilesCount = await db.get(
      'SELECT COUNT(*) as total FROM voice_profiles WHERE user_id = ? AND is_active = 1',
      [req.user.id]
    );

    // Get average confidence score
    const avgConfidence = await db.get(
      'SELECT AVG(confidence_score) as average FROM auth_logs WHERE user_id = ? AND confidence_score IS NOT NULL',
      [req.user.id]
    );

    // Get recent activity (last 7 days)
    const recentActivity = await db.get(
      'SELECT COUNT(*) as total FROM auth_logs WHERE user_id = ? AND created_at >= datetime("now", "-7 days")',
      [req.user.id]
    );

    res.json({
      totalAuthentications: totalAuth.total,
      successfulAuthentications: successAuth.total,
      successRate: totalAuth.total > 0 ? (successAuth.total / totalAuth.total * 100).toFixed(1) : 0,
      voiceProfiles: profilesCount.total,
      averageConfidence: avgConfidence.average ? avgConfidence.average.toFixed(1) : 0,
      recentActivity: recentActivity.total
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Update user profile
router.patch('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    const db = await getDatabase();

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await db.get(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.id]
      );
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.user.id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.run(query, params);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.patch('/password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const db = await getDatabase();

    // Get current user with password hash
    const user = await db.get(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    // Verify current password
    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Generate API key
router.post('/api-keys', authenticateToken, [
  body('keyName').trim().isLength({ min: 2, max: 50 }),
  body('permissions').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { keyName, permissions } = req.body;
    const db = await getDatabase();

    // Generate API key
    const apiKey = `ek_${uuidv4().replace(/-/g, '')}`;
    const bcrypt = await import('bcryptjs');
    const keyHash = await bcrypt.hash(apiKey, 12);

    // Store API key
    const keyId = uuidv4();
    await db.run(
      'INSERT INTO api_keys (id, user_id, key_name, key_hash, permissions) VALUES (?, ?, ?, ?, ?)',
      [keyId, req.user.id, keyName, keyHash, JSON.stringify(permissions)]
    );

    res.status(201).json({
      message: 'API key generated successfully',
      apiKey,
      key: {
        id: keyId,
        name: keyName,
        permissions
      }
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ error: 'Failed to generate API key' });
  }
});

// Get user's API keys
router.get('/api-keys', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const keys = await db.all(
      'SELECT id, key_name, permissions, last_used, created_at, is_active FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const formattedKeys = keys.map(key => ({
      id: key.id,
      name: key.key_name,
      permissions: JSON.parse(key.permissions),
      lastUsed: key.last_used,
      createdAt: key.created_at,
      isActive: key.is_active === 1
    }));

    res.json({ keys: formattedKeys });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Revoke API key
router.delete('/api-keys/:keyId', authenticateToken, async (req, res) => {
  try {
    const { keyId } = req.params;
    const db = await getDatabase();

    const result = await db.run(
      'UPDATE api_keys SET is_active = 0 WHERE id = ? AND user_id = ?',
      [keyId, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

export default router; 