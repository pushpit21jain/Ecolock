import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, AlertCircle, Volume2, RefreshCw, User, Save } from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { apiService } from '../services/api';

export const VoiceRegister: React.FC = () => {
  const [recordingStep, setRecordingStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordedPhrases, setRecordedPhrases] = useState<{ phrase: string; blob: Blob }[]>([]);
  
  const audioLevelIntervalRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const {
    isRecording,
    audioBlob,
    audioUrl,
    duration,
    error: recorderError,
    startRecording,
    stopRecording,
    resetRecording,
    getAudioLevel,
  } = useVoiceRecorder();

  const phrases = [
    "The quick brown fox jumps over the lazy dog",
    "My voice is my password, verify me",
    "Security through biometric authentication is the future"
  ];

  const currentPhrase = phrases[recordingStep] || phrases[0];

  // Update audio level during recording
  useEffect(() => {
    if (isRecording) {
      audioLevelIntervalRef.current = window.setInterval(() => {
        setAudioLevel(getAudioLevel());
      }, 50);
    } else {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
        audioLevelIntervalRef.current = null;
      }
      setAudioLevel(0);
    }

    return () => {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }
    };
  }, [isRecording, getAudioLevel]);

  // Handle recorder errors
  useEffect(() => {
    if (recorderError) {
      setError(recorderError);
    }
  }, [recorderError]);

  const handleStartRecording = async () => {
    setError(null);
    await startRecording();
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      setRecordedPhrases(prev => [
        ...prev,
        { phrase: currentPhrase, blob }
      ]);
      
      if (recordingStep < 2) {
        setTimeout(() => {
          setRecordingStep(prev => prev + 1);
        }, 1000);
      } else {
        setTimeout(() => {
          setIsComplete(true);
        }, 1000);
      }
    }
  };

  const handleSubmitProfile = async () => {
    if (!profileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    if (recordedPhrases.length !== 3) {
      setError('Please record all three phrases');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the first phrase for registration (you could combine all three in a real implementation)
      const { phrase, blob } = recordedPhrases[0];
      
      const result = await apiService.registerVoiceProfile(profileName, phrase, blob);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Success - could redirect to dashboard or show success message
        console.log('Voice profile registered successfully:', result.data);
        resetRegistration();
      }
    } catch (err) {
      setError('Failed to register voice profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetRegistration = () => {
    setRecordingStep(0);
    setIsComplete(false);
    setProfileName('');
    setRecordedPhrases([]);
    setError(null);
    resetRecording();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Register!</h2>
            <p className="text-gray-400 mb-6">
              All phrases recorded successfully. Please provide a name for your voice profile.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter profile name"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleSubmitProfile}
                disabled={isSubmitting || !profileName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Register Voice Profile</span>
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={resetRegistration}
              className="w-full mt-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Voice Registration</h2>
            <p className="text-gray-400 mb-6">
              Read the following phrases clearly to create your unique voice signature
            </p>
            
            {/* Progress Steps */}
            <div className="flex justify-center space-x-4 mb-8">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    step <= recordingStep ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Phrase Display */}
          <div className="bg-gray-900/50 rounded-xl p-6 mb-8 border border-gray-600">
            <div className="flex items-center space-x-2 mb-4">
              <Volume2 className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">
                Phrase {recordingStep + 1} of 3
              </span>
            </div>
            <p className="text-lg text-white font-medium leading-relaxed">
              "{currentPhrase}"
            </p>
          </div>

          {/* Voice Visualizer */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-end space-x-1 h-20">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-blue-500 w-2 rounded-full transition-all duration-100"
                    style={{
                      height: isRecording
                        ? `${Math.random() * audioLevel * 60 + 10}px`
                        : '4px',
                      opacity: isRecording ? 0.7 + audioLevel * 0.3 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="text-center">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isSubmitting}
              className={`relative w-20 h-20 rounded-full border-4 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                isRecording
                  ? 'bg-red-600 border-red-400 shadow-lg shadow-red-500/25'
                  : 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/25'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8 text-white mx-auto" />
              ) : (
                <Mic className="h-8 w-8 text-white mx-auto" />
              )}
              
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-25" />
              )}
            </button>
            
            <p className="text-gray-400 mt-4">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
            </p>
            
            {duration > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Duration: {(duration / 1000).toFixed(1)}s
              </p>
            )}

            {error && (
              <div className="mt-4 bg-red-900/20 border border-red-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recorded Phrases Preview */}
          {recordedPhrases.length > 0 && (
            <div className="mt-8 bg-gray-900/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Recorded Phrases:</h3>
              <div className="space-y-2">
                {recordedPhrases.map((recorded, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300 text-sm">
                      Phrase {index + 1}: "{recorded.phrase}"
                    </span>
                    {recorded.blob && (
                      <audio controls className="ml-auto h-8">
                        <source src={URL.createObjectURL(recorded.blob)} type="audio/webm" />
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-400 font-semibold mb-1">Recording Tips</h4>
                <ul className="text-sm text-yellow-200 space-y-1">
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Use a quiet environment</li>
                  <li>• Maintain consistent distance from microphone</li>
                  <li>• Record for at least 2-3 seconds per phrase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};