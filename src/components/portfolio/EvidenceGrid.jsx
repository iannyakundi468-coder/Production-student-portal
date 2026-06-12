import { Tag, Calendar, BookOpen } from 'lucide-react';

export default function EvidenceGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl border-2 border-dashed border-slate-100 p-12 text-center text-slate-800">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <BookOpen size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">No portfolio items yet</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Start uploading evidence of student work to build their professional learning portfolios.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-800">
      {items.map(item => (
        <div key={item.id} className="bg-white border border-slate-200 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
          <div className="h-48 relative overflow-hidden bg-slate-50 border-b border-slate-100">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <BookOpen size={48} />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              {item.type || 'Evidence'}
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold mb-2 line-clamp-2 text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
            
            <div className="flex flex-col gap-2 mb-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                <BookOpen size={14} />
                {item.course || 'General Studies'}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {item.date || new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-slate-600 text-sm line-clamp-3 mb-6 font-medium">
              {item.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {item.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 text-xs rounded-full font-bold">
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
