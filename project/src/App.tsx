import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VoiceRegister } from './components/VoiceRegister';
import { VoiceAuth } from './components/VoiceAuth';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleGetStarted = () => {
    setActiveTab('register');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Hero onGetStarted={handleGetStarted} />;
      case 'register':
        return <VoiceRegister />;
      case 'auth':
        return <VoiceAuth />;
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Hero onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;