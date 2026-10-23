import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Presentation, 
  AlertTriangle, 
  BookOpen, 
  Shield, 
  ClipboardList, 
  RefreshCw, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

function MetricCard({ label, value, icon, colorClass, change, onClick, subtitle }) {
  return (
    <motion.div 
      className={`metric-card ${colorClass}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', position: 'relative' }}
      whileHover={onClick ? { y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="metric-icon" style={{ background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>{icon}</span>
      </div>
      <div className="metric-value">{value ?? <span className="skeleton" style={{ width: 60, height: 28, display: 'inline-block' }} />}</div>
      <div className="metric-label">{label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        {change ? <div className="metric-change">{change}</div> : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{subtitle || 'Click to view'}</span>}
        <ArrowUpRight size={14} style={{ opacity: 0.5 }} />
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { t, metrics, activity, auditLog, fetchActivity, refreshAdminData, users } = useAdmin();
  const [isRefreshingActivity, setIsRefreshingActivity] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const navigate = useNavigate();

  const handleRefreshActivity = async () => {
    setIsRefreshingActivity(true);
    try {
      if (fetchActivity) {
        await fetchActivity();
      } else if (refreshAdminData) {
        await refreshAdminData();
      }
    } finally {
      setIsRefreshingActivity(false);
    }
  };

  const handleActivityClick = (action) => {
    const act = (action || '').toLowerCase();
    if (act.includes('user') || act.includes('teacher') || act.includes('student') || act.includes('parent')) {
      navigate('/admin/users');
    } else if (act.includes('payment') || act.includes('fee') || act.includes('kes') || act.includes('m-pesa')) {
      navigate('/admin/finance');
    } else if (act.includes('class') || act.includes('roster')) {
      navigate('/admin/classes');
    } else if (act.includes('admission') || act.includes('enroll')) {
      navigate('/admin/admissions');
    } else if (act.includes('announcement')) {
      navigate('/admin/announcements');
    } else {
      navigate('/admin/settings?tab=audit');
    }
  };

  const totalUsers = users?.length || 1;
  const numStudents = metrics.totalStudents || 0;
  const numParents = (users || []).filter(u => u.role === 'parent' || u.role === 'guardian').length;
  const numTeachers = metrics.totalTeachers || 0;
  
  const pctStudents = Math.round((numStudents / totalUsers) * 100);
  const pctParents = Math.round((numParents / totalUsers) * 100);
  const pctTeachers = Math.round((numTeachers / totalUsers) * 100);
  
  const C = 251.2; // 2 * pi * 40
  const dashStudents = (pctStudents / 100) * C;
  const dashParents = (pctParents / 100) * C;
  const dashTeachers = (pctTeachers / 100) * C;

  const monthlyPoints = [
    { month: 'Jan', val: 'KES 420,000', x: 10, y: 80 },
    { month: 'Feb', val: 'KES 590,000', x: 75, y: 35 },
    { month: 'Mar', val: 'KES 520,000', x: 145, y: 55 },
    { month: 'Apr', val: 'KES 680,000', x: 215, y: 30 },
    { month: 'May', val: 'KES 850,000', x: 290, y: 15 }
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1>{t('dashboard')}</h1>
        <p>School-wide operations overview &amp; live performance telemetry</p>
      </div>

      {/* Metrics (Interactive & Clickable with Direct Navigation) */}
      <div className="metrics-grid">
        <MetricCard 
          label={t('totalStudents')} 
          value={metrics.totalStudents} 
          icon={<GraduationCap size={20} />} 
          colorClass="indigo" 
          change="+2 this term"
          subtitle="View students"
          onClick={() => navigate('/admin/users?role=student')}
        />
        <MetricCard 
          label={t('totalTeachers')} 
          value={metrics.totalTeachers} 
          icon={<Presentation size={20} />} 
          colorClass="green" 
          subtitle="View faculty"
          onClick={() => navigate('/admin/users?role=teacher')}
        />
        <MetricCard 
          label={t('pendingFees')} 
          value={`KES ${(metrics.pendingFees ?? 0).toLocaleString()}`} 
          icon={<AlertTriangle size={20} />} 
          colorClass="yellow" 
          subtitle="View pending fees"
          onClick={() => navigate('/admin/finance')}
        />
        <MetricCard 
          label={t('activeClasses')} 
          value={metrics.activeClasses} 
          icon={<BookOpen size={20} />} 
          colorClass="blue" 
          subtitle="Manage classes"
          onClick={() => navigate('/admin/classes')}
        />
      </div>

      {/* Visual Analytics Overview (Interactive Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* Card 1: Enrollment Donut */}
        <motion.div 
          className="card" 
          onClick={() => navigate('/admin/users')}
          whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
          transition={{ duration: 0.2 }}
          style={{ minWidth: 280, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={18} className="text-indigo-600" /> Enrollment Distribution
                </div>
                <div className="card-subtitle">User registration ratio across school</div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, gap: 28 }}>
              <svg viewBox="0 0 100 100" style={{ width: 110, height: 110 }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="9" strokeDasharray={`${dashStudents} ${C}`} strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="9" strokeDasharray={`${dashParents} ${C}`} strokeDashoffset={`-${dashStudents}`} />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#4f46e5" strokeWidth="9" strokeDasharray={`${dashTeachers} ${C}`} strokeDashoffset={`-${dashStudents + dashParents}`} />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div 
                  onClick={(e) => { e.stopPropagation(); navigate('/admin/users?role=student'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: 'var(--text-primary)', padding: '3px 6px', borderRadius: 6, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981' }} />
                  <span>Students: <strong>{numStudents}</strong> ({pctStudents}%)</span>
                </div>

                <div 
                  onClick={(e) => { e.stopPropagation(); navigate('/admin/users?role=parent'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: 'var(--text-primary)', padding: '3px 6px', borderRadius: 6, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f59e0b' }} />
                  <span>Parents: <strong>{numParents}</strong> ({pctParents}%)</span>
                </div>

                <div 
                  onClick={(e) => { e.stopPropagation(); navigate('/admin/users?role=teacher'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: 'var(--text-primary)', padding: '3px 6px', borderRadius: 6, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#4f46e5' }} />
                  <span>Teachers: <strong>{numTeachers}</strong> ({pctTeachers}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 600, color: 'var(--blue)' }}>
            <span>Explore user management directory</span>
            <ChevronRight size={14} />
          </div>
        </motion.div>

        {/* Card 2: Fee Collections curved Area */}
        <motion.div 
          className="card" 
          onClick={() => navigate('/admin/finance')}
          whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
          transition={{ duration: 0.2 }}
          style={{ minWidth: 280, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={18} className="text-amber-500" /> Fee Collections
                </div>
                <div className="card-subtitle">KES Cashflow Trend (Monthly Telemetry)</div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>

            <div style={{ padding: '0 10px', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {hoveredPoint ? `${hoveredPoint.month}: ${hoveredPoint.val}` : 'Total Collections YTD'}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--green)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: 99 }}>
                  KES {(metrics.totalCollected ?? 0).toLocaleString()}
                </span>
              </div>

              <svg viewBox="0 0 300 100" style={{ width: '100%', height: 90, overflow: 'visible' }}>
                <defs>
                  <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeWidth="1.5" />

                <path d="M 10,80 Q 75,35 145,55 T 290,15 L 290,100 L 10,100 Z" fill="url(#feeGrad)" />
                <path d="M 10,80 Q 75,35 145,55 T 290,15" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />

                {monthlyPoints.map((pt, i) => (
                  <circle
                    key={pt.month}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.month === pt.month ? 6.5 : 4.5}
                    fill={i === 4 ? '#10b981' : '#f59e0b'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredPoint(pt);
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: '700', color: 'var(--text-muted)', marginTop: 8, padding: '0 5px' }}>
                {monthlyPoints.map(p => (
                  <span key={p.month} style={{ color: hoveredPoint?.month === p.month ? 'var(--blue)' : 'inherit' }}>
                    {p.month}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 600, color: 'var(--blue)' }}>
            <span>View complete financial ledger &amp; fee structures</span>
            <ChevronRight size={14} />
          </div>
        </motion.div>

      </div>

      {/* Security Audits & Recent Activity Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Card 3: Security & System Audits */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={18} className="text-red-500" /> Security &amp; System Audits
                </div>
                <div className="card-subtitle">Real-time ledger of administrative &amp; academic operations</div>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/admin/settings?tab=audit')}
                style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                View All Audits <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 px-6 py-2">
              {auditLog && auditLog.length > 0 ? (
                auditLog.slice(0, 5).map((log) => (
                  <div 
                    key={log.id} 
                    onClick={() => navigate(`/admin/settings?tab=audit&category=${encodeURIComponent(log.category || 'All')}`)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--bg-card-hover)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    title={`Click to filter audit trail by ${log.category || 'General'}`}
                  >
                    <div style={{ maxWidth: '80%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span className={`badge ${
                          log.category === 'Security' ? 'badge-red' :
                          log.category === 'Grading' ? 'badge-red' :
                          log.category === 'Finance' ? 'badge-green' :
                          log.category === 'Attendance' ? 'badge-blue' :
                          log.category === 'Users' ? 'badge-blue' :
                          log.category === 'Admissions' ? 'badge-purple' :
                          log.category === 'Portfolio' ? 'badge-purple' :
                          'badge-gray'
                        }`} style={{ fontSize: '10px', padding: '1px 6px', textTransform: 'uppercase' }}>
                          {log.category || 'General'}
                        </span>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.action}
                        </p>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                        Performed by: <strong>{log.user}</strong>
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {(typeof log.time === 'string' && log.time.includes(' ') ? log.time.split(' ')[1] : log.time) || ''}
                      </span>
                      <ChevronRight size={13} style={{ opacity: 0.4 }} />
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No audit entries recorded yet.
                </div>
              )}
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/settings?tab=audit')}
            style={{ 
              borderTop: '1px solid var(--border)', 
              padding: '12px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontSize: 12, 
              fontWeight: 600, 
              color: 'var(--blue)', 
              cursor: 'pointer' 
            }}
          >
            <span>Open immutable security &amp; audit trail</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Card 4: Recent Activity */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ClipboardList size={18} /> {t('recentActivity')}
                </div>
                <div className="card-subtitle">Live system events &amp; administrative triggers</div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleRefreshActivity}
                disabled={isRefreshingActivity}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                title="Refresh live activity"
              >
                <RefreshCw size={12} className={isRefreshingActivity ? 'animate-spin' : ''} />
                {isRefreshingActivity ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="activity-list" style={{ padding: '8px 12px' }}>
              {activity.length === 0 && (
                <div className="empty"><p>No recent activity.</p></div>
              )}
              {activity.map(a => (
                <div 
                  key={a.id} 
                  className="activity-item"
                  onClick={() => handleActivityClick(a.action)}
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '8px 10px', 
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  title="Click to jump to related section"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: '85%' }}>
                    <div className="activity-dot" style={{ background: a.color, flexShrink: 0 }} />
                    <div className="activity-text" style={{ fontSize: 13 }}>
                      <strong>{a.user}</strong> {a.action}
                      {a.detail && <> — <em>{a.detail}</em></>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="activity-time" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</div>
                    <ChevronRight size={13} style={{ opacity: 0.4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            onClick={() => navigate('/admin/settings?tab=audit')}
            style={{ 
              borderTop: '1px solid var(--border)', 
              padding: '12px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontSize: 12, 
              fontWeight: 600, 
              color: 'var(--blue)', 
              cursor: 'pointer' 
            }}
          >
            <span>View historical activity &amp; audit history</span>
            <ChevronRight size={14} />
          </div>
        </div>

      </div>
    </div>
  );
}
