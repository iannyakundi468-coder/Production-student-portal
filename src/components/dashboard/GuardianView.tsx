import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useNavigate } from 'react-router-dom';
import { User, Wallet, Calendar, TrendingUp, Activity } from 'lucide-react';

export const GuardianView = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="glass" className="h-24 flex flex-col gap-2" onClick={() => navigate('/finance')}>
                    <Wallet className="w-6 h-6 text-emerald-400" />
                    <span>Pay Fees</span>
                </Button>
                <Button variant="glass" className="h-24 flex flex-col gap-2" onClick={() => navigate('/events')}>
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <span>Events</span>
                </Button>
                <Button variant="glass" className="h-24 flex flex-col gap-2" onClick={() => navigate('/learning')}>
                    <div className="p-1 bg-purple-500/20 rounded-md">
                        <span className="text-xl">🎓</span>
                    </div>
                    <span>Home Learning</span>
                </Button>
                <Button variant="glass" className="h-24 flex flex-col gap-2">
                    <User className="w-6 h-6 text-amber-400" />
                    <span>My Child</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Student Profile</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👦</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white">Ian Manyara</p>
                            <p className="text-gray-400">Grade 6 - Green House</p>
                        </div>
                    </div>
                </Card>

                {/* PowerSchool Inspired: Student Progress Radar */}
                <Card className="bg-slate-900/40 border-t-4 border-t-blue-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Activity className="w-5 h-5 text-blue-400" /> Progress Radar
                        </h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Sync</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { subject: 'Mathematics', score: 88, color: 'emerald' },
                            { subject: 'Science', score: 92, color: 'blue' },
                            { subject: 'English', score: 75, color: 'amber' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-300">
                                    <span>{stat.subject}</span>
                                    <span className={`text-${stat.color}-400`}>{stat.score}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full w-[${stat.score}%] bg-${stat.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-6 h-9 text-[10px] border border-white/5 hover:bg-white/5 font-bold uppercase tracking-widest text-blue-400">
                        View Historical Trends
                    </Button>
                </Card>

                <Card className="hover:bg-slate-800 transition-colors cursor-pointer group" onClick={() => navigate('/report')}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-gray-400 text-sm">Performance</p>
                            <p className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">B+ (Avg)</p>
                        </div>
                        <div className="p-2 bg-amber-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-amber-400" /></div>
                    </div>
                    <div className="text-xs text-gray-500">Top 10% of CBC Grade 6</div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold">School Updates</h2>
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">New</span>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <h3 className="font-bold text-sm text-white">Parent-Teacher Meeting</h3>
                            <p className="text-xs text-gray-400 mt-1">Join us to discuss the new CBC assessments...</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] text-gray-500">2 hrs ago • Admin Joseph</span>
                                <button onClick={() => navigate('/messages')} className="text-xs text-emerald-400 hover:underline">Read More</button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4">Fee Status</h2>
                    <p className="text-sm text-gray-400 mb-2">Term 1 Balance</p>
                    <p className="text-3xl font-bold text-rose-400">KES 12,500</p>
                    <Button className="w-full mt-4" onClick={() => navigate('/finance')}>Clear Balance</Button>
                </Card>
            </div>
        </div>
    );
};

// St Joseph's Academy V1.0
