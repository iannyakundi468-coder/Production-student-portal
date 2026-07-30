import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const StudentContext = createContext(null);

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const StudentContext = createContext(null);

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
      const { profile } = await api.get('/student/me');
      const { classes } = await api.get('/student/classes');
      const { grades } = await api.get('/student/grades');
      
      let tasksData = [];
      let competenciesData = [];
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
      
      let attendanceData = { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, attendancePercent: 0 };
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
        console.warn('Failed to load portfolio:', err);
      }

      const formattedPortfolio = portfolio.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        date: item.createdAt ? item.createdAt.split('T')[0] : '',
        level: item.score >= 80 ? 'EE' : item.score >= 60 ? 'ME' : item.score >= 40 ? 'AE' : 'BE',
        teacherComment: item.feedback || 'No comment recorded.',
        course: (classes || []).find(c => c.id === item.classId)?.name || 'Learning Evidence',
        competencies: item.tags || ['General Competency'],
        tags: item.tags || ['Evidence']
      }));

      setStudentData({
        name: profile?.name || 'Student',
        id: profile?.id || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        grade: profile?.grade || '',
        school: profile?.school || "St. Joseph's Kisii South Academy",
        avatarUrl: profile?.avatarUrl || '',
        interests: profile?.interests || '',
        learningAreas: (classes || []).map(c => ({
          id: c.id,
          name: c.name,
          teacher: c.teacherName || 'Mwalimu TBD',
          progress: c.attendancePercent || 0,
          level: c.averageGrade || 'ME',
          strand: 'CBC Core Strand',
          subStrand: 'Strand Content',
          description: c.description || 'Active CBC Learning Area.'
        })),
        competencies: competenciesData,
        tasks: tasksData,
        portfolio: formattedPortfolio,
        marks: {
          rats: (grades || []).filter(g => g.assignmentTitle?.includes('RAT')).map(g => g.score),
          cats: (grades || []).filter(g => g.assignmentTitle?.includes('CAT')).map(g => g.score)
        },
        attendance: attendanceData,
        aiStudyEnabled: profile?.aiStudyEnabled ?? true
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
    setStudentData(prev => prev ? { ...prev, ...newData } : null);

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
  };

  const toggleTask = (taskId) => {
    setStudentData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
    });
  };

  const toggleAiStudy = () => {
    setStudentData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        aiStudyEnabled: !prev.aiStudyEnabled
      };
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
