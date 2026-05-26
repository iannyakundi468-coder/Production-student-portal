import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function TaskChecklist() {
  const { studentData, toggleTask } = useStudent();
  const { tasks } = studentData;

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="text-lg font-bold">Upcoming Tasks</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {pendingTasks.length} tasks remaining
        </p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`p-4 flex items-start gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              {task.completed ? (
                <CheckCircle2 className="text-green-500" size={20} />
              ) : (
                <Circle className="text-gray-400 dark:text-gray-500" size={20} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate">{task.course}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {task.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No tasks found. You're all caught up!
          </div>
        )}
      </div>
    </div>
  );
}
