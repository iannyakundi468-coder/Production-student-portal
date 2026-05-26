import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Megaphone, Users, AlertCircle, Info } from 'lucide-react';

interface CreateAnnouncementModalProps {
    onClose: () => void;
    onPost: (announcement: any) => void;
}

export const CreateAnnouncementModal = ({ onClose, onPost }: CreateAnnouncementModalProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [audience, setAudience] = useState('All');
    const [type, setType] = useState('info');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPost({
            title,
            content,
            audience,
            type,
            sender: 'Principal James', // Mock sender
            date: 'Just now',
            id: Date.now()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-lg relative bg-slate-900 border border-slate-700">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">New Announcement</h2>
                        <p className="text-sm text-gray-400">Broadcast a message to the school.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <Input
                            label=""
                            placeholder="e.g., School Closed Tomorrow"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Message Content</label>
                        <textarea
                            className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                            placeholder="Type your announcement here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
                                    value={audience}
                                    onChange={(e) => setAudience(e.target.value)}
                                >
                                    <option value="All">Everyone</option>
                                    <option value="Guardians">Guardians Only</option>
                                    <option value="Staff">Staff Only</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setType('urgent')}
                                    className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1 text-xs font-bold transition-all ${type === 'urgent' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'border-slate-700 text-gray-400 hover:bg-slate-800'}`}
                                >
                                    <AlertCircle className="w-3 h-3" /> Urgent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('info')}
                                    className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1 text-xs font-bold transition-all ${type === 'info' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-700 text-gray-400 hover:bg-slate-800'}`}
                                >
                                    <Info className="w-3 h-3" /> Info
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="glass" className="flex-1" onClick={onClose} type="button">Cancel</Button>
                        <Button className="flex-1" type="submit">Post Announcement</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
