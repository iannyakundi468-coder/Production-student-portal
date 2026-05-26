import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, GraduationCap, Menu, Bell, FolderGit2, Bot } from 'lucide-react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useStudent } from '../context/StudentContext';
import GlobalAiAssistant from '../components/ai/GlobalAiAssistant';
import SomoBloomLogo from '../components/SomoBloomLogo';

export default function PortalLayout() {
  const { studentData, logout: studentLogout } = useStudent();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navItems = [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/portfolio', label: 'Portfolio', icon: FolderGit2 },
    { to: '/student/ai-study', label: 'AI Study Center', icon: Bot },
    { to: '/student/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    studentLogout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      <GlobalAiAssistant />
      
      {/* Sidebar - Hidden on mobile for students */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-600 border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        hidden md:flex flex-col
      `}>
        <div className="h-full flex flex-col w-full">
          {/* Brand */}
          <div className="p-6 flex items-center border-b border-slate-100">
            <SomoBloomLogo size={36} fontSize="17px" />
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Student Menu
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/student'}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Bottom Section */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden border border-slate-200">
                {studentData?.avatarUrl ? (
                  <img src={studentData.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  studentData?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{studentData?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{studentData?.grade}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 group-hover:text-red-500 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/30">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-30">
          
          {/* Mobile Left Section */}
          <div className="flex items-center gap-2 md:hidden">
            <SomoBloomLogo size={32} fontSize="16px" />
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Student</span>
          </div>

          <div className="flex items-center gap-3 md:gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-bold text-indigo-600 uppercase">Clear All</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { id: 1, title: 'Assignment Due', text: 'Math homework is due today.', time: '2h ago' },
                    { id: 2, title: 'New Badge!', text: 'You earned the "Fast Learner" badge.', time: '5h ago' },
                  ].map(n => (
                    <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <p className="text-sm font-bold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{studentData?.name}</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {studentData?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto h-full">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>

        {/* Bottom Navigation (Student Only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 px-2 flex-1 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={20} className="mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
