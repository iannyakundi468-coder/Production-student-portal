import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Megaphone, Send, Calendar, Users, FileText } from 'lucide-react';

export default function AnnouncementsPanel() {
  const { announcements, addAnnouncement, loading } = useAdmin();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both the title and the notice content.');
      return;
    }
    setSubmitting(true);
    try {
      await addAnnouncement({
        title,
        content,
        targetAudience: audience,
      });
      setTitle('');
      setContent('');
      setAudience('all');
      alert('Notice published successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getAudienceBadge = (aud) => {
    switch (aud) {
      case 'teachers':
        return <span className="badge badge-blue">Teachers</span>;
      case 'students':
        return <span className="badge badge-purple">Students</span>;
      case 'parents':
        return <span className="badge badge-green">Parents</span>;
      default:
        return <span className="badge badge-gray">All School</span>;
    }
  };

  return (
    <div className="admin-portal-theme">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Megaphone size={32} /> Announcements Panel</h1>
        <p>Publish and manage announcements, notifications, and notices for parents, students, and staff.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20, alignItems: 'start' }}>
        {/* Publish Form */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <Send size={18} /> New Announcement
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Notice Title</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. End of Term Closing Assembly"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Target Audience</label>
              <select className="select" value={audience} onChange={e => setAudience(e.target.value)}>
                <option value="all">All School (Everyone)</option>
                <option value="teachers">Teachers &amp; Staff Only</option>
                <option value="parents">Parents/Guardians Only</option>
                <option value="students">Students Only</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Announcement Content</label>
              <textarea
                className="input"
                style={{ minHeight: 120, resize: 'vertical' }}
                placeholder="Write the full description or announcement details here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </form>
        </div>

        {/* History / Feed */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <FileText size={18} /> Announcement History
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 24 }}>Loading announcements...</div>
            ) : announcements.length === 0 ? (
              <div className="empty" style={{ padding: 40 }}>
                <p>No announcements have been published yet.</p>
              </div>
            ) : (
              announcements.map((ann, i) => (
                <div key={ann.id || i} style={{ borderBottom: i < announcements.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h4 style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{ann.title}</h4>
                    {getAudienceBadge(ann.targetAudience)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <Calendar size={12} />
                    <span>{ann.createdAt ? ann.createdAt.slice(0, 16).replace('T', ' ') : 'Just Now'}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.5, margin: 0 }}>
                    {ann.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
