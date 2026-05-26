import { TrendingUp, Sparkles, PieChart, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const AIInsights = () => {
    return (
        <div className="glass-card p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none shadow-2xl relative overflow-hidden group">
            {/* Ambient background rays */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] opacity-50" />

            <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                            Investor Intelligence Hub
                        </h3>
                        <p className="text-slate-400 text-sm font-medium">Predictive modeling for school growth & sustainability.</p>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                        Live Analysis
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Financial Projection Insight */}
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group/item">
                            <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Revenue Forecast</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Our <span className="text-white font-bold italic">SmartFee™</span> algorithm predicts a <span className="text-emerald-400 font-bold">14.2% increase</span> in revenue next term based on current enrollment trends and retention metrics.
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500">ACCURACY SCORE: 94%</span>
                                <Button variant="ghost" className="h-8 px-3 text-[10px] font-bold text-blue-400 hover:bg-blue-500/10 rounded-lg">View Projection Map</Button>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck className="w-5 h-5 text-amber-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Resource Optimization</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Classroom utilization is currently at <span className="text-white font-bold">68%</span>. Automating staff allocations could save <span className="text-amber-400 font-bold">KES 45,000</span> in monthly overhead costs.
                            </p>
                        </div>
                    </div>

                    {/* Chart/Visual Mock */}
                    <div className="relative">
                        <div className="glass-card bg-emerald-500/5 border-emerald-500/10 p-6 h-full flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 relative mb-4">
                                <PieChart className="w-full h-full text-emerald-500/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-emerald-400">82%</span>
                                </div>
                            </div>
                            <h4 className="text-white font-bold text-sm">SaaS Efficiency Score</h4>
                            <p className="text-xs text-slate-500 mt-2 max-w-[180px]">Automated operations have saved 120+ administrative hours this term.</p>

                            <div className="mt-6 w-full space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                    <span>TIME SAVED</span>
                                    <span>9.2/10</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[92%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-500 italic">
                        "Empowering educational leaders with data-driven decision making."
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-10 px-6 border-white/10 text-white hover:bg-white/5">
                            Export Investor Report
                        </Button>
                        <Button className="btn-primary h-10 px-6 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 border-none">
                            Run Simulations
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
