import { createContext, useContext, useState, useEffect } from 'react';
import { useStudent } from './StudentContext';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const { studentData, updateProfile, isAuthenticated } = useStudent();

  const [badges, setBadges] = useState([
    { id: 'b1', name: 'Early Bird', description: 'Complete an assignment 2 days early.', icon: '🌅', unlocked: true },
    { id: 'b2', name: 'Perfect Score', description: 'Get 100% on a major test.', icon: '🎯', unlocked: true },
    { id: 'b3', name: 'Participation Star', description: 'Speak up in class 5 times.', icon: '⭐', unlocked: false },
    { id: 'b4', name: 'Science Whiz', description: 'Complete a science project.', icon: '🔬', unlocked: true },
    { id: 'b5', name: 'Team Player', description: 'Lead a group project.', icon: '🤝', unlocked: false },
  ]);

  const [xp, setXp] = useState(0);

  // Sync xp when studentData loads after login
  useEffect(() => {
    if (isAuthenticated && studentData?.xp !== undefined) {
      setXp(studentData.xp);
    }
  }, [isAuthenticated, studentData?.xp]);

  const earnXp = (amount) => {
    const newXp = xp + amount;
    setXp(newXp);
    if (isAuthenticated) {
      updateProfile({ xp: newXp });
    }
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev =>
      prev.map(b => b.id === badgeId ? { ...b, unlocked: true } : b)
    );
  };

  const currentLevel = Math.floor(xp / 1000) + 1;
  const xpToNextLevel = 1000 - (xp % 1000);
  const progressPercentage = (xp % 1000) / 10;

  return (
    <GamificationContext.Provider value={{
      xp,
      currentLevel,
      xpToNextLevel,
      progressPercentage,
      badges,
      earnXp,
      unlockBadge
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
