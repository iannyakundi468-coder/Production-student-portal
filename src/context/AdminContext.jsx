import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from '../data/adminMockData';
import { api } from '../lib/api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [activity, setActivity] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [config, setConfig] = useState({ language: 'en' });
  const [loading, setLoading] = useState(true);
  const [delegations, setDelegations] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const user = localStorage.getItem('somobloom_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, classesRes, activityRes, auditRes, configRes, feeStructuresRes, paymentsRes, delegationsRes, enrollmentsRes, announcementsRes] = await Promise.all([
        api.get('/admin/users').catch(() => ({ users: [] })),
        api.get('/admin/classes').catch(() => ({ classes: [] })),
        api.get('/admin/activity').catch(() => ({ activity: [] })),
        api.get('/admin/audit').catch(() => ({ auditLog: [] })),
        api.get('/admin/config').catch(() => ({ config: { language: 'en' } })),
        api.get('/admin/fees/structures').catch(() => ({ feeStructures: [] })),
        api.get('/admin/payments').catch(() => ({ payments: [] })),
        api.get('/admin/delegations').catch(() => ({ delegations: [] })),
        api.get('/admin/admissions').catch(() => api.get('/admin/enrollments')).catch(() => ({ enrollments: [] })),
        api.get('/admin/announcements').catch(() => ({ announcements: [] }))
      ]);
      setUsers(usersRes.users || []);
      setClasses(classesRes.classes || []);
      setActivity(activityRes.activity || []);
      setAuditLog(auditRes.auditLog || []);
      setConfig(configRes.config || { language: 'en' });
      setFeeStructures(feeStructuresRes.feeStructures || []);
      setPayments(paymentsRes.payments || []);
      setDelegations(delegationsRes.delegations || []);
      setEnrollments(enrollmentsRes.enrollments || []);
      setAnnouncements(announcementsRes.announcements || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAdminData = () => {
    fetchData();
  };

  useEffect(() => {
    const token = localStorage.getItem('somobloom_token');
    if (token) {
      fetchData();
      
      // Keep currentAdmin in sync
      try {
        const user = localStorage.getItem('somobloom_user');
        if (user) setCurrentAdmin(JSON.parse(user));
      } catch (e) {}
    } else {
      setLoading(false);
    }
  }, [fetchData]);

  const t = useCallback((key) => {
    return translations[config.language]?.[key] || translations.en[key] || key;
  }, [config.language]);

  // ── User actions ──────────────────────────────────────
  const addUser = async (user) => {
    try {
      let endpoint = '';
      const phoneVal = user.phoneNumber || user.phone || '';
      const payload = {
        name: user.name,
        email: user.email || '',
        phoneNumber: phoneVal,
        password: user.password || Math.random().toString(36).substring(2, 10)
      };

      if (user.role === 'teacher') {
        endpoint = '/admin/teachers';
        payload.department = user.department || '';
      } else if (user.role === 'student') {
        endpoint = '/admin/students';
        payload.studentIdNumber = user.studentId || '';
      } else if (user.role === 'parent') {
        endpoint = '/admin/parents';
        payload.phoneNumber = phoneVal;
      } else {
        throw new Error(`Unsupported user role: ${user.role}`);
      }

      const res = await api.post(endpoint, payload);
      const newUser = {
        id: res.teacher?.id || res.student?.id || res.parent?.id,
        userId: res.teacher?.userId || res.student?.userId || res.parent?.userId,
        name: user.name,
        email: user.email || '',
        role: user.role,
        createdAt: new Date().toISOString(),
        status: 'active',
        department: user.department,
        studentIdNumber: user.studentId,
        phoneNumber: res.teacher?.phoneNumber || res.student?.phoneNumber || res.parent?.phoneNumber || phoneVal
      };

      setUsers(prev => [newUser, ...prev]);
      pushActivity(currentAdmin?.name || 'Admin', 'added user', `${newUser.name} (${newUser.role})`);
      pushAudit(`Added new user ${newUser.name} (${newUser.role})`, 'Users');
    } catch (err) {
      console.error('Failed to add user:', err);
      alert(err.message || 'Failed to add user');
    }
  };

  const updateUser = async (id, patch) => {
    try {
      await api.put(`/admin/users/${id}`, {
        name: patch.name,
        email: patch.email,
        department: patch.department,
        studentIdNumber: patch.studentId,
        phoneNumber: patch.phone
      });

      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
      pushAudit(`Updated user ${patch.name || id}`, 'Users');
    } catch (err) {
      console.error('Failed to update user:', err);
      alert(err.message || 'Failed to update user');
    }
  };

  const deactivateUser = (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
    pushAudit(`${u?.status === 'active' ? 'Deactivated' : 'Activated'} user ${u?.name || id}`, 'Users');
  };

  const deleteUser = async (id) => {
    try {
      const u = users.find(x => x.id === id);
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(x => x.id !== id));
      pushAudit(`Deleted user ${u?.name || id}`, 'Users');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.message || 'Failed to delete user');
    }
  };

  // ── Class actions ─────────────────────────────────────
  const addClass = async (cls) => {
    try {
      const res = await api.post('/admin/classes', {
        name: cls.name,
        teacherProfileId: cls.teacherId
      });

      const newCls = {
        id: res.class.id,
        name: cls.name,
        teacherId: cls.teacherId,
        teacher: users.find(u => u.id === cls.teacherId)?.name || 'Unassigned',
        students: [],
        status: 'active'
      };

      setClasses(prev => [newCls, ...prev]);
      pushAudit(`Created class "${newCls.name}"`, 'Classes');
    } catch (err) {
      console.error('Failed to create class:', err);
      alert(err.message || 'Failed to create class');
    }
  };

  const updateClass = async (id, patch) => {
    try {
      await api.put(`/admin/classes/${id}`, {
        name: patch.name,
        teacherId: patch.teacherId
      });

      setClasses(prev => prev.map(c => {
        if (c.id !== id) return c;
        const teacherName = patch.teacherId 
          ? (users.find(u => u.id === patch.teacherId)?.name || c.teacher)
          : c.teacher;

        return {
          ...c,
          ...patch,
          teacher: teacherName
        };
      }));
      pushAudit(`Updated class "${patch.name || id}"`, 'Classes');
    } catch (err) {
      console.error('Failed to update class:', err);
      alert(err.message || 'Failed to update class');
    }
  };

  const enrollStudent = async (classId, studentId) => {
    try {
      await api.post(`/admin/classes/${classId}/enrollments`, {
        studentProfileId: studentId
      });

      setClasses(prev => prev.map(c => {
        if (c.id !== classId) return c;
        const currentStudents = Array.isArray(c.students) ? c.students : [];
        if (currentStudents.includes(studentId)) return c;
        return { ...c, students: [...currentStudents, studentId] };
      }));

      const student = users.find(u => u.id === studentId);
      const cls = classes.find(c => c.id === classId);
      pushAudit(`Enrolled ${student?.name} in ${cls?.name}`, 'Classes');
    } catch (err) {
      console.error('Failed to enroll student:', err);
      alert(err.message || 'Failed to enroll student');
    }
  };

  const removeStudent = async (classId, studentId) => {
    try {
      await api.delete(`/admin/classes/${classId}/enrollments/${studentId}`).catch(err => {
        console.warn('Backend enrollment deletion fallback:', err);
      });
      setClasses(prev => prev.map(c =>
        c.id === classId ? { ...c, students: (Array.isArray(c.students) ? c.students : []).filter(id => id !== studentId) } : c
      ));
      const student = users.find(u => u.id === studentId);
      const cls = classes.find(c => c.id === classId);
      pushAudit(`Removed ${student?.name || studentId} from ${cls?.name || classId}`, 'Classes');
    } catch (err) {
      console.error('Failed to remove student from class:', err);
      setClasses(prev => prev.map(c =>
        c.id === classId ? { ...c, students: (Array.isArray(c.students) ? c.students : []).filter(id => id !== studentId) } : c
      ));
    }
  };

  // ── Config actions ────────────────────────────────────
  const updateConfig = async (patch) => {
    try {
      const newConfig = { ...config, ...patch };
      const res = await api.put('/admin/config', newConfig);
      if (res.config) setConfig(res.config);
      else setConfig(newConfig);
      
      const key = Object.keys(patch)[0];
      pushAudit(`Updated setting "${key}" to "${patch[key]}"`, 'Settings');
    } catch (err) {
      console.error('Failed to update config:', err);
      // Optimistic update fallback
      setConfig(prev => ({ ...prev, ...patch }));
    }
  };

  // ── Helpers ───────────────────────────────────────────
  const pushActivity = (user, action, detail) => {
    setActivity(prev => [
      { id: `a${Date.now()}`, user, action, detail, time: 'just now', color: '#6366f1' },
      ...prev.slice(0, 9)
    ]);
  };

  const pushAudit = (action, category = 'General') => {
    const now = new Date();
    const time = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const newEntry = {
      id: `al${Date.now()}`,
      time,
      user: currentAdmin?.name || 'Administrator',
      action,
      category
    };
    setAuditLog(prev => [newEntry, ...prev.slice(0, 99)]);

    // Persist to backend database
    api.post('/admin/audit', { action, category }).catch(err => {
      console.warn('Failed to persist audit log to backend:', err);
    });
  };

  const fetchAuditLogs = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);
      if (filters.limit) params.set('limit', filters.limit);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await api.get(`/admin/audit${qs}`);
      if (res && res.auditLog) {
        setAuditLog(res.auditLog);
        return res.auditLog;
      }
      return [];
    } catch (err) {
      console.error('Failed to query audit logs:', err);
      return [];
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await api.get('/admin/activity').catch(() => ({ activity: [] }));
      if (res && res.activity) {
        setActivity(res.activity);
        return res.activity;
      }
      return [];
    } catch (err) {
      console.error('Failed to query activity logs:', err);
      return [];
    }
  };

  // ── Fee Structure Actions ─────────────────────────────
  const addFeeStructure = async (structure) => {
    try {
      const res = await api.post('/admin/fees/structures', structure);
      if (res.feeStructure) {
        setFeeStructures(prev => [...prev, res.feeStructure]);
        pushAudit(`Created fee structure for term ${structure.term}`, 'Finance');
      }
    } catch (err) {
      console.error('Failed to create fee structure:', err);
    }
  };

  const updateFeeStructure = async (id, structure) => {
    try {
      const res = await api.put(`/admin/fees/structures/${id}`, structure);
      if (res.feeStructure) {
        setFeeStructures(prev => prev.map(f => f.id === id ? res.feeStructure : f));
        pushAudit(`Updated fee structure for term ${structure.term}`, 'Finance');
      }
    } catch (err) {
      console.error('Failed to update fee structure:', err);
    }
  };

  // ── Derived metrics ───────────────────────────────────
  const metrics = {
    totalStudents: (users || []).filter(u => u.role === 'student').length,
    totalTeachers: (users || []).filter(u => u.role === 'teacher').length,
    activeClasses: (classes || []).filter(c => c.status === 'active' || !c.status).length,
    pendingFees: (payments || []).filter(p => p.status === 'overdue' || p.status === 'failed')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    totalCollected: (payments || []).filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    failedPayments: (payments || []).filter(p => p.status === 'failed' || p.status === 'overdue').length,
  };

  const toggleDelegation = async (teacherProfileId, responsibility) => {
    try {
      const res = await api.post('/admin/delegations/toggle', { teacherProfileId, responsibility });
      setDelegations(res.delegations || []);
      pushAudit(`Toggled ${responsibility} delegation for teacher ID ${teacherProfileId}`, 'Security');
    } catch (err) {
      console.error('Failed to toggle delegation:', err);
      alert(err.message || 'Failed to toggle delegation');
    }
  };

  const fetchAdmissions = async () => {
    try {
      const res = await api.get('/admin/admissions').catch(() => ({ enrollments: [] }));
      setEnrollments(res.enrollments || []);
      return res.enrollments || [];
    } catch (err) {
      console.error('Failed to fetch admissions:', err);
      return [];
    }
  };

  const createAdmissionSubmission = async (form) => {
    try {
      const res = await api.post('/admin/admissions', form);
      const newSubmission = res.submission || { ...form, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() };
      setEnrollments(prev => [newSubmission, ...prev]);
      pushAudit(`Created walk-in application for ${form.firstName} ${form.lastName}`, 'Admissions');
      return { success: true, submission: newSubmission };
    } catch (err) {
      console.error('Failed to create admission submission:', err);
      const newSubmission = { ...form, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() };
      setEnrollments(prev => [newSubmission, ...prev]);
      return { success: true, submission: newSubmission };
    }
  };

  const updateEnrollmentStatus = async (id, status) => {
    try {
      let result = null;
      if (status === 'approved') {
        result = await api.post(`/admin/admissions/${id}/approve`);
      } else if (status === 'rejected') {
        result = await api.post(`/admin/admissions/${id}/reject`);
      } else {
        result = await api.put(`/admin/enrollments/${id}`, { status });
      }
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      // Refresh admin data to pull newly created users/student profiles if approved
      if (status === 'approved') {
        fetchData();
      }
      pushAudit(`Updated enrollment application ID ${id} status to ${status}`, 'Admissions');
      return { success: true, data: result };
    } catch (err) {
      console.error('Failed to update enrollment status:', err);
      alert(err.message || 'Failed to update enrollment status');
      return { success: false, error: err.message };
    }
  };

  const addAnnouncement = async (announcement) => {
    try {
      await api.post('/admin/announcements', announcement);
      const listRes = await api.get('/admin/announcements').catch(() => ({ announcements: [] }));
      setAnnouncements(listRes.announcements || []);
      pushAudit(`Created announcement: ${announcement.title}`, 'Announcements');
    } catch (err) {
      console.error('Failed to create announcement:', err);
      alert(err.message || 'Failed to create announcement');
    }
  };

  return (
    <AdminContext.Provider value={{
      users, classes, payments, activity, auditLog, config, currentAdmin, metrics, feeStructures,
      delegations, enrollments, announcements,
      t, addUser, updateUser, deactivateUser, deleteUser,
      addClass, updateClass, enrollStudent, removeStudent,
      updateConfig, pushActivity, pushAudit, fetchAuditLogs, fetchActivity, fetchAdmissions, createAdmissionSubmission, addFeeStructure, updateFeeStructure,
      toggleDelegation, updateEnrollmentStatus, refreshAdminData, addAnnouncement
    }}>
      {children}
    </AdminContext.Provider>
  );

}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
};
