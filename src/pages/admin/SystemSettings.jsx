import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Globe, Gamepad2, Bell, Lock, Database, ClipboardList, Settings as SettingsIcon, AlertTriangle, Users } from 'lucide-react';

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
  const { config, updateConfig, auditLog, users, delegations, toggleDelegation } = useAdmin();
  const [active, setActive] = useState('general');


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
            <div key={s.id} className={`settings-nav-item ${active === s.id ? 'active' : ''}`} onClick={() => setActive(s.id)}>
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
            <>
              <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={18} /> Audit Log</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Showing last {auditLog.length} actions. Read-only.</div>
              {auditLog.map(e => (
                <div key={e.id} className="audit-item">
                  <div className="audit-time">{e.time}</div>
                  <div className="audit-action"><strong>{e.user}</strong> — {e.action}</div>
                  <span className="badge badge-gray">{e.category}</span>
                </div>
              ))}
              {auditLog.length === 0 && <div className="empty"><p>No audit entries yet.</p></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
