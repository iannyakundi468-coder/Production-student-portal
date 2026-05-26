import { BookOpen, Users, LayoutList } from 'lucide-react';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
          <BookOpen size={24} />
        </div>
        <div className="text-sm font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
          {course.progress}%
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 line-clamp-1" title={course.title}>
        {course.title}
      </h3>
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
        <Users size={16} className="mr-2" />
        <span>{course.teacher}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>
  );
}
