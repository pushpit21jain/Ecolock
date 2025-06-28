import React, { useState, useRef, useEffect } from 'react';
import { Mic, Shield, CheckCircle, AlertTriangle, Loader, RefreshCw } from 'lucide-react';

export const VoiceAuth: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [livenessScore, setLivenessScore] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const audioLevelRef = useRef<number>(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isAuthenticating) {
      const updateMetrics = () => {
        audioLevelRef.current = Math.random() * 0.8 + 0.2;
        setAudioLevel(audioLevelRef.current);
        setLivenessScore(prev => Math.min(prev + Math.random() * 5, 98));
        setConfidence(prev => Math.min(prev + Math.random() * 3, 95));
        animationRef.current = requestAnimationFrame(updateMetrics);
      };
      updateMetrics();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevel(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAuthenticating]);

  const startAuthentication = () => {
    setIsAuthenticating(true);
    setAuthStatus('processing');
    setLivenessScore(0);
    setConfidence(0);

    // Simulate authentication process
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthStatus(Math.random() > 0.2 ? 'success' : 'failed');
      setLivenessScore(Math.random() > 0.2 ? 95 + Math.random() * 5 : 60 + Math.random() * 20);
      setConfidence(Math.random() > 0.2 ? 90 + Math.random() * 10 : 50 + Math.random() * 30);
    }, 3000);
  };

  const resetAuth = () => {
    setAuthStatus('idle');
    setLivenessScore(0);
    setConfidence(0);
  };

  const getStatusColor = () => {
    switch (authStatus) {
      case 'success': return 'green';
      case 'failed': return 'red';
      case 'processing': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusMessage = () => {
    switch (authStatus) {
      case 'success': return 'Authentication Successful';
      case 'failed': return 'Authentication Failed';
      case 'processing': return 'Analyzing Voice Pattern...';
      default: return 'Ready for Authentication';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Voice Authentication</h2>
            <p className="text-gray-400">
              Speak naturally for 2-3 seconds to authenticate with your voice
            </p>
          </div>

          {/* Status Display */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-${getStatusColor()}-900/30 border border-${getStatusColor()}-500/50`}>
              {authStatus === 'processing' && <Loader className="h-4 w-4 text-blue-400 animate-spin" />}
              {authStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-400" />}
              {authStatus === 'failed' && <AlertTriangle className="h-4 w-4 text-red-400" />}
              {authStatus === 'idle' && <Shield className="h-4 w-4 text-gray-400" />}
              <span className={`text-${getStatusColor()}-400 font-semibold`}>
                {getStatusMessage()}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Voice Input */}
            <div className="space-y-6">
              {/* Voice Visualizer */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Voice Input</h3>
                <div className="flex justify-center mb-6">
                  <div className="flex items-end space-x-1 h-24">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-purple-600 to-blue-500 w-3 rounded-full transition-all duration-100"
                        style={{
                          height: isAuthenticating
                            ? `${Math.random() * audioLevel * 80 + 10}px`
                            : '6px',
                          opacity: isAuthenticating ? 0.7 + audioLevel * 0.3 : 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={authStatus === 'idle' ? startAuthentication : resetAuth}
                    disabled={authStatus === 'processing'}
                    className={`relative w-16 h-16 rounded-full border-4 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none ${
                      authStatus === 'processing'
                        ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/25'
                        : authStatus === 'success'
                        ? 'bg-green-600 border-green-400'
                        : authStatus === 'failed'
                        ? 'bg-red-600 border-red-400'
                        : 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/25'
                    }`}
                  >
                    {authStatus === 'processing' ? (
                      <Loader className="h-6 w-6 text-white mx-auto animate-spin" />
                    ) : authStatus === 'idle' ? (
                      <Mic className="h-6 w-6 text-white mx-auto" />
                    ) : (
                      <RefreshCw className="h-6 w-6 text-white mx-auto" />
                    )}
                    
                    {authStatus === 'processing' && (
                      <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-25" />
                    )}
                  </button>
                  
                  <p className="text-gray-400 mt-3 text-sm">
                    {authStatus === 'processing' 
                      ? 'Analyzing...' 
                      : authStatus === 'idle'
                      ? 'Click to authenticate'
                      : 'Click to try again'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Real-time Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Liveness Score</span>
                      <span className="text-white font-mono">{livenessScore.toFixed(1)}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          livenessScore > 90 ? 'bg-green-500' : livenessScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${livenessScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Voice Match</span>
                      <span className="text-white font-mono">{confidence.toFixed(1)}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          confidence > 85 ? 'bg-green-500' : confidence > 65 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Audio Quality</span>
                      <span className="text-white font-mono">
                        {isAuthenticating ? (audioLevel * 100).toFixed(0) : '0'}%
                      </span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${audioLevel * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAuthenticating ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-gray-400">Anti-spoofing Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAuthenticating ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-gray-400">Liveness Detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAuthenticating ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-gray-400">Noise Filtering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAuthenticating ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-gray-400">Environment Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};