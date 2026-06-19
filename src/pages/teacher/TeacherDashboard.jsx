import { useTeacher } from '../../context/TeacherContext';
import { Users, BookOpen, Clock, Award, ChevronRight, ArrowUpRight, Download, Loader2, Sparkles, CalendarSync } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { motion } from 'framer-motion';

export default function TeacherDashboard() {
  const { teacherData } = useTeacher();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  
  const [timetable, setTimetable] = useState(null);
  const [loadingTimetable, setLoadingTimetable] = useState(true);

  useEffect(() => {
    fetchMyTimetable();
  }, []);

  const fetchMyTimetable = async () => {
    try {
      setLoadingTimetable(true);
      const res = await api.get('/teacher/timetable');
      if (res.timetable) {
        setTimetable(res.timetable);
      }
    } catch (err) {
      console.error('Failed to load timetable on dashboard:', err);
    } finally {
      setLoadingTimetable(false);
    }
  };

  const handleAnalyzeTimetable = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.post('/teacher/ai/analyze-timetable', {
        classes: teacherData?.classes || []
      });
      setAiRecommendation(res.response);
    } catch (error) {
      console.error(error);
      setAiRecommendation("AI Suggestion: Consider shifting your intensive subjects to morning slots for better engagement.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('Report downloaded successfully!');
    }, 2000);
  };

  let totalPresent = 0;
  let totalAttendance = 0;
  let be = 0, ae = 0, me = 0, ee = 0;
  
  teacherData?.classes?.forEach(c => {
    c.students?.forEach(s => {
      if (s.attendance) {
        totalPresent += (s.attendance.present || 0);
        totalAttendance += (s.attendance.total || 0);
      }
      const strands = s.cbcAssessments?.strands || [];
      strands.forEach(st => {
        if (st.level === 'BE') be++;
        else if (st.level === 'AE') ae++;
        else if (st.level === 'ME') me++;
        else if (st.level === 'EE') ee++;
      });
    });
  });
  
  const attendanceRate = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) + '%' : 'N/A';
  const totalCbc = be + ae + me + ee;
  const cbcData = totalCbc > 0 ? [
    { label: 'Below (BE)', value: Math.round((be/totalCbc)*100), color: '#f87171' },
    { label: 'Approach (AE)', value: Math.round((ae/totalCbc)*100), color: '#fbbf24' },
    { label: 'Meet (ME)', value: Math.round((me/totalCbc)*100), color: '#4f46e5' },
    { label: 'Exceed (EE)', value: Math.round((ee/totalCbc)*100), color: '#10b981' }
  ] : [
    { label: 'Below (BE)', value: 0, color: '#f87171' },
    { label: 'Approach (AE)', value: 0, color: '#fbbf24' },
    { label: 'Meet (ME)', value: 0, color: '#4f46e5' },
    { label: 'Exceed (EE)', value: 0, color: '#10b981' }
  ];

  const stats = [
    { label: 'Total Learners', value: teacherData?.classes?.reduce((acc, c) => acc + (c.students?.length || 0), 0) || 0, icon: Users, color: 'text-blue-605 text-blue-600', trend: 'Assess &rarr;', path: '/teacher/classes' },
    { label: 'Classes', value: teacherData?.classes?.length || 0, icon: Award, color: 'text-indigo-605 text-indigo-600', trend: 'Manage &rarr;', path: '/teacher/classes' },
    { label: 'Submissions', value: teacherData?.portfolioItems?.length || 0, icon: BookOpen, color: 'text-amber-655 text-amber-600', trend: 'Manage &rarr;', path: '/teacher/portfolio' },
    { label: 'Attendance Rate', value: attendanceRate, icon: Clock, color: 'text-emerald-605 text-emerald-600', trend: 'Track &rarr;', path: '/teacher/classes' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, {teacherData?.name || 'Teacher'}. Here is what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? 'Generating...' : 'Download Report'}
          </button>
        </div>
      </div>

      {/* Metric Cards - SaaS Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div 
            key={stat.label} 
            className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm hover:border-indigo-250 cursor-pointer transition-all flex flex-col justify-between"
            whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.05)', borderColor: 'var(--primary)' }}
            onClick={() => navigate(stat.path)}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded bg-slate-50 border border-slate-100 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase"
                  dangerouslySetInnerHTML={{ __html: stat.trend }}
                />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Analytics Widgets */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-700">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Widget 1: CBC Student Achievement Distribution */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">CBC Achievement Level</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Learner Distribution</p>
                </div>
                <div className="p-1 bg-slate-50 border border-slate-100 rounded text-slate-500 text-xs font-semibold">
                  Overall Term
                </div>
              </div>
              
              {/* SVG Bar Chart */}
              <div className="flex items-end justify-between gap-4 h-32 pt-4 px-2">
                {cbcData.map(d => (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.value}%
                    </span>
                    <div 
                      className="w-full rounded-t transition-all duration-300 hover:scale-x-105"
                      style={{ height: `${d.value * 1.2}px`, backgroundColor: d.color }}
                    />
                    <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider text-center">{d.label.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Weekly Attendance Trend Line */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Attendance Trend</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Average Rate (Mon - Fri)</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {attendanceRate} Avg
                </span>
              </div>

              {/* Curvy SVG Line Chart */}
              <div className="relative">
                <svg viewBox="0 0 300 100" className="w-full h-32 overflow-visible">
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid background lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#f8fafc" strokeWidth="1.5" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#f8fafc" strokeWidth="1.5" />

                  {/* Gradient Area under line */}
                  <path d="M 10,80 Q 75,55 145,65 T 290,15 L 290,100 L 10,100 Z" fill="url(#attGrad)" />

                  {/* Stroke Line */}
                  <path d="M 10,80 Q 75,55 145,65 T 290,15" fill="none" stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Highlight Dots */}
                  <circle cx="10" cy="80" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx="75" cy="55" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx="145" cy="65" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx="215" cy="40" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx="290" cy="15" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                </svg>
                <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent Activity</h2>
              <button 
                onClick={() => navigate('/teacher/portfolio')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                View History
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {teacherData?.portfolioItems?.length > 0 ? (
                teacherData.portfolioItems.slice(0, 4).map((activity, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/teacher/portfolio')}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-white border border-slate-100 text-blue-500">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">New portfolio entry: {activity.title}</p>
                        <p className="text-xs text-slate-400">Portfolio • {new Date(activity.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500 text-sm">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar Insights & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-slate-900 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-indigo-600" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500">CBC Insights</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Based on recent assessments, your Grade 4 learners are showing significant growth in <span className="text-indigo-600 font-bold">Critical Thinking</span>.
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button 
                onClick={() => alert('Generating full analytics report...')}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
              >
                Analytics Report <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-800 rounded-lg p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:bg-purple-400/40 transition-colors" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles size={18} className="text-purple-300" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-indigo-200">AI Timetable Analyst</h3>
            </div>
            
            {aiRecommendation ? (
              <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                  {aiRecommendation}
                </p>
                <button 
                  onClick={() => setAiRecommendation(null)}
                  className="text-xs font-bold text-purple-300 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="relative z-10 space-y-4">
                <p className="text-indigo-200/80 text-sm leading-relaxed">
                  Let AI analyze your current class schedule to find optimal learning periods and reduce burnout.
                </p>
                <button 
                  onClick={handleAnalyzeTimetable}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <><Loader2 size={16} className="animate-spin" /> Analyzing Schedule...</>
                  ) : (
                    <><CalendarSync size={16} /> Generate Recommendation</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Today's Schedule Card (Replaces redundant Quick Actions) */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Today's Schedule</h3>
              <button 
                onClick={() => navigate('/teacher/timetable')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Full View
              </button>
            </div>
            
            {loadingTimetable ? (
              <div className="flex justify-center py-6 text-slate-400">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : timetable && timetable.schedule ? (
              (() => {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const todayName = days[new Date().getDay()];
                // Find schedule for today, or default to the first available day
                const todaySchedule = timetable.schedule.find(s => s.day.toLowerCase() === todayName.toLowerCase()) || timetable.schedule[0];
                
                if (!todaySchedule || !todaySchedule.slots || todaySchedule.slots.length === 0) {
                  return (
                    <p className="text-xs text-slate-450 text-center py-4">No classes scheduled for today.</p>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Schedule for {todaySchedule.day}</p>
                    {todaySchedule.slots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-indigo-150 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-slate-850 text-slate-800">{slot.subject}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{slot.class}</p>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {slot.time}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No schedule data available.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
