import React, { useState } from 'react';
import { useParentContext } from '../../context/ParentContext';
import { FileText, Image as ImageIcon, X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProgressViewer() {
  const { activeChild, t } = useParentContext();
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeTab, setActiveTab] = useState('progress'); // progress or gallery

  if (!activeChild) return null;

  const getTagClass = (skill) => {
    switch (skill) {
      case 'Beginning': return 'beginning';
      case 'Developing': return 'developing';
      case 'Proficient': return 'proficient';
      case 'Exemplary': return 'exemplary';
      default: return 'developing';
    }
  };

  const getCbcPercentage = (level) => {
    switch (level) {
      case 'Beginning': return 25;
      case 'Developing': return 50;
      case 'Proficient': return 75;
      case 'Exemplary': return 100;
      default: return 50;
    }
  };

  const getCbcColor = (level) => {
    switch (level) {
      case 'Beginning': return 'var(--primary)';
      case 'Developing': return 'var(--warning)';
      case 'Proficient': return 'var(--secondary)';
      case 'Exemplary': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  };

  const progressEntries = Object.entries(activeChild.progress || {});
  const totalSubjects = progressEntries.length;

  const levelCounts = {
    Beginning: 0,
    Developing: 0,
    Proficient: 0,
    Exemplary: 0
  };

  progressEntries.forEach(([_, level]) => {
    if (levelCounts[level] !== undefined) {
      levelCounts[level]++;
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          {t.subjectProgress}
        </button>
        <button 
          className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          {t.schoolwork}
        </button>
      </div>

      {activeTab === 'progress' && (
        <>
          {totalSubjects > 0 && (
            <div className="glass-card" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Academic Overview</span>
                <h2 className="section-title" style={{ margin: '0.25rem 0 0.5rem 0', fontFamily: 'Outfit, sans-serif' }}>CBC Evaluation Breakdown</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  Summary of {activeChild.name}'s learning outcomes across all registered subjects.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'var(--border-color)' }}>
                    {Object.entries(levelCounts).map(([level, count]) => {
                      if (count === 0) return null;
                      const width = `${(count / totalSubjects) * 100}%`;
                      return (
                        <motion.div
                          key={level}
                          style={{ width, background: getCbcColor(level) }}
                          initial={{ width: 0 }}
                          animate={{ width }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      );
                    })}
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                    {Object.entries(levelCounts).map(([level, count]) => {
                      if (count === 0) return null;
                      return (
                        <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: getCbcColor(level) }} />
                          <span style={{ color: 'var(--text-main)' }}>{level}: {count} ({Math.round((count / totalSubjects) * 100)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--secondary)' }}>
                    {levelCounts.Exemplary + levelCounts.Proficient}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Strong Areas</div>
                </div>
                <div style={{ width: '1px', height: '50px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--warning)' }}>
                    {levelCounts.Developing + levelCounts.Beginning}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Support Needed</div>
                </div>
              </div>
            </div>
          )}

          <div className="progress-grid">
            {progressEntries.map(([subject, level]) => (
              <div key={subject} className="progress-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CBC Assessment</span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{subject}</h3>
                  <div>
                    <span className={`skill-tag ${getTagClass(level)}`}>{level}</span>
                  </div>
                </div>
                
                <div className="circular-meter" style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg className="circular-svg" width="80" height="80" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle
                      className="circular-bg"
                      cx="40"
                      cy="40"
                      r="30"
                      style={{ fill: 'none', stroke: 'var(--border-color)', strokeWidth: 6 }}
                    />
                    <motion.circle
                      className="circular-fill"
                      cx="40"
                      cy="40"
                      r="30"
                      style={{ fill: 'none', stroke: getCbcColor(level), strokeWidth: 6, strokeLinecap: 'round' }}
                      strokeDasharray={2 * Math.PI * 30}
                      initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - getCbcPercentage(level) / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="circular-val" style={{ position: 'absolute', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: getCbcColor(level) }}>
                    {getCbcPercentage(level)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'gallery' && (
        <div className="schoolwork-gallery">
          {activeChild.schoolwork.length > 0 ? (
            activeChild.schoolwork.map(sw => (
              <div key={sw.id} className="sw-item" onClick={() => setSelectedWork(sw)}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                  {sw.type === 'image' ? <ImageIcon size={48} /> : <FileText size={48} />}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{sw.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{sw.date}</div>
                <span className={`skill-tag ${getTagClass(sw.skill)}`}>{sw.skill}</span>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No schoolwork uploaded yet.
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedWork && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>{selectedWork.title}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedWork.date}</div>
                </div>
                <button onClick={() => setSelectedWork(null)} style={{ padding: '0.5rem' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ background: 'var(--bg-color)', height: '250px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                {selectedWork.imageUrl ? (
                  <img 
                    src={selectedWork.imageUrl.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8787'}${selectedWork.imageUrl}` : selectedWork.imageUrl} 
                    alt={selectedWork.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <>
                    {selectedWork.type === 'image' ? <ImageIcon size={64} color="var(--text-muted)" /> : <FileText size={64} color="var(--text-muted)" />}
                    <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>Preview Not Available</span>
                  </>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Teacher Feedback</h4>
                <p style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)', margin: 0 }}>
                  "{selectedWork.feedback}"
                </p>
              </div>

              <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.875rem', color: '#D97706', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightbulb size={16} /> Ways to Support at Home
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400E' }}>
                  Ask {activeChild.name} to explain what they learned. Practice related activities together for 10 minutes a day.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
