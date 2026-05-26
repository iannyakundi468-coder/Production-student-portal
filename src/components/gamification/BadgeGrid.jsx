import { useGamification } from '../../context/GamificationContext';
import { Lock } from 'lucide-react';

export default function BadgeGrid() {
  const { badges, unlockBadge } = useGamification();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold mb-6">Recent Achievements</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id}
            onClick={() => !badge.unlocked && unlockBadge(badge.id)}
            className={`relative p-4 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer ${
              badge.unlocked 
                ? 'bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 border-yellow-200 dark:border-yellow-900/50 hover:shadow-md hover:-translate-y-1' 
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
            }`}
          >
            {!badge.unlocked && (
              <div className="absolute top-2 right-2 text-gray-400">
                <Lock size={14} />
              </div>
            )}
            
            <div className="text-4xl mb-3 drop-shadow-md">
              {badge.icon}
            </div>
            <h4 className="font-bold text-sm leading-tight mb-1">{badge.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
