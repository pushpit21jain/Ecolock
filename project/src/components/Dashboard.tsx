import React, { useState } from 'react';
import { BarChart3, Users, Shield, Clock, Key, Globe, Smartphone, AlertTriangle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('authentications');

  const stats = [
    { label: 'Total Authentications', value: '1,234,567', change: '+12.5%', icon: Shield },
    { label: 'Active Users', value: '89,432', change: '+8.2%', icon: Users },
    { label: 'Success Rate', value: '99.2%', change: '+0.3%', icon: BarChart3 },
    { label: 'Avg Response Time', value: '1.8s', change: '-0.2s', icon: Clock },
  ];

  const recentAuth = [
    { id: '1', user: 'john.doe@example.com', time: '2 mins ago', status: 'success', confidence: 94.2 },
    { id: '2', user: 'jane.smith@example.com', time: '5 mins ago', status: 'success', confidence: 91.7 },
    { id: '3', user: 'bob.wilson@example.com', time: '8 mins ago', status: 'failed', confidence: 67.3 },
    { id: '4', user: 'alice.brown@example.com', time: '12 mins ago', status: 'success', confidence: 96.1 },
    { id: '5', user: 'charlie.davis@example.com', time: '15 mins ago', status: 'success', confidence: 88.9 },
  ];

  const apiKeys = [
    { id: '1', name: 'Production API', key: 'ek_prod_...7x9m', permissions: ['read', 'write'], lastUsed: '2 mins ago', status: 'active' },
    { id: '2', name: 'Staging API', key: 'ek_stag_...3k5p', permissions: ['read'], lastUsed: '1 hour ago', status: 'active' },
    { id: '3', name: 'Development API', key: 'ek_dev_...8w2q', permissions: ['read', 'write'], lastUsed: '3 days ago', status: 'inactive' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor your EchoLock voice authentication system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${
                    stat.change.startsWith('+') ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Authentications */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Authentications</h2>
            <div className="space-y-4">
              {recentAuth.map((auth) => (
                <div key={auth.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      auth.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="text-white font-medium">{auth.user}</div>
                      <div className="text-sm text-gray-400">{auth.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      auth.status === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {auth.status === 'success' ? 'Success' : 'Failed'}
                    </div>
                    <div className="text-sm text-gray-400">{auth.confidence}% confidence</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-300">API Service</span>
                  </div>
                  <span className="text-green-400 font-semibold">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-300">ML Processing</span>
                  </div>
                  <span className="text-green-400 font-semibold">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-gray-300">Database</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">Degraded</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-300">Storage</span>
                  </div>
                  <span className="text-green-400 font-semibold">Optimal</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>Generate API Key</span>
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Add User</span>
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Management */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">API Keys</h2>
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    key.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="text-white font-medium">{key.name}</div>
                    <div className="text-sm text-gray-400 font-mono">{key.key}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-sm text-gray-400">
                    <div>Permissions: {key.permissions.join(', ')}</div>
                    <div>Last used: {key.lastUsed}</div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};