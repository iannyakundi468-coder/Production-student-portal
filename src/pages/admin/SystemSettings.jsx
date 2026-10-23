import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Globe, Gamepad2, Bell, Lock, Database, ClipboardList, Settings as SettingsIcon, AlertTriangle, Users, Search, Download, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  { id: 'general', label: 'General', icon: <Globe size={18} /> },
  { id: 'gamification', label: 'Gamification', icon: <Gamepad2 size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'permissions', label: 'Permissions', icon: <Lock size={18} /> },
  { id: 'data', label: 'Data & Retention', icon: <Database size={18} /> },
  { id: 'audit', label: 'Audit Log', icon: <ClipboardList size={18} /> },
];

function Toggle({ on, onChange }) {
  return <div className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} />;
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <div className="toggle-label">{label}</div>
        {desc && <div className="toggle-desc">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export default function SystemSettings() {
  const { config, updateConfig, auditLog, fetchAuditLogs, users, delegations, toggleDelegation } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const categoryParam = searchParams.get('category');
  const [active, setActive] = useState(tabParam || 'general');

  const [auditCategory, setAuditCategory] = useState(categoryParam || 'All');
  const [auditSearch, setAuditSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (tabParam && tabParam !== active) {
      setActive(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (categoryParam && categoryParam !== auditCategory) {
      setAuditCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleNavClick = (id) => {
    setActive(id);
    setSearchParams({ tab: id });
  };

  const handleRefreshAudit = async () => {
    setIsRefreshing(true);
    if (fetchAuditLogs) {
      await fetchAuditLogs({ category: auditCategory, search: auditSearch });
    }
    setIsRefreshing(false);
  };

  const filteredAuditLogs = (auditLog || []).filter(item => {
    const matchesCategory = auditCategory === 'All' || (item.category || '').toLowerCase() === auditCategory.toLowerCase();
    const query = auditSearch.trim().toLowerCase();
    const matchesSearch = !query || 
      (item.action || '').toLowerCase().includes(query) ||
      (item.user || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query) ||
      (item.time || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const exportAuditCSV = () => {
    const headers = ['Timestamp', 'Category', 'User', 'Action'];
    const rows = filteredAuditLogs.map(l => [
      `"${(l.time || '').replace(/"/g, '""')}"`,
      `"${(l.category || 'General').replace(/"/g, '""')}"`,
      `"${(l.user || '').replace(/"/g, '""')}"`,
      `"${(l.action || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `somobloom_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><SettingsIcon size={32} /> System Settings</h1>
        <p>Configure how the entire platform behaves. Admin-only access.</p>
      </div>

      <div className="settings-grid">
        {/* Nav */}
        <div className="settings-nav">
          {SECTIONS.map(s => (
            <div key={s.id} className={`settings-nav-item ${active === s.id ? 'active' : ''}`} onClick={() => handleNavClick(s.id)}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{s.icon}</span> {s.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="card">
          {active === 'general' && (
            <>
              <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Globe size={18} /> General Settings</div>
              <SettingRow label="Default Language" desc="Controls the language shown across all portals by default.">
                <select className="select" style={{ width: 'auto' }} value={config.language} onChange={e => updateConfig({ language: e.target.value })}>
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </select>
              </SettingRow>
            </>
          )}

          {active === 'gamification' && (
            <>
              <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Gamepad2 size={18} /> Gamification</div>
              <SettingRow label="Enable Badges" desc="Students earn badges when they hit XP milestones.">
                <Toggle on={config.badgesEnabled} onChange={v => updateConfig({ badgesEnabled: v })} />
              </SettingRow>
              <SettingRow label="Enable Leaderboard" desc="Show ranked student XP across classes.">
                <Toggle on={config.leaderboardEnabled} onChange={v => updateConfig({ leaderboardEnabled: v })} />
              </SettingRow>
              <SettingRow label="XP to Level Up" desc="Points required for a student to advance a level.">
                <input className="input" style={{ width: 90, textAlign: 'center' }} type="number" min="10" value={config.xpLevelUp} onChange={e => updateConfig({ xpLevelUp: Number(e.target.value) })} />
              </SettingRow>
              <SettingRow label="XP to Earn Badge" desc="Points required to unlock a badge.">
                <input className="input" style={{ width: 90, textAlign: 'center' }} type="number" min="50" value={config.xpBadge} onChange={e => updateConfig({ xpBadge: Number(e.target.value) })} />
              </SettingRow>
            </>
          )}

          {active === 'notifications' && (
            <>
              <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={18} /> Notification Settings</div>
              <SettingRow label="Payment Received Alert" desc="Notify admin when a payment is processed.">
                <Toggle on={config.notifyPayment} onChange={v => updateConfig({ notifyPayment: v })} />
              </SettingRow>
              <SettingRow label="Portfolio Upload Alert" desc="Notify when a teacher uploads new work.">
                <Toggle on={config.notifyPortfolio} onChange={v => updateConfig({ notifyPortfolio: v })} />
              </SettingRow>
              <SettingRow label="Announcement Alert" desc="Notify all parents when a new announcement is posted.">
                <Toggle on={config.notifyAnnouncement} onChange={v => updateConfig({ notifyAnnouncement: v })} />
              </SettingRow>
            </>
          )}

          {active === 'permissions' && (
            <>
              <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={18} /> Role Permissions</div>
              <SettingRow label="Parent Messaging" desc="Allow parents to send messages to teachers through the portal.">
                <Toggle on={config.allowParentMessaging} onChange={v => updateConfig({ allowParentMessaging: v })} />
              </SettingRow>
              <SettingRow label="Student Leaderboard Visibility" desc="Let students view each other's XP ranking.">
                <Toggle on={config.allowStudentLeaderboard} onChange={v => updateConfig({ allowStudentLeaderboard: v })} />
              </SettingRow>

              <div style={{ margin: '24px 0 16px 0', borderTop: '1px solid var(--border)' }} />

              <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Users size={18} /> Responsibility Delegation</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Delegate specific administrative modules to teachers. Delegated teachers will get access to these panels in their portals.
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ textAlign: 'left', padding: '10px 8px' }}>Teacher</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px' }}>Department</th>
                      <th style={{ textAlign: 'center', padding: '10px 8px' }}>Admissions</th>
                      <th style={{ textAlign: 'center', padding: '10px 8px' }}>Finances</th>
                      <th style={{ textAlign: 'center', padding: '10px 8px' }}>Timetable</th>
                      <th style={{ textAlign: 'center', padding: '10px 8px' }}>Announcements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'teacher').map(teacher => {
                      const teacherDelegations = delegations
                        .filter(d => d.teacherProfileId === teacher.id)
                        .map(d => d.responsibility);
                      return (
                        <tr key={teacher.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ fontWeight: 600 }}>{teacher.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{teacher.email}</div>
                          </td>
                          <td style={{ padding: '12px 8px' }}>{teacher.department || 'General'}</td>
                          <td style={{ padding: '12px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 48 }}>
                            <Toggle
                              on={teacherDelegations.includes('admissions')}
                              onChange={() => toggleDelegation(teacher.id, 'admissions')}
                            />
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Toggle
                                on={teacherDelegations.includes('finances')}
                                onChange={() => toggleDelegation(teacher.id, 'finances')}
                              />
                            </div>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Toggle
                                on={teacherDelegations.includes('timetable')}
                                onChange={() => toggleDelegation(teacher.id, 'timetable')}
                              />
                            </div>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Toggle
                                on={teacherDelegations.includes('announcements')}
                                onChange={() => toggleDelegation(teacher.id, 'announcements')}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {users.filter(u => u.role === 'teacher').length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                          No teachers available to delegate responsibilities to.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {active === 'data' && (
            <>
              <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><Database size={18} /> Data &amp; Retention</div>
              <SettingRow label="Data Retention Period (years)" desc="How long student and payment data is kept before archival.">
                <input className="input" style={{ width: 90, textAlign: 'center' }} type="number" min="1" max="20" value={config.dataRetentionYears} onChange={e => updateConfig({ dataRetentionYears: Number(e.target.value) })} />
              </SettingRow>
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--red-bg)', border: '1px solid var(--red)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--red)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={16} /> Data purge actions are permanent and irreversible. Only super-admins can trigger them.</div>
              </div>
            </>
          )}

          {active === 'audit' && (
            <div>
              {/* Header with Title and Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ClipboardList size={20} className="text-indigo-600" />
                    System Audit Trail & Security Ledger
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                    Live, immutable record of administrative actions, teacher grade & attendance updates, user modifications, and security events.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleRefreshAudit}
                    disabled={isRefreshing}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                  >
                    <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={exportAuditCSV}
                    disabled={filteredAuditLogs.length === 0}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                  >
                    <Download size={13} />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Status & Integrity Banner */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 16,
                fontSize: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-main)' }}>
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span style={{ fontWeight: 600 }}>Immutable Ledger Active:</span>
                  <span style={{ color: 'var(--text-muted)' }}>School ID: {config.schoolId || 'Primary School'}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  Showing <strong>{filteredAuditLogs.length}</strong> of <strong>{auditLog.length}</strong> events
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input"
                    placeholder="Search logs by teacher, student, action description, keyword, or date..."
                    value={auditSearch}
                    onChange={e => setAuditSearch(e.target.value)}
                    style={{ paddingLeft: 36, width: '100%', fontSize: 13 }}
                  />
                  {auditSearch && (
                    <button
                      onClick={() => setAuditSearch('')}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
                    Category:
                  </span>
                  {['All', 'Grading', 'Attendance', 'Security', 'Finance', 'Users', 'Classes', 'Admissions', 'Settings', 'Portfolio', 'Academics', 'Timetable', 'Announcements'].map(cat => {
                    const isSelected = auditCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setAuditCategory(cat)}
                        className={`badge ${isSelected ? 'badge-blue' : 'badge-gray'}`}
                        style={{
                          cursor: 'pointer',
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: isSelected ? 700 : 500,
                          border: isSelected ? '1px solid var(--blue)' : '1px solid transparent',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audit Entries List */}
              <div className="audit-list" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {filteredAuditLogs.length > 0 ? (
                  filteredAuditLogs.map((e, index) => {
                    const categoryLower = (e.category || '').toLowerCase();
                    const badgeClass = 
                      categoryLower === 'security' ? 'badge-red' :
                      categoryLower === 'grading' ? 'badge-red' :
                      categoryLower === 'attendance' ? 'badge-blue' :
                      categoryLower === 'finance' ? 'badge-green' :
                      categoryLower === 'users' ? 'badge-blue' :
                      categoryLower === 'admissions' ? 'badge-purple' :
                      categoryLower === 'portfolio' ? 'badge-purple' :
                      categoryLower === 'settings' ? 'badge-yellow' :
                      categoryLower === 'academics' ? 'badge-green' :
                      'badge-gray';

                    return (
                      <div
                        key={e.id || index}
                        className="audit-item"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '140px 100px 1fr',
                          gap: 12,
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderBottom: index === filteredAuditLogs.length - 1 ? 'none' : '1px solid var(--border)',
                          background: index % 2 === 0 ? 'var(--bg-card)' : 'transparent'
                        }}
                      >
                        <div className="audit-time" style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                          {e.time}
                        </div>

                        <div>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: 10, padding: '2px 8px', textTransform: 'uppercase' }}>
                            {e.category || 'General'}
                          </span>
                        </div>

                        <div className="audit-action" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{e.user}</strong> — {e.action}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ClipboardList size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>No audit log entries match your criteria</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12 }}>Try adjusting your search query or selecting "All" categories.</p>
                    {(auditSearch || auditCategory !== 'All') && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setAuditSearch(''); setAuditCategory('All'); }}
                        style={{ marginTop: 12, fontSize: 12 }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
