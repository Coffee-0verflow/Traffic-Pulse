import React, { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <>
      {!showDashboard ? (
        <LandingPage onGetStarted={() => setShowDashboard(true)} />
      ) : (
        <Dashboard onBack={() => setShowDashboard(false)} />
      )}
    </>
  );
}