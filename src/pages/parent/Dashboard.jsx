import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, PieChart, MessageSquare, Bell, Upload } from 'lucide-react';
import { useParentContext } from '../../context/ParentContext';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { activeChild, data, t, currentParent } = useParentContext();
  const navigate = useNavigate();

  if (!activeChild) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h2>No Student Profiles Found</h2>
        <p>Please contact the school administration to link your student profiles to this account.</p>
      </div>
    );
  }

  const unreadMessagesCount = data.messages.filter(m => !m.read).length;
  const uploadsCount = activeChild.schoolwork.length;

  const feesPaid = activeChild.fees.paidAmount || 0;
  const feesRemaining = activeChild.fees.totalBalance || 0;
  const totalFees = feesPaid + feesRemaining;
  const paidPct = totalFees > 0 ? Math.round((feesPaid / totalFees) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Welcome Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
          Welcome back, {currentParent?.name || 'Parent'}
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Here is a quick overview of <strong>{activeChild.name}</strong>'s school activities, fee status, and updates.
        </p>
      </div>

      {/* Hero Financial Analytics & Gauge Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Fees Hero Card (Interactive) */}
        <motion.div 
          className="glass-card" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
          whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)', borderColor: 'var(--primary)' }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate('/parent/pay')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 2 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>
              {t.currentBalance}
            </span>
            <h1 style={{ margin: 0, fontSize: '2.25rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {activeChild.fees.currency} {feesRemaining.toLocaleString()}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Paid: </span>
                <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{activeChild.fees.currency} {feesPaid.toLocaleString()}</span>
              </div>
              <div style={{ width: '1px', background: 'var(--border-color)' }} />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total: </span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{activeChild.fees.currency} {totalFees.toLocaleString()}</span>
              </div>
            </div>
            <span style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Manage Fees & Pay &rarr;
            </span>
          </div>
          
          {/* Radial Circular Gauge for Fees Paid */}
          <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2 }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle
                cx="50"
                cy="50"
                r="38"
                style={{ fill: 'none', stroke: 'var(--border-color)', strokeWidth: 8 }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                style={{ fill: 'none', stroke: 'var(--secondary)', strokeWidth: 8, strokeLinecap: 'round' }}
                strokeDasharray={2 * Math.PI * 38}
                initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - paidPct / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'var(--secondary)', lineHeight: 1 }}>
                {paidPct}%
              </span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>
                Paid
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          
          {/* Messages Card */}
          <motion.div 
            className="stat-card" 
            style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            whileHover={{ y: -4, boxShadow: 'var(--shadow-md)', borderColor: 'var(--warning)' }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/parent/messages')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={20} />
              </div>
              {unreadMessagesCount > 0 && (
                <span className="tab-badge" style={{ background: 'var(--warning)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 800 }}>NEW</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
                {unreadMessagesCount}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {t.unreadMessages}
              </div>
            </div>
          </motion.div>

          {/* Academic/Uploads Card */}
          <motion.div 
            className="stat-card" 
            style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            whileHover={{ y: -4, boxShadow: 'var(--shadow-md)', borderColor: 'var(--primary)' }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/parent/progress')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={20} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
                {Object.keys(activeChild.progress || {}).length}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Subjects Assessed
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Activity Feed */}
      <h2 className="section-title">{t.activityFeed}</h2>
      <div className="activity-list">
        {activeChild.schoolwork.length === 0 && data.announcements.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            No recent activity recorded.
          </div>
        ) : (
          <>
            {activeChild.schoolwork.map(sw => (
              <div key={sw.id} className="activity-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/parent/progress')}>
                <div className="activity-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Upload size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>New Upload: {sw.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{sw.date}</div>
                </div>
              </div>
            ))}
            {data.announcements.map(ann => (
              <div key={ann.id} className="activity-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/parent/messages')}>
                <div className="activity-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                  <Bell size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{ann.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{ann.date}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}
