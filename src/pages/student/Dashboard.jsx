import { useStudent } from '../../context/StudentContext';
import CourseCard from '../../components/dashboard/CourseCard';
import TaskChecklist from '../../components/dashboard/TaskChecklist';
import XPBar from '../../components/gamification/XPBar';
import BadgeGrid from '../../components/gamification/BadgeGrid';
import { Star, ArrowRight, User, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { studentData, isLoading, error, refreshData } = useStudent();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-sm text-slate-500 font-medium">Loading student dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-200 dark:border-red-800">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unable to Load Production Student Data</h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6 text-sm">{error}</p>
        <button
          onClick={refreshData}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow"
        >
          <RefreshCw size={16} />
          Retry Connection
        </button>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-yellow-400 text-slate-900 p-8 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-40 blur-3xl"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-full border-4 border-black/10 bg-black/5 flex items-center justify-center overflow-hidden">
            {studentData.avatarUrl ? (
              <img 
                src={studentData.avatarUrl} 
                alt={studentData.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-black/40" size={32} />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">Welcome back, {(studentData?.name || 'Student').split(' ')[0]}!</h2>
            <p className="text-slate-800 font-medium">{studentData?.grade || 'Student Portal'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-2xl font-bold mb-6">Your Progress</h3>
            <XPBar />
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Star className="text-yellow-500" size={24} />
                Current Courses
              </h3>
              <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={16} />
              </button>
            </div>
            
            {studentData.learningAreas && studentData.learningAreas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentData.learningAreas.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <BookOpen className="mx-auto text-slate-400 mb-3" size={36} />
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">No Learning Areas Registered</h4>
                <p className="text-xs text-slate-500 mt-1">You are not assigned to any live classes at the moment.</p>
              </div>
            )}
          </section>
          
          <section>
            <BadgeGrid />
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-bold mb-6">Action Items</h3>
            <TaskChecklist />
          </section>

          <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-6 text-center shadow-lg">
            <h4 className="text-xl font-bold mb-2">Showcase Your Work</h4>
            <p className="text-purple-200 text-sm mb-6">Update your portfolio to impress teachers and earn extra XP.</p>
            <Link 
              to="/student/portfolio" 
              className="inline-block bg-white text-indigo-600 font-semibold px-6 py-2 rounded-xl w-full hover:bg-gray-50 transition-colors"
            >
              Go to Portfolio
            </Link>
          </section>
        </div>
        
      </div>
    </div>
  );
}
