import React, { useState } from 'react';
import { Globe, Shield, Bell, Key, User, Mic, Database, Cloud } from 'lucide-react';

export const Settings: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'voice', label: 'Voice Settings', icon: Mic },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Configuration', icon: Key },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', status: 'active' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', status: 'active' },
    { code: 'fr', name: 'French', flag: '🇫🇷', status: 'active' },
    { code: 'de', name: 'German', flag: '🇩🇪', status: 'inactive' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', status: 'inactive' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷', status: 'inactive' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', status: 'inactive' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', status: 'inactive' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', status: 'inactive' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', status: 'inactive' },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                defaultValue="Acme Corporation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Session Duration
              </label>
              <select className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>8 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Zone
              </label>
              <select className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                <option>UTC-8 (Pacific Standard Time)</option>
                <option>UTC-5 (Eastern Standard Time)</option>
                <option>UTC+0 (Greenwich Mean Time)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Multi-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Require additional verification for admin access</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Enable
              </button>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Liveness Detection Thresholds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Liveness Score
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    defaultValue="85"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>60%</span>
                    <span>85%</span>
                    <span>99%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voice Match Confidence
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="99"
                    defaultValue="90"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>70%</span>
                    <span>90%</span>
                    <span>99%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'voice':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Voice Processing Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Noise Reduction</div>
                    <div className="text-sm text-gray-400">Filter background noise during recording</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Echo Cancellation</div>
                    <div className="text-sm text-gray-400">Remove echo from audio input</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Auto Gain Control</div>
                    <div className="text-sm text-gray-400">Automatically adjust microphone sensitivity</div>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Recording Quality</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sample Rate
                </label>
                <select className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option>16 kHz (Recommended)</option>
                  <option>22.05 kHz</option>
                  <option>44.1 kHz</option>
                  <option>48 kHz</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'languages':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Supported Languages</h3>
              <p className="text-sm text-gray-400 mb-6">
                Enable voice authentication for different languages and accents
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {languages.map((lang) => (
                <div key={lang.code} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="text-white font-medium">{lang.name}</div>
                      <div className="text-sm text-gray-400">{lang.code.toUpperCase()}</div>
                    </div>
                  </div>
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      lang.status === 'active'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {lang.status === 'active' ? 'Active' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Failed Authentication Alerts</div>
                    <div className="text-sm text-gray-400">Get notified when authentication fails</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">System Status Updates</div>
                    <div className="text-sm text-gray-400">Receive updates about system health</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Weekly Reports</div>
                    <div className="text-sm text-gray-400">Get weekly usage and security reports</div>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Base URL
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    defaultValue="https://api.echolock.com/v1"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://your-app.com/webhooks/echolock"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rate Limit (requests per minute)
                  </label>
                  <select className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option>100</option>
                    <option>500</option>
                    <option>1000</option>
                    <option>5000</option>
                    <option>10000</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure your EchoLock system preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              {renderTabContent()}
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
                <button className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};