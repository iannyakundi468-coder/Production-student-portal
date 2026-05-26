import { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import EvidenceGrid from '../components/portfolio/EvidenceGrid';
import { Filter, BarChart2, ClipboardCheck, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  const { studentData } = useStudent();
  const [selectedTag, setSelectedTag] = useState(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(studentData?.portfolio?.flatMap(item => item.tags) || [])
  );

  // Filter items
  const filteredItems = selectedTag
    ? studentData?.portfolio?.filter(item => item.tags.includes(selectedTag))
    : studentData?.portfolio;

  const marks = studentData?.marks || { rats: [], cats: [] };
  const attendance = studentData?.attendance || { present: 0, total: 1 };
  const attendancePercentage = ((attendance.present / attendance.total) * 100).toFixed(0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Student Portfolio</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your academic progress, grades, and attendance.
          </p>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <BarChart2 size={20} />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">RATs Average</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {marks.rats.length > 0 ? (marks.rats.reduce((a, b) => a + b, 0) / marks.rats.length).toFixed(1) : 0}%
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CATs Average</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {marks.cats.length > 0 ? (marks.cats.reduce((a, b) => a + b, 0) / marks.cats.length).toFixed(1) : 0}%
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <ClipboardCheck size={20} />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{attendancePercentage}%</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
            <Calendar size={20} />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Items</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{studentData?.portfolio?.length || 0}</p>
        </motion.div>
      </div>

      {/* Performance Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-500" />
            Performance Trends
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">RAT History</span>
                <span className="text-xs text-gray-500">{marks.rats.length} entries</span>
              </div>
              <div className="flex gap-2 h-20 items-end">
                {marks.rats.map((val, i) => (
                  <div key={i} className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg relative group">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.05, type: "spring" }}
                    ></motion.div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {val}%
                    </div>
                  </div>
                ))}
                {marks.rats.length === 0 && <div className="w-full h-full border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">No entries</div>}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">CAT History</span>
                <span className="text-xs text-gray-500">{marks.cats.length} entries</span>
              </div>
              <div className="flex gap-2 h-20 items-end">
                {marks.cats.map((val, i) => (
                  <div key={i} className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded-t-lg relative group">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-purple-500 rounded-t-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.05, type: "spring" }}
                    ></motion.div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {val}%
                    </div>
                  </div>
                ))}
                {marks.cats.length === 0 && <div className="w-full h-full border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">No entries</div>}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ClipboardCheck size={24} className="text-green-500" />
              Attendance Overview
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)]">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-100 dark:text-gray-700 stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                <motion.circle
                  className="text-green-500 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  initial={{ strokeDasharray: "0, 251.2" }}
                  animate={{ strokeDasharray: `${attendancePercentage * 2.51}, 251.2` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{attendancePercentage}%</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">Present</span>
              </div>
            </div>
            <div className="mt-4 flex gap-6">
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase">Present</p>
                <p className="text-base font-bold">{attendance.present} d</p>
              </div>
              <div className="text-center border-l border-gray-100 dark:border-gray-700 pl-6">
                <p className="text-[10px] text-gray-500 uppercase">Total</p>
                <p className="text-base font-bold">{attendance.total} d</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Gallery Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Academic Evidence</h3>
          {studentData?.portfolio?.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 pr-2 border-r border-gray-200 dark:border-gray-700">
                <Filter size={18} />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTag === null
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <EvidenceGrid items={filteredItems || []} />
      </section>
    </div>
  );
}
