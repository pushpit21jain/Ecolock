import React from 'react';
import { Shield, Mic, Lock, Zap, Globe, Smartphone } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Shield,
      title: 'AI Liveness Detection',
      description: 'Advanced algorithms detect spoofing attempts and ensure real-time authenticity'
    },
    {
      icon: Mic,
      title: 'Voice Biometrics',
      description: 'Unique vocal fingerprints that are impossible to replicate or steal'
    },
    {
      icon: Lock,
      title: 'Zero-Trust API',
      description: 'Secure REST API for seamless integration with any application or system'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Supports authentication across multiple languages and accents'
    },
    {
      icon: Zap,
      title: 'Real-Time',
      description: 'Lightning-fast authentication in under 2 seconds'
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Works on web, mobile, IoT devices, and embedded systems'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                EchoLock
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Next-generation voice biometric authentication with AI-powered liveness detection
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Say goodbye to passwords, PINs, and vulnerable authentication methods. 
              Your voice is your key to a more secure digital world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Get Started
              </button>
              <button className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose EchoLock?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Advanced voice biometric technology that's more secure than passwords and more convenient than tokens
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-600 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-400">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">&lt;2s</div>
              <div className="text-gray-400">Auth Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-400">Languages</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">100M+</div>
              <div className="text-gray-400">Authentications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};