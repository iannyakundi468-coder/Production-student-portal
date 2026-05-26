import { Tag, Calendar, BookOpen } from 'lucide-react';

export default function EvidenceGrid({ items }) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">No portfolio items yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Ask your teacher to upload evidence of your work to start building your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-gray-700">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <BookOpen size={48} />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              {item.type}
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
            
            <div className="flex flex-col gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <BookOpen size={14} />
                {item.course}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {item.date}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6">
              {item.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {item.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs rounded-full font-medium">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
