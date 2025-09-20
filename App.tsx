import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import SponsorSignup from './components/SponsorSignup';
import VolunteerSignup from './components/VolunteerSignup';
import OrganizerSignup from './components/OrganizerSignup';
import SponsorDashboard from './components/SponsorDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import { Toaster } from './components/ui/sonner';

export interface User {
  id: string;
  role: 'sponsor' | 'volunteer' | 'organizer';
  name: string;
  email: string;
  [key: string]: any;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply dark mode class and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(`${role}-signup`);
  };

  const handleSignupComplete = (userData: User) => {
    setUser(userData);
    setCurrentPage(`${userData.role}-dashboard`);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    setSelectedRole('');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onRoleSelect={handleRoleSelect} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
      case 'sponsor-signup':
        return (
          <SponsorSignup 
            onSignupComplete={handleSignupComplete}
            onBack={() => setCurrentPage('landing')}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      case 'volunteer-signup':
        return (
          <VolunteerSignup 
            onSignupComplete={handleSignupComplete}
            onBack={() => setCurrentPage('landing')}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      case 'organizer-signup':
        return (
          <OrganizerSignup 
            onSignupComplete={handleSignupComplete}
            onBack={() => setCurrentPage('landing')}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      case 'sponsor-dashboard':
        return <SponsorDashboard user={user!} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
      case 'volunteer-dashboard':
        return <VolunteerDashboard user={user!} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
      case 'organizer-dashboard':
        return <OrganizerDashboard user={user!} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <LandingPage onRoleSelect={handleRoleSelect} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentPage()}
      <Toaster />
    </div>
  );
}