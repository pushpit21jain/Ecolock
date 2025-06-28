export interface VoicePrint {
  id: string;
  userId: string;
  voiceSignature: string;
  createdAt: Date;
  language: string;
  confidence: number;
}

export interface AuthSession {
  id: string;
  userId: string;
  timestamp: Date;
  method: 'voice' | 'otp' | 'gesture';
  confidence: number;
  livenessScore: number;
  location?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
}

export interface LivenessMetrics {
  backgroundNoise: number;
  environmentReverb: number;
  voiceConsistency: number;
  realTimeScore: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  registeredAt: Date;
  voicePrintsCount: number;
  lastAuth?: Date;
}