import { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useAuth } from '../../../context/AuthContext';
import AIAssistant from '../AIAssistant';
import SomoBloomLogo from '../../SomoBloomLogo';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, CircleDollarSign, Calendar, Settings as SettingsIcon, Menu, LogOut, FileText, Megaphone } from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'dashboard', icon: <LayoutDashboard size={20} />, section: 'main' },
  { path: '/admin/users', label: 'users', icon: <Users size={20} />, section: 'main' },
  { path: '/admin/classes', label: 'classes', icon: <BookOpen size={20} />, section: 'main' },
  { path: '/admin/admissions', label: 'admissions', icon: <FileText size={20} />, section: 'main' },
  { path: '/admin/finance', label: 'finance', icon: <CircleDollarSign size={20} />, section: 'main' },
  { path: '/admin/timetable', label: 'timetable', icon: <Calendar size={20} />, section: 'main' },
  { path: '/admin/announcements', label: 'announcements', icon: <Megaphone size={20} />, section: 'main' },
  { path: '/admin/settings', label: 'settings', icon: <SettingsIcon size={20} />, section: 'system' },
];

export default function Layout() {
  const { t, currentAdmin, config, updateConfig } = useAdmin();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const titleMap = {
    '/admin': t('dashboard'),
    '/admin/users': t('users'),
    '/admin/classes': t('classes'),
    '/admin/admissions': 'Admissions',
    '/admin/finance': t('finance'),
    '/admin/timetable': t('timetable'),
    '/admin/announcements': 'Announcements',
    '/admin/settings': t('settings'),
  };


  return (
    <div className="admin-portal-theme">
      <div className="layout">
      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>

        {/* Brand Logo */}
        <div style={{
          padding: '20px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <SomoBloomLogo size={32} fontSize="15px" />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.filter(i => i.section === 'main').map(item => (
            <Link
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
              to={item.path}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {t(item.label)}
            </Link>
          ))}

          <div className="nav-section-label" style={{ marginTop: 16 }}>System</div>
          {navItems.filter(i => i.section === 'system').map(item => (
            <Link
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
              to={item.path}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {t(item.label)}
            </Link>
          ))}
          
          <button
            onClick={logout}
            className="nav-item"
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              marginTop: 16,
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}><LogOut size={20} /></span>
            Logout
          </button>
        </nav>

        {/* Admin Badge */}
        <div className="sidebar-footer">
          <div className="admin-badge">
            <div className="admin-avatar">
              {currentAdmin?.avatar || currentAdmin?.name?.[0] || 'A'}
            </div>
            <div className="admin-info">
              <div className="name">{currentAdmin?.name || 'Administrator'}</div>
              <div className="role">SomoBloom Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrap">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="topbar-title">
              {titleMap[location.pathname] || t('dashboard')}
            </div>
          </div>
          <div className="topbar-actions">
            <div className="lang-switcher">
              <button
                className={`lang-btn ${config.language === 'en' ? 'active' : ''}`}
                onClick={() => updateConfig({ language: 'en' })}
              >EN</button>
              <button
                className={`lang-btn ${config.language === 'sw' ? 'active' : ''}`}
                onClick={() => updateConfig({ language: 'sw' })}
              >SW</button>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant Floating Button */}
      <AIAssistant />
      </div>
    </div>
  );
}
