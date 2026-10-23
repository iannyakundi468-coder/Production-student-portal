import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  AlertCircle, 
  FileText, 
  UserPlus, 
  Download, 
  RefreshCw, 
  ChevronRight, 
  Phone, 
  Mail, 
  User, 
  GraduationCap, 
  X, 
  Check, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

function ConfirmModal({ title, message, confirmText, confirmClass, onConfirm, onCancel, details }) {
  return (
    <div className="dialog-overlay" style={{ zIndex: 300 }}>
      <div className="dialog" style={{ maxWidth: 460 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={20} className={confirmClass === 'btn-danger' ? 'text-red-500' : 'text-indigo-600'} />
          {title}
        </h3>
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {message}
        </p>
        {details && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', margin: '14px 0', fontSize: 12 }}>
            {details}
          </div>
        )}
        <div className="dialog-actions" style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${confirmClass || 'btn-primary'}`} onClick={onConfirm}>{confirmText || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
}

function ApplicationReviewDrawer({ app, onClose, onApprove, onReject }) {
  const isPending = app.status === 'pending';
  const isApproved = app.status === 'approved';
  const isRejected = app.status === 'rejected';

  return (
    <div>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel" style={{ width: '480px', maxWidth: '92vw' }}>
        {/* Header */}
        <div className="panel-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={20} className="text-indigo-600" />
              <strong style={{ fontSize: 17, color: 'var(--text-primary)' }}>
                Application #{app.id}
              </strong>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Applicant Dossier &amp; Provisioning Verification
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="panel-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Status Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: isApproved ? 'rgba(16, 185, 129, 0.08)' : isRejected ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${isApproved ? 'rgba(16, 185, 129, 0.25)' : isRejected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            borderRadius: 'var(--radius)',
            padding: '12px 16px'
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Application Status</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: isApproved ? 'var(--green)' : isRejected ? 'var(--red)' : '#d97706', marginTop: 2 }}>
                {isApproved ? 'Approved & Provisioned' : isRejected ? 'Application Declined' : 'Pending Administrative Review'}
              </div>
            </div>
            <span className={`badge ${isApproved ? 'badge-green' : isRejected ? 'badge-red' : 'badge-yellow'}`} style={{ textTransform: 'uppercase', fontSize: 11 }}>
              {app.status || 'Pending'}
            </span>
          </div>

          {/* Student Dossier Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700
              }}>
                {(app.firstName?.[0] || 'S') + (app.lastName?.[0] || 'T')}
              </div>
              <div>
                <strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>{app.firstName} {app.lastName}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Target Grade: <strong>{app.gradeApplyingFor || 'General'}</strong></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12 }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Admission No.:</span>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{app.admissionNumber || `ADM-${app.id}`}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Gender:</span>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{app.gender || 'Not specified'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Submission Date:</span>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{app.createdAt ? app.createdAt.slice(0, 10) : '—'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Target Grade:</span>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{app.gradeApplyingFor || '—'}</div>
              </div>
            </div>
          </div>

          {/* Guardian Information Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={16} className="text-indigo-500" /> Guardian &amp; Primary Contact
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Guardian Name &amp; Relation</span>
                <div style={{ fontWeight: 600 }}>{app.guardianName} ({app.relationship || 'Guardian'})</div>
              </div>

              {app.phoneNumber && (
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Primary Phone Number</span>
                  <div style={{ marginTop: 2 }}>
                    <a href={`tel:${app.phoneNumber}`} style={{ color: 'var(--blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={13} /> {app.phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {app.email && (
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Email Address</span>
                  <div style={{ marginTop: 2 }}>
                    <a href={`mailto:${app.email}`} style={{ color: 'var(--blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={13} /> {app.email}
                    </a>
                  </div>
                </div>
              )}

              {app.emergencyNumber && (
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Emergency Secondary Contact</span>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{app.emergencyNumber}</div>
                </div>
              )}
            </div>
          </div>

          {/* Provisioning Info Box */}
          {isPending && (
            <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius)', padding: '14px', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--blue)', marginBottom: 6 }}>
                <ShieldCheck size={16} /> Automated Provisioning on Approval:
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Auto-generates student user credentials with admission number.</li>
                <li>Creates parent portal account with phone login and links student.</li>
                <li>Auto-enrolls learner into the matching class for {app.gradeApplyingFor || 'their grade'}.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="panel-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {isPending && (
            <>
              <button className="btn btn-danger" onClick={() => onReject(app)}>
                Reject Application
              </button>
              <button className="btn btn-primary" onClick={() => onApprove(app)}>
                Approve &amp; Provision
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WalkInApplicationDrawer({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    gradeApplyingFor: 'Grade 1',
    guardianName: '',
    relationship: 'Mother',
    phoneNumber: '',
    email: '',
    emergencyNumber: '',
    admissionNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.guardianName.trim() || !form.phoneNumber.trim()) {
      alert('Please fill out all required student and guardian fields.');
      return;
    }
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel" style={{ width: '480px', maxWidth: '92vw' }}>
        <div className="panel-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserPlus size={20} className="text-indigo-600" />
              <strong style={{ fontSize: 17, color: 'var(--text-primary)' }}>New Walk-in Application</strong>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Register on-site / office student application
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="panel-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
              Student Information
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label style={{ fontSize: 12, fontWeight: 600 }}>First Name *</label>
                <input className="input" placeholder="e.g. Brian" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label style={{ fontSize: 12, fontWeight: 600 }}>Last Name *</label>
                <input className="input" placeholder="e.g. Otieno" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label style={{ fontSize: 12, fontWeight: 600 }}>Gender</label>
                <select className="select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: 12, fontWeight: 600 }}>Grade Applying For *</label>
                <select className="select" value={form.gradeApplyingFor} onChange={e => set('gradeApplyingFor', e.target.value)}>
                  {['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: 12, fontWeight: 600 }}>Proposed Admission Number (Optional)</label>
              <input className="input" placeholder="Auto-generated if empty" value={form.admissionNumber} onChange={e => set('admissionNumber', e.target.value)} />
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginTop: 8 }}>
              Guardian &amp; Emergency Contacts
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label style={{ fontSize: 12, fontWeight: 600 }}>Guardian Full Name *</label>
                <input className="input" placeholder="e.g. Grace Otieno" value={form.guardianName} onChange={e => set('guardianName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label style={{ fontSize: 12, fontWeight: 600 }}>Relationship</label>
                <select className="select" value={form.relationship} onChange={e => set('relationship', e.target.value)}>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Uncle">Uncle</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: 12, fontWeight: 600 }}>Mobile Phone Number *</label>
              <input className="input" placeholder="0712 345 678" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} required />
            </div>

            <div className="form-group">
              <label style={{ fontSize: 12, fontWeight: 600 }}>Email Address (Optional)</label>
              <input className="input" type="email" placeholder="parent@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            <div className="form-group">
              <label style={{ fontSize: 12, fontWeight: 600 }}>Emergency Contact Phone</label>
              <input className="input" placeholder="Alternative contact" value={form.emergencyNumber} onChange={e => set('emergencyNumber', e.target.value)} />
            </div>
          </div>

          <div className="panel-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Recording Application...' : 'Record Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdmissionsPanel() {
  const { enrollments, updateEnrollmentStatus, fetchAdmissions, createAdmissionSubmission, loading } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Statistics
  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    approved: enrollments.filter(e => e.status === 'approved').length,
    rejected: enrollments.filter(e => e.status === 'rejected').length,
  };

  // Distinct Grades
  const distinctGrades = Array.from(new Set(enrollments.map(e => e.gradeApplyingFor).filter(Boolean)));

  // Filtering
  const filtered = enrollments.filter(e => {
    const fullName = `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase();
    const guardian = (e.guardianName || '').toLowerCase();
    const email = (e.email || '').toLowerCase();
    const phone = (e.phoneNumber || '').toLowerCase();
    const adm = (e.admissionNumber || '').toLowerCase();
    const query = search.trim().toLowerCase();

    const matchesSearch = !query || fullName.includes(query) || guardian.includes(query) || email.includes(query) || phone.includes(query) || adm.includes(query);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || e.gradeApplyingFor === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (fetchAdmissions) {
      await fetchAdmissions();
    }
    setIsRefreshing(false);
  };

  const handleApprovePrompt = (app) => {
    setConfirmState({
      title: 'Approve & Provision Student',
      message: `Are you sure you want to approve the admission application for ${app.firstName} ${app.lastName}?`,
      details: (
        <div>
          <div><strong>Student:</strong> {app.firstName} {app.lastName}</div>
          <div><strong>Target Grade:</strong> {app.gradeApplyingFor || 'General'}</div>
          <div><strong>Guardian:</strong> {app.guardianName} ({app.phoneNumber})</div>
          <div style={{ marginTop: 6, color: 'var(--green)' }}>✓ Student &amp; Parent accounts will be created automatically.</div>
        </div>
      ),
      confirmText: 'Approve & Provision',
      confirmClass: 'btn-primary',
      onConfirm: async () => {
        setConfirmState(null);
        await updateEnrollmentStatus(app.id, 'approved');
        if (selectedApp?.id === app.id) setSelectedApp(null);
      }
    });
  };

  const handleRejectPrompt = (app) => {
    setConfirmState({
      title: 'Decline Admission Application',
      message: `Are you sure you want to decline the enrollment application for ${app.firstName} ${app.lastName}?`,
      confirmText: 'Decline Application',
      confirmClass: 'btn-danger',
      onConfirm: async () => {
        setConfirmState(null);
        await updateEnrollmentStatus(app.id, 'rejected');
        if (selectedApp?.id === app.id) setSelectedApp(null);
      }
    });
  };

  const handleWalkInSubmit = async (formData) => {
    if (createAdmissionSubmission) {
      await createAdmissionSubmission(formData);
    }
    setShowWalkInModal(false);
  };

  const exportCSV = () => {
    const headers = ['Application ID', 'Admission No.', 'Student First Name', 'Student Last Name', 'Gender', 'Grade Applying', 'Guardian Name', 'Relationship', 'Phone', 'Email', 'Status', 'Date'];
    const rows = filtered.map(a => [
      `"${a.id || ''}"`,
      `"${a.admissionNumber || ''}"`,
      `"${(a.firstName || '').replace(/"/g, '""')}"`,
      `"${(a.lastName || '').replace(/"/g, '""')}"`,
      `"${a.gender || ''}"`,
      `"${a.gradeApplyingFor || ''}"`,
      `"${(a.guardianName || '').replace(/"/g, '""')}"`,
      `"${a.relationship || ''}"`,
      `"${a.phoneNumber || ''}"`,
      `"${a.email || ''}"`,
      `"${a.status || 'pending'}"`,
      `"${a.createdAt ? a.createdAt.slice(0, 10) : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `somobloom_admissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-green" style={{ textTransform: 'uppercase', fontSize: 10 }}>Approved</span>;
      case 'rejected':
        return <span className="badge badge-red" style={{ textTransform: 'uppercase', fontSize: 10 }}>Declined</span>;
      default:
        return <span className="badge badge-yellow" style={{ textTransform: 'uppercase', fontSize: 10 }}>Pending</span>;
    }
  };

  return (
    <div>
      {/* Confirm Action Guard */}
      {confirmState && (
        <ConfirmModal
          {...confirmState}
          onCancel={() => setConfirmState(null)}
        />
      )}

      {/* Review Drawer */}
      {selectedApp && (
        <ApplicationReviewDrawer
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={handleApprovePrompt}
          onReject={handleRejectPrompt}
        />
      )}

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <WalkInApplicationDrawer
          onClose={() => setShowWalkInModal(false)}
          onSubmit={handleWalkInSubmit}
        />
      )}

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GraduationCap size={30} className="text-indigo-600" /> Admissions &amp; Enrollment Processing
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Review applicant credentials, verify guardian contacts, and provision student &amp; parent accounts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
            title="Refresh application queue"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={exportCSV}
            disabled={filtered.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
            title="Download applications CSV"
          >
            <Download size={13} />
            Export CSV
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowWalkInModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          >
            <UserPlus size={14} />
            + Walk-in Application
          </button>
        </div>
      </div>

      {/* Interactive Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        {/* Total Card */}
        <div 
          className="card"
          onClick={() => setStatusFilter('all')}
          style={{ 
            padding: '14px 18px', 
            cursor: 'pointer',
            border: statusFilter === 'all' ? '2px solid var(--blue)' : '1px solid var(--border)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Applications</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: 'var(--text-primary)' }}>{stats.total}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>All submissions</div>
        </div>

        {/* Pending Card */}
        <div 
          className="card"
          onClick={() => setStatusFilter('pending')}
          style={{ 
            padding: '14px 18px', 
            cursor: 'pointer',
            border: statusFilter === 'pending' ? '2px solid #f59e0b' : '1px solid var(--border)',
            borderLeft: '4px solid #f59e0b',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#d97706' }}>Pending Review</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: '#d97706' }}>{stats.pending}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Requires action</div>
        </div>

        {/* Approved Card */}
        <div 
          className="card"
          onClick={() => setStatusFilter('approved')}
          style={{ 
            padding: '14px 18px', 
            cursor: 'pointer',
            border: statusFilter === 'approved' ? '2px solid var(--green)' : '1px solid var(--border)',
            borderLeft: '4px solid var(--green)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green)' }}>Approved &amp; Enrolled</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: 'var(--green)' }}>{stats.approved}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Accounts active</div>
        </div>

        {/* Rejected Card */}
        <div 
          className="card"
          onClick={() => setStatusFilter('rejected')}
          style={{ 
            padding: '14px 18px', 
            cursor: 'pointer',
            border: statusFilter === 'rejected' ? '2px solid var(--red)' : '1px solid var(--border)',
            borderLeft: '4px solid var(--red)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--red)' }}>Declined</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: 'var(--red)' }}>{stats.rejected}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Not enrolled</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 36, fontSize: 13, height: 36 }}
              placeholder="Search by student, guardian, phone number, email, or admission ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Grade Selector */}
          <select 
            className="select" 
            style={{ width: 'auto', fontSize: 13, height: 36 }}
            value={gradeFilter} 
            onChange={e => setGradeFilter(e.target.value)}
          >
            <option value="all">All Grades</option>
            {distinctGrades.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
            Status:
          </span>
          {[
            { id: 'all', label: 'All', count: stats.total },
            { id: 'pending', label: 'Pending', count: stats.pending },
            { id: 'approved', label: 'Approved', count: stats.approved },
            { id: 'rejected', label: 'Declined', count: stats.rejected }
          ].map(st => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`badge ${isSelected ? 'badge-blue' : 'badge-gray'}`}
                style={{
                  cursor: 'pointer',
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1px solid var(--blue)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{st.label}</span>
                <span style={{ opacity: 0.7 }}>({st.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 14 }}>Enrollment Queue</strong>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Showing <strong>{filtered.length}</strong> of <strong>{enrollments.length}</strong> applications
          </span>
        </div>

        <div className="table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px' }}>Student Applicant</th>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Target Grade</th>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Guardian Contact</th>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Date</th>
                <th style={{ textAlign: 'center', padding: '12px 14px' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 36, color: 'var(--text-muted)' }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                    <p style={{ margin: 0 }}>Loading applications queue...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                    <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No enrollment applications match your criteria</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12 }}>Try clearing your search query or switching filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((app, index) => {
                  const isPending = app.status === 'pending';
                  const initials = ((app.firstName?.[0] || 'S') + (app.lastName?.[0] || 'T')).toUpperCase();

                  return (
                    <tr 
                      key={app.id || index}
                      style={{ 
                        borderBottom: '1px solid var(--border)',
                        background: index % 2 === 0 ? 'transparent' : 'var(--bg-surface)'
                      }}
                    >
                      {/* Student */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: 'var(--blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              {app.firstName} {app.lastName}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {app.gender || 'Not specified'} · {app.admissionNumber || `ADM-${app.id}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-purple" style={{ fontSize: 11, fontWeight: 600 }}>
                          {app.gradeApplyingFor || 'General'}
                        </span>
                      </td>

                      {/* Guardian */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {app.guardianName} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>({app.relationship || 'Guardian'})</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 2 }}>
                          {app.phoneNumber && (
                            <a href={`tel:${app.phoneNumber}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                              📞 {app.phoneNumber}
                            </a>
                          )}
                          {app.email && (
                            <span style={{ color: 'var(--text-muted)' }}>
                              ✉️ {app.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {app.createdAt ? app.createdAt.slice(0, 10) : '—'}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => setSelectedApp(app)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px' }}
                          >
                            <Eye size={12} /> Review
                          </button>

                          {isPending && (
                            <>
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleApprovePrompt(app)}
                                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px' }}
                                title="Approve application and auto-provision accounts"
                              >
                                <Check size={12} /> Approve
                              </button>
                              <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => handleRejectPrompt(app)}
                                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px' }}
                                title="Decline application"
                              >
                                <X size={12} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
