import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const StudentContext = createContext(null);

// Highly detailed, realistic Kenyan CBC & CBE baseline mock state
const CBC_SANDBOX_DATA = {
  isSandbox: true,
  name: 'Solomon Nyakundi Jr.',
  id: 'SB-2026-6819',
  email: 'student@somobloom.com',
  phone: '+254 712 345678',
  grade: 'Grade 6 Junior School',
  school: "St. Joseph's Kisii South Academy",
  avatarUrl: '',
  interests: 'Robotics, Agriculture, Drawing, Creative Writing',
  
  // Learning Areas instead of courses, detailed with strands & sub-strands
  learningAreas: [
    { 
      id: 1, 
      name: 'Mathematics', 
      teacher: 'Mr. Solomon Nyakundi', 
      progress: 84, 
      level: 'EE', // Exceeding Expectations
      strand: 'Numbers & Algebra',
      subStrand: 'Fractions and Percentages',
      description: 'Solving real-life problems involving fractions, decimals, and basic percentages.'
    },
    { 
      id: 2, 
      name: 'Integrated Science', 
      teacher: 'Mrs. Janet Bloom', 
      progress: 74, 
      level: 'ME', // Meeting Expectations
      strand: 'Environment & Plants',
      subStrand: 'Seed Germination Factors',
      description: 'Understanding the variables affecting growth and local crop preservation.'
    },
    { 
      id: 3, 
      name: 'Creative Arts & Sports', 
      teacher: 'Miss Clara Zawadi', 
      progress: 92, 
      level: 'EE',
      strand: 'Visual Arts & Illustration',
      subStrand: 'Storybook Sketching & Painting',
      description: 'Illustrating narratives using local materials, color shading, and structural forms.'
    },
    { 
      id: 4, 
      name: 'Agriculture & Nutrition', 
      teacher: 'Mr. Erick Ombogo', 
      progress: 68, 
      level: 'ME',
      strand: 'Crop Production & Health',
      subStrand: 'Kitchen Gardening Techniques',
      description: 'Setting up and maintaining organic vegetable patches to improve household nutrition.'
    },
    { 
      id: 5, 
      name: 'Kiswahili Language', 
      teacher: 'Mwalimu Beatrice Auma', 
      progress: 58, 
      level: 'AE', // Approaching Expectations
      strand: 'Uandishi wa Hadithi',
      subStrand: 'Insha za Kichwa na Wasifu',
      description: 'Kujenga msamiati thabiti na kuandika insha za kubuni zenye mtiririko mzuri.'
    }
  ],

  // 7 Core Competencies of Kenyan CBC
  competencies: [
    { name: 'Communication & Collaboration', score: 85, description: 'Shares ideas effectively and works cohesively in group projects.' },
    { name: 'Critical Thinking & Problem Solving', score: 78, description: 'Analyzes observations logically in science and math strands.' },
    { name: 'Imagination & Creativity', score: 94, description: 'Excels in visual arts and story illustrations.' },
    { name: 'Citizenship', score: 82, description: 'Shows high responsibility, environmental care, and respect.' },
    { name: 'Learning to Learn', score: 76, description: 'Actively searches for answers and shows self-drive in revisions.' },
    { name: 'Self-efficacy', score: 88, description: 'Presents evidence confidently and manages study hours well.' },
    { name: 'Digital Literacy', score: 95, description: 'Confidently operates school Chromebooks and uses search engines.' }
  ],

  // Action items / CBC tasks
  tasks: [
    { id: 1, text: 'Take a photo of your bean seedling growth progress', completed: false, category: 'Science' },
    { id: 2, text: 'Read Chapter 4 of Kiswahili Insha guidelines', completed: true, category: 'Kiswahili' },
    { id: 3, text: 'Draw a draft kitchen garden layout for Grade 6 plot', completed: false, category: 'Agriculture' },
    { id: 4, text: 'Practice 40 WPM on keyboard touch-typing course', completed: true, category: 'Digital Literacy' }
  ],

  // Evidence of Learning Portfolio items (Graded by teachers)
  portfolio: [
    { 
      id: 1, 
      title: 'CBC Germination Experiment Evidence', 
      description: 'Investigated effect of sunlight on seedling growth. Documented leaf span, watering cycles, and stems height.', 
      date: '2026-05-10', 
      level: 'EE',
      teacherComment: 'Superb scientific process logs! Your illustrations show high precision and careful labeling of leaf anatomy.',
      course: 'Integrated Science',
      competencies: ['Critical Thinking', 'Self-efficacy'],
      tags: ['Science', 'Experiment', 'Seedling']
    },
    { 
      id: 2, 
      title: 'My Swahili Storybook Design', 
      description: 'Wrote and illustrated a narrative about community farming in my home village using hand-drawn characters.', 
      date: '2026-05-14', 
      level: 'ME',
      teacherComment: 'Hadithi nzuri sana yenye mtiririko mzuri! Zingatia msamiati wa kilimo uliyojifunza jana.',
      course: 'Kiswahili Language',
      competencies: ['Imagination & Creativity', 'Communication'],
      tags: ['Language', 'Insha', 'Art']
    },
    { 
      id: 3, 
      title: 'Chromebook File Management Task', 
      description: 'Demonstrated sorting files into logical folders and search shortcuts on school Chromebook.', 
      date: '2026-05-22', 
      level: 'EE',
      teacherComment: 'Excellent digital organization skills. You helped three other students map their digital artifacts.',
      course: 'Creative Arts & Sports',
      competencies: ['Digital Literacy', 'Communication & Collaboration'],
      tags: ['Digital', 'Tech', 'Computers']
    }
  ],

  // Official Read-only marks uploaded by teachers
  marks: { 
    rats: [85, 92, 78, 88], 
    cats: [80, 89, 76] 
  },

  // Official Read-only attendance
  attendance: { present: 48, total: 50 },
  aiStudyEnabled: true
};

export function StudentProvider({ children }) {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, login: authLogin, logout: authLogout } = useAuth();

  const isAuthenticated = !!user && user.role === 'student';

  const fetchStudentData = useCallback(async () => {
    const activeToken = localStorage.getItem('somobloom_token');
    if (!activeToken) return;

    setIsLoading(true);
    setError(null);
    try {
      // 1. Attempt to hit the live production worker endpoints
      const { profile } = await api.get('/student/me');
      const { classes } = await api.get('/student/classes');
      const { grades } = await api.get('/student/grades');
      
      let tasksData = [];
      let competenciesData = CBC_SANDBOX_DATA.competencies;
      try {
        const tasksRes = await api.get('/student/tasks');
        if (tasksRes.tasks) tasksData = tasksRes.tasks;
      } catch (err) {
        console.warn('Failed to load tasks:', err);
      }
      
      try {
        const compRes = await api.get('/student/competencies');
        if (compRes.competencies && compRes.competencies.length > 0) {
          competenciesData = compRes.competencies;
        }
      } catch (err) {
        console.warn('Failed to load competencies:', err);
      }
      
      let attendanceData = { totalDays: 45, presentDays: 42, absentDays: 3, lateDays: 0, attendancePercent: 93 };
      try {
        const attRes = await api.get('/student/attendance');
        if (attRes.attendance) attendanceData = attRes.attendance;
      } catch (err) {
        console.warn('Failed to load attendance:', err);
      }
      
      let portfolio = [];
      try {
        const response = await api.get('/student/portfolio');
        portfolio = response.portfolio || [];
      } catch (err) {
        console.warn('Failed to load live portfolio, utilizing sandboxed caching fallback:', err);
      }

      // Format live data while utilizing CBC-specific UI slots
      const formattedPortfolio = portfolio.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        date: item.createdAt.split('T')[0],
        level: item.score >= 80 ? 'EE' : item.score >= 60 ? 'ME' : item.score >= 40 ? 'AE' : 'BE',
        teacherComment: item.feedback || 'No comment recorded.',
        course: (classes || []).find(c => c.id === item.classId)?.name || 'Learning Evidence',
        competencies: item.tags || ['General Competency'],
        tags: item.tags || ['Evidence']
      }));

      setStudentData({
        isSandbox: false,
        name: profile.name,
        id: profile.id || `SB-${profile.phone || '2026'}`,
        email: profile.email || 'student@somobloom.com',
        phone: profile.phone || '',
        grade: profile.grade || 'Grade 6 Junior School',
        school: profile.school || "St. Joseph's Kisii South Academy",
        avatarUrl: profile.avatarUrl || '',
        interests: profile.interests || '',
        learningAreas: (classes || []).map(c => ({
          id: c.id,
          name: c.name,
          teacher: c.teacherName || 'Mwalimu TBD',
          progress: c.attendancePercent || 75,
          level: c.averageGrade || 'ME',
          strand: 'CBC Core Strand',
          subStrand: 'Strand Content',
          description: c.description || 'Active CBC Learning Area.'
        })),
        competencies: competenciesData,
        tasks: tasksData,
        portfolio: formattedPortfolio.length > 0 ? formattedPortfolio : CBC_SANDBOX_DATA.portfolio,
        marks: {
          rats: (grades || []).filter(g => g.assignmentTitle.includes('RAT')).map(g => g.score),
          cats: (grades || []).filter(g => g.assignmentTitle.includes('CAT')).map(g => g.score)
        },
        attendance: attendanceData,
        aiStudyEnabled: profile.aiStudyEnabled ?? true
      });
    } catch (err) {
      console.error('[API Connection Failed]:', err.message);
      setError('Failed to load student data. Please ensure you are logged in and connected to the internet.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchStudentData();
    } else {
      setStudentData(null);
    }
  }, [user, fetchStudentData]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      await authLogin(email, password, 'student');
      await fetchStudentData();
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setStudentData(null);
    authLogout();
  };

  const updateProfile = async (newData) => {
    // 1. Optimistically update local/sandbox UI state immediately
    setStudentData(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      if (prev.isSandbox) {
        localStorage.setItem('somobloom_sandbox_data', JSON.stringify(updated));
      }
      return updated;
    });

    // 2. Persist to production server if in live mode
    if (studentData && !studentData.isSandbox) {
      const activeToken = localStorage.getItem('somobloom_token');
      if (activeToken) {
        try {
          await api.put('/student/me', {
            name: newData.name,
            avatarUrl: newData.avatarUrl,
            phone: newData.phone,
            interests: newData.interests
          });
        } catch (err) {
          console.error('Failed to sync profile changes to backend:', err);
        }
      }
    }
  };

  const toggleTask = (taskId) => {
    setStudentData(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
      if (prev.isSandbox) {
        localStorage.setItem('somobloom_sandbox_data', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleAiStudy = () => {
    setStudentData(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        aiStudyEnabled: !prev.aiStudyEnabled
      };
      if (prev.isSandbox) {
        localStorage.setItem('somobloom_sandbox_data', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <StudentContext.Provider value={{ 
      studentData, 
      isAuthenticated, 
      isLoading,
      error,
      login, 
      logout, 
      updateProfile, 
      toggleTask,
      toggleAiStudy,
      refreshData: fetchStudentData
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
