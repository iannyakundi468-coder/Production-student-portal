import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AlertTriangle, BookOpen, X, Users, User, ChevronRight, UserPlus, Search, GraduationCap } from 'lucide-react';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" style={{ zIndex: 300 }}>
      <div className="dialog">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={20} className="text-red-500" /> Confirm Action</h3>
        <p style={{ marginTop: 8, fontSize: 14 }}>{message}</p>
        <div className="dialog-actions" style={{ marginTop: 20 }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function ClassInformationDrawer({ cls, teachers, students, onClose, onUpdateStatus, onEnroll, onRemoveStudent }) {
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const clsStudents = Array.isArray(cls.students) ? cls.students : [];
  const enrolledStudentObjects = students.filter(s => clsStudents.includes(s.id));
  const availableStudents = students.filter(s => !clsStudents.includes(s.id));

  const filteredEnrolled = enrolledStudentObjects.filter(s => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
  });

  const handleEnrollClick = () => {
    if (!enrollStudentId) return;
    onEnroll(cls.id, enrollStudentId);
    setEnrollStudentId('');
  };

  return (
    <div>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel" style={{ width: '460px', maxWidth: '92vw' }}>
        {/* Panel Header */}
        <div className="panel-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={20} className="text-indigo-600" />
              <strong style={{ fontSize: 18, color: 'var(--text-primary)' }}>{cls.name}</strong>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Class Information &amp; Student Roster
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Panel Body */}
        <div className="panel-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Class Summary Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={16} className="text-indigo-500" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Assigned Teacher:</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
                {cls.teacher || 'Unassigned'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Status:</span>
                <span className={`badge ${cls.status === 'active' || !cls.status ? 'badge-green' : 'badge-gray'}`}>
                  {cls.status || 'active'}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onUpdateStatus(cls.id, cls.status === 'active' ? 'inactive' : 'active')}
                style={{ fontSize: 11, padding: '3px 8px' }}
              >
                {cls.status === 'active' ? 'Deactivate Class' : 'Activate Class'}
              </button>
            </div>
          </div>

          {/* Enroll New Student Section */}
          <div style={{ background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
              <UserPlus size={16} className="text-indigo-600" />
              Enroll a Student into this Class
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                className="select"
                style={{ flex: 1, fontSize: 13 }}
                value={enrollStudentId}
                onChange={e => setEnrollStudentId(e.target.value)}
              >
                <option value="">Select a student to enroll…</option>
                {availableStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.grade ? `(${s.grade})` : ''}</option>
                ))}
              </select>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleEnrollClick}
                disabled={!enrollStudentId}
                style={{ whiteSpace: 'nowrap' }}
              >
                Enroll
              </button>
            </div>
          </div>

          {/* Enrolled Students Roster */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} className="text-indigo-500" />
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                  Enrolled Students ({enrolledStudentObjects.length})
                </span>
              </div>
            </div>

            {enrolledStudentObjects.length > 5 && (
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input"
                  placeholder="Filter enrolled students..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{ paddingLeft: 32, fontSize: 12, height: 32 }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '320px', overflowY: 'auto' }}>
              {enrolledStudentObjects.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-card)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: 13 }}>
                  <Users size={24} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                  <p style={{ margin: 0 }}>No students enrolled in this class yet.</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11 }}>Use the dropdown above to add students.</p>
                </div>
              ) : filteredEnrolled.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  No students match "{studentSearch}"
                </div>
              ) : (
                filteredEnrolled.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700
                      }}>
                        {(s.name || 'S').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                        {s.email && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.email}</div>}
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--red)', padding: '4px 6px', height: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => onRemoveStudent(cls.id, s.id)}
                      title="Remove from class"
                    >
                      <X size={14} />
                      <span style={{ fontSize: 11 }}>Remove</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="panel-footer" style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ minWidth: 100 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClassSetup() {
  const { users, classes, addClass, updateClass, enrollStudent, removeStudent } = useAdmin();

  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', teacherId: '' });
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedClass = (classes || []).find(c => c.id === selectedClassId) || null;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.name.trim() || !form.teacherId) return;
    const teacher = teachers.find(t => t.id === form.teacherId);
    addClass({ name: form.name.trim(), teacherId: form.teacherId, teacher: teacher?.name || '' });
    setForm({ name: '', teacherId: '' });
    setShowForm(false);
  };

  const handleEnroll = (classId, studentId) => {
    if (!studentId) return;
    enrollStudent(classId, studentId);
  };

  const confirmRemove = (classId, studentId) => {
    const s = students.find(x => x.id === studentId);
    const cls = classes.find(c => c.id === classId);
    setConfirm({
      message: `Remove ${s?.name || 'this student'} from ${cls?.name || 'this class'}?`,
      onConfirm: () => {
        removeStudent(classId, studentId);
        setConfirm(null);
      }
    });
  };

  const filteredClasses = (classes || []).filter(cls => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (cls.name || '').toLowerCase().includes(q) || (cls.teacher || '').toLowerCase().includes(q);
  });

  return (
    <div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      {/* Slide-over Drawer for Class Information */}
      {selectedClass && (
        <ClassInformationDrawer
          cls={selectedClass}
          teachers={teachers}
          students={students}
          onClose={() => setSelectedClassId(null)}
          onUpdateStatus={(id, status) => updateClass(id, { status })}
          onEnroll={handleEnroll}
          onRemoveStudent={confirmRemove}
        />
      )}

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={28} className="text-indigo-600" /> Academic &amp; Class Setup
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Click on any class to view its information, assigned teacher, and enrolled student roster.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(p => !p)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {showForm ? <><X size={16} /> Cancel</> : '+ New Class'}
        </button>
      </div>

      {/* New Class Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, border: '1px solid var(--blue)', boxShadow: '0 4px 12px rgba(99,102,241,0.08)' }}>
          <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <GraduationCap size={18} className="text-indigo-600" /> Create New Class
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label style={{ fontSize: 13, fontWeight: 600 }}>Class Name</label>
              <input
                className="input"
                placeholder="e.g. Grade 4 East, PP1, or Grade 7 Blue"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={{ fontSize: 13, fontWeight: 600 }}>Assigned Teacher</label>
              <select className="select" value={form.teacherId} onChange={e => set('teacherId', e.target.value)}>
                <option value="">Select teacher…</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-primary" onClick={handleAdd} disabled={!form.name.trim() || !form.teacherId}>
              Create Class
            </button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toolbar / Search Filter */}
      {classes && classes.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ position: 'relative', width: 320, maxWidth: '100%' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search classes by name or teacher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 34, fontSize: 13, height: 36 }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Showing <strong>{filteredClasses.length}</strong> of <strong>{classes.length}</strong> classes
          </div>
        </div>
      )}

      {/* Classes List / Grid */}
      {classes.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <BookOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <h3 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--text-primary)' }}>No classes set up yet</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>
            Get started by clicking "+ New Class" above to create your school's classes.
          </p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="card" style={{ padding: '36px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No classes matching "{searchQuery}"
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filteredClasses.map(cls => {
            const clsStudents = Array.isArray(cls.students) ? cls.students : [];
            const isSelected = selectedClassId === cls.id;

            return (
              <div
                key={cls.id}
                className="card"
                onClick={() => setSelectedClassId(cls.id)}
                style={{
                  cursor: 'pointer',
                  padding: '18px 20px',
                  border: isSelected ? '2px solid var(--blue)' : '1px solid var(--border)',
                  transition: 'all 0.2s ease',
                  background: isSelected ? 'rgba(99, 102, 241, 0.03)' : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  {/* Card Top */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <BookOpen size={18} />
                      </div>
                      <strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>{cls.name}</strong>
                    </div>
                    <span className={`badge ${cls.status === 'active' || !cls.status ? 'badge-green' : 'badge-gray'}`} style={{ textTransform: 'uppercase', fontSize: 10 }}>
                      {cls.status || 'active'}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <User size={15} className="text-slate-400" />
                      <span>Teacher: <strong>{cls.teacher || 'Unassigned'}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Users size={15} className="text-slate-400" />
                      <span>
                        <strong>{clsStudents.length}</strong> Enrolled Student{clsStudents.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Foot */}
                <div style={{
                  paddingTop: 12,
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--blue)',
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  <span>Press to view class information</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
