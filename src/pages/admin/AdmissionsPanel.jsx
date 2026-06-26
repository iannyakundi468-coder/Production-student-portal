import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, CheckCircle, XCircle, Clock, Eye, AlertCircle, FileText } from 'lucide-react';

export default function AdmissionsPanel() {
  const { enrollments, updateEnrollmentStatus, loading } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  // Statistics
  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    approved: enrollments.filter(e => e.status === 'approved').length,
    rejected: enrollments.filter(e => e.status === 'rejected').length,
  };

  // Filtering
  const filtered = enrollments.filter(e => {
    const fullName = `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase();
    const guardian = (e.guardianName || '').toLowerCase();
    const email = (e.email || '').toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = fullName.includes(query) || guardian.includes(query) || email.includes(query);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-green">Approved</span>;
      case 'rejected':
        return <span className="badge badge-red">Rejected</span>;
      default:
        return <span className="badge badge-yellow">Pending</span>;
    }
  };

  return (
    <div className="admin-portal-theme">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><FileText size={32} /> Admissions Panel</h1>
        <p>Review and process public/parent student enrollment applications.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Applications</div>
          <div className="stat-val">{stats.total}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="stat-label" style={{ color: 'var(--warning-text)' }}>Pending</div>
          <div className="stat-val" style={{ color: 'var(--warning-text)' }}>{stats.pending}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--green)' }}>
          <div className="stat-label" style={{ color: 'var(--green-text)' }}>Approved</div>
          <div className="stat-val" style={{ color: 'var(--green-text)' }}>{stats.approved}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--red)' }}>
          <div className="stat-label" style={{ color: 'var(--red-text)' }}>Rejected</div>
          <div className="stat-val" style={{ color: 'var(--red-text)' }}>{stats.rejected}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} className="search-icon" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 34 }}
              placeholder="Search by student name, guardian name, or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table Wrap */}
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Guardian Details</th>
                <th>Submitted</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>Loading applications...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="empty"><p>No applications found.</p></div></td></tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{app.firstName} {app.lastName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{app.gender || '—'}</div>
                    </td>
                    <td>{app.gradeApplyingFor || '—'}</td>
                    <td>
                      <div><strong>{app.guardianName}</strong> ({app.relationship})</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{app.email} | {app.phoneNumber}</div>
                    </td>
                    <td>{app.createdAt ? app.createdAt.slice(0, 10) : '—'}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedApp(app)}>
                          <Eye size={14} style={{ marginRight: 4 }} /> View
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={() => updateEnrollmentStatus(app.id, 'approved')}>
                              Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => updateEnrollmentStatus(app.id, 'rejected')}>
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 600, width: '90%' }}>
            <div className="modal-header">
              <h3>Application Detail — #{selectedApp.id}</h3>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>&times;</button>
            </div>
            <div className="modal-body" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--primary)' }}>
                  {selectedApp.firstName} {selectedApp.lastName}
                </div>
                {getStatusBadge(selectedApp.status)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Grade Applying For</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.gradeApplyingFor || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Gender</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.gender || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Guardian Name</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.guardianName}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Relationship</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.relationship || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Contact Phone</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.phoneNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Contact Email</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Emergency Contact</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.emergencyNumber || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Submitted Date</div>
                  <div style={{ fontWeight: 600 }}>{selectedApp.createdAt || '—'}</div>
                </div>
              </div>
            </div>
            <div className="panel-footer" style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setSelectedApp(null)}>Close</button>
              {selectedApp.status === 'pending' && (
                <>
                  <button className="btn btn-danger" onClick={() => { updateEnrollmentStatus(selectedApp.id, 'rejected'); setSelectedApp(null); }}>Reject Application</button>
                  <button className="btn btn-primary" onClick={() => { updateEnrollmentStatus(selectedApp.id, 'approved'); setSelectedApp(null); }}>Approve &amp; Accept</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
