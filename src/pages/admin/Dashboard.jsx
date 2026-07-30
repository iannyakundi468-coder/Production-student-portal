import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Presentation, AlertTriangle, BookOpen, Shield, ClipboardList, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

function MetricCard({ label, value, icon, colorClass, change, onClick }) {
  return (
    <motion.div 
      className={`metric-card ${colorClass}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      whileHover={onClick ? { y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.06)' } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="metric-icon" style={{ background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>{icon}</span>
      </div>
      <div className="metric-value">{value ?? <span className="skeleton" style={{ width: 60, height: 28, display: 'inline-block' }} />}</div>
      <div className="metric-label">{label}</div>
      {change && <div className="metric-change">{change}</div>}
    </motion.div>
  );
}

export default function Dashboard() {
  const { t, metrics, activity, auditLog, pushActivity, users } = useAdmin();
  const navigate = useNavigate();

  const totalUsers = users.length || 1;
  const numStudents = metrics.totalStudents;
  const numParents = users.filter(u => u.role === 'parent' || u.role === 'guardian').length;
  const numTeachers = metrics.totalTeachers;
  
  const pctStudents = Math.round((numStudents / totalUsers) * 100);
  const pctParents = Math.round((numParents / totalUsers) * 100);
  const pctTeachers = Math.round((numTeachers / totalUsers) * 100);
  
  const C = 251.2; // 2 * pi * 40
  const dashStudents = (pctStudents / 100) * C;
  const dashParents = (pctParents / 100) * C;
  const dashTeachers = (pctTeachers / 100) * C;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1>{t('dashboard')}</h1>
        <p>School-wide overview and security metrics</p>
      </div>

      {/* Metrics (Interactive & Clickable) */}
      <div className="metrics-grid">
        <MetricCard 
          label={t('totalStudents')} 
          value={metrics.totalStudents} 
          icon={<GraduationCap size={20} />} 
          colorClass="indigo" 
          onClick={() => navigate('/admin/users')}
        />
        <MetricCard 
          label={t('totalTeachers')} 
          value={metrics.totalTeachers} 
          icon={<Presentation size={20} />} 
          colorClass="green" 
          onClick={() => navigate('/admin/users')}
        />
        <MetricCard 
          label={t('pendingFees')} 
          value={`KES ${metrics.pendingFees.toLocaleString()}`} 
          icon={<AlertTriangle size={20} />} 
          colorClass="yellow" 
          onClick={() => navigate('/admin/finance')}
        />
        <MetricCard 
          label={t('activeClasses')} 
          value={metrics.activeClasses} 
          icon={<BookOpen size={20} />} 
          colorClass="blue" 
          onClick={() => navigate('/admin/classes')}
        />
      </div>

      {/* Visual Analytics Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* Chart 1: Enrollment Donut */}
        <div className="card" style={{ minWidth: 280 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Enrollment Distribution</div>
              <div className="card-subtitle">User registration ratio</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, gap: 30 }}>
            <svg viewBox="0 0 100 100" style={{ width: 100, height: 100 }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray={`${dashStudents} ${C}`} strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray={`${dashParents} ${C}`} strokeDashoffset={`-${dashStudents}`} />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#4f46e5" strokeWidth="8" strokeDasharray={`${dashTeachers} ${C}`} strokeDashoffset={`-${dashStudents + dashParents}`} />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: '600', color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                Students ({pctStudents}%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: '600', color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                Parents ({pctParents}%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: '600', color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }} />
                Teachers ({pctTeachers}%)
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Fee Collections curved Area */}
        <div className="card" style={{ minWidth: 280 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Fee Collections</div>
              <div className="card-subtitle">KES Cashflow Trend (Monthly)</div>
            </div>
          </div>
          <div style={{ padding: '0 20px', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 100, overflow: 'visible' }}>
              <defs>
                <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#f8fafc" strokeWidth="1.5" />

              <path d="M 10,80 Q 75,35 145,55 T 290,15 L 290,100 L 10,100 Z" fill="url(#feeGrad)" />
              <path d="M 10,80 Q 75,35 145,55 T 290,15" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />

              <circle cx="10" cy="80" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="75" cy="35" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="145" cy="55" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="215" cy="30" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="290" cy="15" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: '700', color: '#94a3b8', marginTop: 8, padding: '0 5px' }}>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Security & Audit Log (Replaces redundant Quick Actions) */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={18} className="text-red-500" /> Security & System Audits</div>
              <div className="card-subtitle">Recent administrative operations</div>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/admin/settings')}
            >
              Configure
            </button>
          </div>
          <div className="divide-y divide-slate-100 px-6 py-2">
            {auditLog && auditLog.length > 0 ? (
              auditLog.slice(0, 4).map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{log.action}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>User: <strong>{log.user}</strong></p>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{log.time.split(' ')[1] || log.time}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No audit entries recorded.
              </div>
            )}
          </div>
        </div>

        {/* Activity log */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={18} /> {t('recentActivity')}</div>
              <div className="card-subtitle">Live system events</div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => pushActivity('Admin Super', 'viewed dashboard', '')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          <div className="activity-list">
            {activity.length === 0 && (
              <div className="empty"><p>No recent activity.</p></div>
            )}
            {activity.map(a => (
              <div key={a.id} className="activity-item">
                <div className="activity-dot" style={{ background: a.color }} />
                <div className="activity-text">
                  <strong>{a.user}</strong> {a.action}
                  {a.detail && <> — <em>{a.detail}</em></>}
                </div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
