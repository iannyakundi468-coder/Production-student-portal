import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { translations } from '../data/parentTranslations';
import { useAuth } from './AuthContext';

const ParentContext = createContext(null);

export const ParentProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentParent, setCurrentParent] = useState(null);
  const [parentChildren, setParentChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const [data, setData] = useState({ messages: [], announcements: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState(() => localStorage.getItem('somobloom_theme') || 'system');

  const isAuthenticated = !!user && user.role === 'guardian';

  // Auto Theme Application Hook
  useEffect(() => {
    const root = document.documentElement;
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'dark' || (theme === 'system' && darkMediaQuery.matches)) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const listener = () => applyTheme();
      darkMediaQuery.addEventListener('change', listener);
      return () => darkMediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Persist Theme preference
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('somobloom_theme', newTheme);
  };

  // Profile Put Request Wrapper
  const updateParentProfile = async (name) => {
    try {
      await api.put('/parent/me', { name });
      setCurrentParent(prev => prev ? { ...prev, name } : null);
      return true;
    } catch (err) {
      console.error('Failed to update parent profile:', err);
      return false;
    }
  };

  // Dynamically map score percentage to CBC Standard Descriptor
  const mapScoreToCbcLevel = (score) => {
    if (score >= 80) return 'Exemplary';
    if (score >= 60) return 'Proficient';
    if (score >= 40) return 'Developing';
    return 'Beginning';
  };

  const fetchParentData = useCallback(async () => {
    const activeToken = localStorage.getItem('somobloom_token');
    if (!activeToken) return;
    setIsLoading(true);
    try {
      const { profile } = await api.get('/parent/me');
      const { students } = await api.get('/parent/students');
      
      const enrichedStudents = await Promise.all((students || []).map(async (student) => {
        // 1. Fetch D1 Portfolio Evidence
        let portfolio = [];
        try {
          const res = await api.get(`/parent/students/${student.id}/portfolio`);
          portfolio = res.portfolio || [];
        } catch (err) {
          console.warn(`Failed to fetch portfolio for student ${student.id}:`, err);
        }

        // 2. Fetch D1 Actual Grades
        let backendGrades = [];
        try {
          const res = await api.get(`/parent/students/${student.id}/grades`);
          backendGrades = res.grades || [];
        } catch (err) {
          console.warn(`Failed to fetch grades for student ${student.id}:`, err);
        }

        // 3. Aggregate Subject Competencies Dynamically
        const cbcProgress = {};
        if (backendGrades.length > 0) {
          const subjectScores = {};
          backendGrades.forEach(grade => {
            let subject = 'General Studies';
            const title = (grade.assignmentTitle || '').toLowerCase();
            
            if (title.includes('math') || title.includes('arithmetic') || title.includes('number')) {
              subject = 'Mathematics';
            } else if (title.includes('kiswahili') || title.includes('lugha') || title.includes('lgha')) {
              subject = 'Kiswahili';
            } else if (title.includes('english') || title.includes('literacy') || title.includes('reading') || title.includes('write')) {
              subject = 'English Language';
            } else if (title.includes('science') || title.includes('environment') || title.includes('nature')) {
              subject = 'Environmental Science';
            } else if (title.includes('art') || title.includes('creative') || title.includes('music')) {
              subject = 'Creative Arts';
            } else if (grade.classId) {
              subject = `Class Activity`;
            }

            if (!subjectScores[subject]) {
              subjectScores[subject] = [];
            }
            if (grade.score !== null && grade.score !== undefined) {
              subjectScores[subject].push(grade.score);
            }
          });

          Object.entries(subjectScores).forEach(([subject, scores]) => {
            if (scores.length > 0) {
              const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
              cbcProgress[subject] = mapScoreToCbcLevel(avg);
            } else {
              cbcProgress[subject] = 'Proficient';
            }
          });
        }

        const finalCbc = cbcProgress;

        // 4. Fetch live Fees Ledger from D1 Backend
        let fees = {
          totalBalance: 0,
          paidAmount: 0,
          currency: 'KES',
          breakdown: [],
          history: []
        };
        try {
          const feeRes = await api.get(`/parent/students/${student.id}/fees`);
          if (feeRes.fees) fees = feeRes.fees;
        } catch (err) {
          console.warn(`Failed to fetch fees for student ${student.id}:`, err);
        }

        return {
          ...student,
          avatar: student.name.split(' ').map(n => n[0]).join('').substring(0, 2),
          grade: student.grade || 'Grade 1',
          progress: finalCbc,
          fees,
          schoolwork: portfolio.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type === 'Assignment' ? 'pdf' : 'image',
            date: item.createdAt.split('T')[0],
            skill: item.tags && item.tags.length > 0 ? (item.tags[0] === 'EE' ? 'Exemplary' : item.tags[0] === 'ME' ? 'Proficient' : item.tags[0] === 'AE' ? 'Developing' : 'Beginning') : 'Proficient',
            feedback: item.description || 'Excellent effort, keep it up!',
            imageUrl: item.imageUrl,
            gradesList: backendGrades.filter(g => g.classId === item.classId)
          }))
        };
      }));

      // Fallback parent profile avatar
      if (profile && !profile.avatar) {
        profile.avatar = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2);
      }

      setCurrentParent(profile);
      setParentChildren(enrichedStudents);
      if (students.length > 0 && !activeChildId) {
        setActiveChildId(students[0].id);
      }

      // Fetch live communications
      const [msgRes, annRes] = await Promise.all([
        api.get('/messages'),
        api.get('/parent/announcements')
      ]);

      setData(prev => ({
        ...prev,
        messages: msgRes.messages || [],
        announcements: annRes.announcements || []
      }));
    } catch (err) {
      console.error('Failed to fetch parent data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeChildId]);

  useEffect(() => {
    if (user && user.role === 'guardian') {
      fetchParentData();
    } else {
      setCurrentParent(null);
      setParentChildren([]);
      setData({ messages: [], announcements: [] });
    }
  }, [user, fetchParentData]);

  const activeChild = parentChildren.find(c => c.id === activeChildId) || parentChildren[0];
  const t = translations[language] || translations.en;

  const switchChild = (id) => setActiveChildId(id);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'sw' : 'en');

  // Live Payment API Integration
  const addPayment = async (studentId, amount, method) => {
    try {
      await api.post('/parent/payments', { studentId, amount, method });
      // Refresh parent data to get the updated fees from the backend
      await fetchParentData();
    } catch (err) {
      console.error('Failed to submit payment:', err);
    }
  };

  const markMessageRead = async (msgId) => {
    const activeToken = localStorage.getItem('somobloom_token');
    if (!activeToken) return;

    try {
      await api.put(`/messages/${msgId}/read`);
      setData(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.id === msgId ? { ...m, read: true } : m)
      }));
    } catch (err) {
      console.error('Failed to mark message read:', err);
    }
  };

  const sendMessage = async (receiverId, content, subject = 'Parent Communication') => {
    const activeToken = localStorage.getItem('somobloom_token');
    if (!activeToken) return false;

    try {
      const res = await api.post('/messages', {
        receiverId,
        subject,
        content
      });
      if (res.sentMessage) {
        setData(prev => ({
          ...prev,
          messages: [res.sentMessage, ...prev.messages]
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to send message:', err);
      return false;
    }
  };

  return (
    <ParentContext.Provider value={{
      activeChild,
      parentChildren,
      currentParent,
      language,
      theme,
      isAuthenticated,
      isLoading,
      data,
      t,
      switchChild,
      toggleLanguage,
      updateTheme,
      updateParentProfile,
      markMessageRead,
      sendMessage,
      addPayment,
      refreshData: fetchParentData
    }}>
      {children}
    </ParentContext.Provider>
  );
};

export const useParentContext = () => {
  const ctx = useContext(ParentContext);
  if (!ctx) throw new Error('useParentContext must be used inside ParentProvider');
  return ctx;
};
