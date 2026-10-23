import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AlertTriangle, BookOpen, X } from 'lucide-react';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={20} /> Confirm Action</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
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
  const [confirm, setConfirm] = useState(null);
  const [enrollMap, setEnrollMap] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.name.trim() || !form.teacherId) return;
    const teacher = teachers.find(t => t.id === form.teacherId);
    addClass({ name: form.name.trim(), teacherId: form.teacherId, teacher: teacher?.name || '' });
    setForm({ name: '', teacherId: '' });
    setShowForm(false);
  };

  const handleEnroll = (classId) => {
    const studentId = enrollMap[classId];
    if (!studentId) return;
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    const clsStudents = Array.isArray(cls.students) ? cls.students : [];
    if (clsStudents.includes(studentId)) return; // duplicate guard
    enrollStudent(classId, studentId);
    setEnrollMap(p => ({ ...p, [classId]: '' }));
  };

  const confirmRemove = (classId, studentId) => {
    const s = students.find(x => x.id === studentId);
    setConfirm({
      message: `Remove ${s?.name} from this class?`,
      onConfirm: () => { removeStudent(classId, studentId); setConfirm(null); }
    });
  };

  return (
    <div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><BookOpen size={32} /> Academic &amp; Class Setup</h1>
          <p>Create classes, assign teachers, and enroll students.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {showForm ? <><X size={16} /> Cancel</> : '+ New Class'}
        </button>
      </div>

      {/* New Class Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>New Class</div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label>Class Name</label>
              <input
                className="input"
                placeholder="e.g. Grade 4 East or PP1"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Assigned Teacher</label>
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

      {/* Classes list */}
      {(classes || []).map(cls => {
        const clsStudents = Array.isArray(cls.students) ? cls.students : [];
        const enrolledStudents = students.filter(s => clsStudents.includes(s.id));
        return (
          <div key={cls.id} className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <div className="card-title">{cls.name}</div>
                <div className="card-subtitle">Assigned Teacher: {cls.teacher || 'Unassigned'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${cls.status === 'active' || !cls.status ? 'badge-green' : 'badge-gray'}`}>{cls.status || 'active'}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {clsStudents.length} enrolled student{clsStudents.length === 1 ? '' : 's'}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => updateClass(cls.id, { status: cls.status === 'active' ? 'inactive' : 'active' })}
                >
                  {cls.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>

            {/* Enrolled students */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {enrolledStudents.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No students enrolled yet.</span>}
              {enrolledStudents.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card-hover)', border: '1px solid var(--border)', borderRadius: 99, padding: '4px 10px' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</span>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                    onClick={() => confirmRemove(cls.id, s.id)}
                  ><X size={14} /></button>
                </div>
              ))}
            </div>

            {/* Enroll student dropdown */}
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                className="select"
                style={{ maxWidth: 260 }}
                value={enrollMap[cls.id] || ''}
                onChange={e => setEnrollMap(p => ({ ...p, [cls.id]: e.target.value }))}
              >
                <option value="">Enroll a student…</option>
                {students
                  .filter(s => !clsStudents.includes(s.id))
                  .map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)
                }
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(cls.id)}>Enroll</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
