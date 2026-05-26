import { useGamification } from '../../context/GamificationContext';
import { Trophy, ArrowUpCircle } from 'lucide-react';

export default function XPBar() {
  const { xp, currentLevel, xpToNextLevel, progressPercentage, earnXp } = useGamification();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
      {/* Background glow based on progress */}
      <div 
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000"
        style={{ width: `${progressPercentage}%` }}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2.5 rounded-xl text-white shadow-md">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Level {currentLevel}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {xpToNextLevel} XP to Level {currentLevel + 1}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            {xp} XP
          </div>
        </div>
      </div>

      <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Hidden button for testing/mock interaction */}
      <button 
        onClick={() => earnXp(50)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ArrowUpCircle size={16} className="text-green-500" />
        Mock: Earn 50 XP
      </button>
    </div>
  );
}
