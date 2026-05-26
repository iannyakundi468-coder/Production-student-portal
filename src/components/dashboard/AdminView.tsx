import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import {
    Users,
    AlertCircle,
    DollarSign,
    Activity,
    Construction,
    LayoutDashboard,
    ShieldCheck,
    BadgeCheck,
    Scan,
    Utensils,
    FileText,
    TrendingUp
} from 'lucide-react';
import { AIInsights } from './AIInsights';

export const AdminView = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Revenue', value: 'KES 14.2M', trend: '+12.5%', icon: DollarSign, color: 'emerald', delay: 0 },
        { label: 'Active Students', value: '1,240', trend: '98%', icon: Users, color: 'blue', delay: 0.1 },
        { label: 'Staff Presence', value: '42 / 45', trend: '3 Away', icon: Activity, color: 'amber', delay: 0.2 },
        { label: 'Pending Issues', value: '7', trend: 'High Priority', icon: AlertCircle, color: 'rose', delay: 0.3 }
    ];

    return (
        <div className="space-y-10 animate-in">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <Button variant="ghost" className="px-5 h-11 border border-white/5 bg-white/5" onClick={() => navigate('/finance')}>Financial Reports</Button>
                <Button variant="ghost" className="px-5 h-11 border border-white/5 bg-white/5" onClick={() => navigate('/events')}>School Events</Button>

                <div className="h-11 w-px bg-white/10 mx-2" />

                <Button variant="premium" size="md" onClick={() => navigate('/development')}>
                    <Construction className="w-4 h-4" /> School Development
                </Button>
                <Button variant="secondary" className="px-6" onClick={() => navigate('/infrastructure')}>
                    <LayoutDashboard className="w-4 h-4" /> Infrastructure
                </Button>
                <Button variant="secondary" className="px-6 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30" onClick={() => navigate('/compliance')}>
                    <ShieldCheck className="w-4 h-4" /> Compliance
                </Button>
                <Button variant="secondary" className="px-6 bg-rose-600/20 text-rose-400 border border-rose-500/20 hover:bg-rose-600/30" onClick={() => navigate('/safety')}>
                    <BadgeCheck className="w-4 h-4" /> Safety Hub
                </Button>
            </div>

            {/* Premium Insight Hub */}
            <Card variant="premium" className="p-0 overflow-visible overflow-x-clip" hover={false}>
                <AIInsights />
            </Card>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className={`border-t-4 border-${stat.color}-500`} delay={stat.delay}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className={`text-[10px] font-bold text-${stat.color}-400 bg-${stat.color}-500/10 px-2 py-0.5 rounded-full`}>
                                        {stat.trend}
                                    </span>
                                    {stat.label === 'Total Revenue' && <span className="text-[10px] text-slate-500">vs last term</span>}
                                </div>
                            </div>
                            <div className={`p-3 bg-${stat.color}-500/10 rounded-2xl text-${stat.color}-400`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ecosystem Master Control */}
                <Card variant="premium" className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Ecosystem Master Control</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Active IoT heartbeat across campus infrastructure.</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-400/10 px-4" onClick={() => navigate('/operations')}>Operational Deep-Dive</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Scan, label: 'Smart Gate', color: 'emerald', path: '/gate' },
                            { icon: Utensils, label: 'Cashless Canteen', color: 'amber', path: '/canteen' },
                            { icon: Activity, label: 'Bus Sentinel', color: 'blue', path: '/safety' },
                            { icon: FileText, label: 'Board Reports', color: 'purple', path: '/report' }
                        ].map((btn, i) => (
                            <Button
                                key={i}
                                variant="glass"
                                className="h-28 flex flex-col items-center justify-center gap-3 border-white/5 hover:border-white/20 transition-all rounded-3xl"
                                onClick={() => navigate(btn.path)}
                            >
                                <div className={`p-3 bg-${btn.color}-500/10 rounded-2xl text-${btn.color}-400`}>
                                    <btn.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-slate-200">{btn.label}</span>
                            </Button>
                        ))}
                    </div>
                </Card>

                {/* Institutional Pulse */}
                <Card variant="glass" className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-xl font-bold text-white">Institutional Pulse</h3>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">Hardware Sync: Active</span>
                    </div>
                    <div className="space-y-6">
                        {[
                            { icon: Scan, color: 'emerald', title: 'Gate Entrance Verified', desc: 'Kelvin Omari arrived at 7:15 AM. Parent notified.', time: '10 mins ago' },
                            { icon: Utensils, color: 'amber', title: 'Canteen Flash-Sale', desc: '142 meals processed in last 30 mins.', time: '30 mins ago' },
                            { icon: AlertCircle, color: 'rose', title: 'Fuel Anomaly Detected', desc: 'Sudden drop in Bus 04 fuel level.', time: '1 hour ago' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-5 items-start group relative">
                                <div className={`p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:bg-${item.color}-500/10 group-hover:text-${item.color}-400 transition-all duration-500`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 border-b border-white/5 pb-4 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-white font-bold text-sm group-hover:text-white transition-colors">{item.title}</p>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{item.time}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
