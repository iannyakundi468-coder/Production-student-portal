import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const TeacherContext = createContext();

export function TeacherProvider({ children }) {
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTeacherData = async () => {
    const activeToken = localStorage.getItem('somobloom_token');
    if (!activeToken) return;
    setIsLoading(true);
    try {
      const { profile } = await api.get('/teacher/me');
      const { classes } = await api.get('/teacher/classes');
      let portfolio = [];
      try {
        const response = await api.get('/teacher/portfolio');
        portfolio = response.portfolio || [];
      } catch (err) {
        console.warn('Failed to load portfolio items, using empty list:', err);
      }
      
      setTeacherData({
        ...profile,
        classes: (classes || []).map(c => ({
          ...c,
          students: c.students || []
        })),
        portfolioItems: portfolio
      });
    } catch (err) {
      console.error('Failed to fetch teacher data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'staff') {
      fetchTeacherData();
    } else {
      setTeacherData(null);
    }
  }, [user]);

  const addClass = (newClass) => {
    setTeacherData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        classes: [...(prev.classes || []), { ...newClass, id: `c-${Date.now()}`, students: [] }]
      };
    });
  };

  const addStudent = async (classId, student) => {
    try {
      const response = await api.post(`/teacher/classes/${classId}/students`, student);
      if (response.student) {
        setTeacherData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            classes: prev.classes.map(c => 
              c.id === classId 
                ? { 
                    ...c, 
                    students: [...c.students, { 
                      ...student, 
                      id: response.student.id, 
                      portfolioCount: 0, 
                      cbcAssessments: { strands: [], competencies: {} }, 
                      attendance: { present: 0, total: 0 },
                      status: 'active'
                    }] 
                  }
                : c
            )
          };
        });
        return true;
      }
    } catch (err) {
      console.error('Failed to add student:', err);
      alert(err.message || 'Failed to add student');
      return false;
    }
  };

  const removeStudent = (classId, studentId) => {
    setTeacherData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        classes: prev.classes.map(c => 
          c.id === classId 
            ? { ...c, students: c.students.filter(s => s.id !== studentId) }
            : c
        )
      };
    });
  };

  const uploadEvidence = async (formData) => {
    const activeToken = localStorage.getItem('somobloom_token');
    if (activeToken) {
      try {
        const response = await api.postMultipart('/teacher/portfolio/upload', formData);
        if (response.item) {
          setTeacherData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              portfolioItems: [response.item, ...(prev.portfolioItems || [])]
            };
          });
          return true;
        }
      } catch (err) {
        console.error('Failed to upload portfolio evidence to API:', err);
        alert(err.message || 'Failed to upload portfolio evidence');
      }
    }
    return false;
  };

  const updateTags = (itemId, newTags) => {
    setTeacherData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        portfolioItems: prev.portfolioItems.map(item =>
          item.id === itemId ? { ...item, tags: newTags } : item
        )
      };
    });
  };

  const updateProfile = (newData) => {
    setTeacherData(prev => prev ? { ...prev, ...newData } : null);
  };

  const updateAssessmentLevel = async (classId, studentId, type, name, level) => {
    setTeacherData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        classes: prev.classes.map(c => 
          c.id === classId 
            ? {
                ...c,
                students: c.students.map(s =>
                  s.id === studentId
                    ? {
                        ...s,
                        cbcAssessments: {
                          ...s.cbcAssessments,
                          [type]: type === 'strands' 
                            ? (s.cbcAssessments?.strands || []).map(st => st.name === name ? { ...st, level } : st)
                            : { ...s.cbcAssessments?.competencies, [name]: level }
                        }
                      }
                    : s
                )
              }
            : c
        )
      };
    });

    try {
      await api.post(`/teacher/classes/${classId}/assessments`, {
        studentProfileId: studentId,
        type,
        name,
        level
      });
    } catch (err) {
      console.error('Failed to update CBC assessment in backend:', err);
    }
  };

  const updateAttendance = async (classId, studentId, isPresent) => {
    setTeacherData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        classes: prev.classes.map(c => 
          c.id === classId 
            ? {
                ...c,
                students: c.students.map(s =>
                  s.id === studentId
                    ? {
                        ...s,
                        attendance: {
                          ...s.attendance,
                          present: isPresent ? s.attendance.present + 1 : Math.max(0, s.attendance.present - 1),
                          total: s.attendance.total + 1
                        }
                      }
                    : s
                )
              }
            : c
        )
      };
    });

    try {
      await api.post(`/teacher/classes/${classId}/attendance`, {
        studentProfileId: studentId,
        isPresent
      });
    } catch (err) {
      console.error('Failed to log attendance in backend:', err);
    }
  };

  const sendMessage = async (receiverId, subject, content) => {
    try {
      await api.post('/teacher/messages', {
        receiverId,
        subject,
        content
      });
      return true;
    } catch (err) {
      console.error('Failed to send message:', err);
      alert(err.message || 'Failed to send message');
      return false;
    }
  };

  return (
    <TeacherContext.Provider value={{
      teacherData,
      isLoading,
      error,
      addClass,
      addStudent,
      removeStudent,
      uploadEvidence,
      updateTags,
      updateProfile,
      updateAssessmentLevel,
      updateAttendance,
      sendMessage,
      refreshData: fetchTeacherData
    }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
}
