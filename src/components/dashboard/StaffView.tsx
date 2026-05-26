import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    CheckCircle,
    ChevronDown,
    Search,
    Bot,
    ClipboardCheck,
    FolderOpen,
    Calendar,
    Scan,
    ArrowRight
} from 'lucide-react';

// Mock Data for Classes
const TEACHER_CLASSES = [
    { id: '4G', name: 'Grade 4 Green (Home)', students: 32, attendance: '94%' },
    { id: '5B', name: 'Grade 5 Blue (Math)', students: 28, attendance: '89%' },
    { id: '6R', name: 'Grade 6 Red (Science)', students: 30, attendance: '91%' },
];

// Mock Data for Students
const MOCK_STUDENTS = [
    { id: 1, name: 'Ian Doe', grade: '4G', status: 'Present', performance: 'A' },
    { id: 2, name: 'Sarah Smith', grade: '4G', status: 'Absent', performance: 'B+' },
    { id: 3, name: 'James Johnson', grade: '4G', status: 'Present', performance: 'A-' },
    { id: 4, name: 'Emily Davis', grade: '4G', status: 'Late', performance: 'B' },
    { id: 5, name: 'Michael Brown', grade: '4G', status: 'Present', performance: 'C+' },
];

export const StaffView = () => {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState(TEACHER_CLASSES[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const { aiEnabled, setAiEnabled } = useSettings();

    return (
        <div className="space-y-10 animate-in">
            {/* Header / Class Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Academic Pulse</h2>
                    <div className="relative inline-block text-left group">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5 transition-all"
                        >
                            {selectedClass.name}
                            <ChevronDown className="w-4 h-4" />
                        </motion.button>
                        <div className="absolute left-0 mt-3 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-20 hidden group-hover:block animate-in">
                            {TEACHER_CLASSES.map((cls) => (
                                <button
                                    key={cls.id}
                                    onClick={() => setSelectedClass(cls)}
                                    className="w-full text-left px-5 py-4 hover:bg-white/5 first:rounded-t-2xl last:rounded-b-2xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                                >
                                    {cls.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Button onClick={() => navigate('/gate')} variant="glass" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30">
                        <Scan className="w-4 h-4" /> Smart Gate
                    </Button>
                    <Button onClick={() => navigate('/learning/assessment')} variant="glass" size="sm">
                        <ClipboardCheck className="w-4 h-4" /> Assessment
                    </Button>
                    <Button onClick={() => navigate('/learning/portfolio')} variant="glass" size="sm">
                        <FolderOpen className="w-4 h-4" /> Portfolios
                    </Button>
                    <Button onClick={() => navigate('/timetable')} variant="glass" size="sm" className="text-purple-400 bg-purple-500/10 border-purple-500/10 hover:border-purple-500/30">
                        <Calendar className="w-4 h-4" /> Master Timetable
                    </Button>
                    <Button onClick={() => navigate('/enrollment')} variant="premium" size="sm">+ New Student</Button>
                </div>
            </div>

            {/* AI Control Panel */}
            <Card variant="premium" className="p-0 overflow-hidden" hover={false}>
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/20">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                AI Teaching Copilot
                                {aiEnabled && (
                                    <span className="flex items-center gap-2 text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-tighter">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Streaming Insights
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium mt-1">Automated grade commentary & behavior profiling is active.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/50 px-6 py-3 rounded-2xl border border-white/5">
                        <span className={`text-xs font-bold uppercase tracking-widest ${aiEnabled ? 'text-indigo-400' : 'text-slate-500'}`}>
                            {aiEnabled ? 'Active' : 'Paused'}
                        </span>
                        <button
                            onClick={() => setAiEnabled(!aiEnabled)}
                            className={`w-14 h-7 rounded-full transition-all duration-300 relative ${aiEnabled ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-700'}`}
                        >
                            <motion.div
                                animate={{ x: aiEnabled ? 28 : 4 }}
                                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                            />
                        </button>
                    </div>
                </div>
            </Card>

            {/* PowerSchool Inspired: Quick Action Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-t-4 border-t-indigo-500 bg-slate-900/40">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <ClipboardCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white tracking-tight">Quick Grade Entry</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Input placeholder="Search student..." className="flex-1 bg-slate-800/50 border-white/5 h-10 text-xs" />
                            <Button size="sm" variant="premium" className="h-10 px-6">Fetch</Button>
                        </div>
                        <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center justify-between">
                            <span className="text-sm font-bold text-white">Latest: Science Quiz</span>
                            <div className="flex items-center gap-2">
                                <Input className="w-16 h-8 bg-slate-800 text-center font-bold text-emerald-400 border-white/10" defaultValue="85" />
                                <span className="text-[10px] font-black text-slate-500 uppercase">/100</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-t-4 border-t-emerald-500 bg-slate-900/40">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <Scan className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white tracking-tight">Attendance Snap</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                            <p className="text-[10px] font-black text-emerald-500 uppercase">Present</p>
                            <p className="text-xl font-black text-white">28</p>
                        </div>
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                            <p className="text-[10px] font-black text-rose-500 uppercase">Absent</p>
                            <p className="text-xl font-black text-white">2</p>
                        </div>
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                            <p className="text-[10px] font-black text-amber-500 uppercase">Late</p>
                            <p className="text-xl font-black text-white">2</p>
                        </div>
                    </div>
                    <Button variant="glass" className="w-full mt-4 h-10 text-xs font-bold uppercase tracking-widest border-white/5">
                        Submit Period Roster
                    </Button>
                </Card>
            </div>

            {/* Stats Row & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 h-fit">
                    <Card variant="glass" delay={0.1}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Selected Class Size</p>
                                <p className="text-4xl font-bold text-white mt-1">{selectedClass.students}</p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">Verified Roster</p>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/10">
                                <Users className="w-7 h-7" />
                            </div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-1 gap-8 h-full">
                        <Card variant="glass" delay={0.2} className="h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Today's Attendance</p>
                                    <p className="text-3xl font-bold text-emerald-400 mt-1">{selectedClass.attendance}</p>
                                </div>
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/10">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                            </div>
                        </Card>
                        <Card variant="glass" delay={0.3} className="h-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Avg. Performance</p>
                                    <p className="text-3xl font-bold text-amber-400 mt-1">B+</p>
                                </div>
                                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/10">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <Card variant="default" className="border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white">Staff Briefing</h2>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={() => navigate('/messages')}>
                            Go to Inbox <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Mrs. Alice', msg: 'Reminder: Staff meeting at 2 PM.', color: 'indigo', emoji: '👩‍🏫', isNew: true },
                            { name: 'Principal James', msg: 'Monthly performance reviews start Monday.', color: 'blue', emoji: '👨‍💼', isNew: false }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-2xl border border-white/5 group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border border-white/5 group-hover:bg-slate-700 transition-colors">
                                    {item.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-sm text-white">{item.name}</h4>
                                        {item.isNew && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">New</span>}
                                    </div>
                                    <p className="text-xs text-slate-400 truncate mt-1 font-medium">{item.msg}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Student List */}
            <Card variant="default" className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Class Roster</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Search and manage student profiles for {selectedClass.name}.</p>
                    </div>
                    <div className="w-full md:w-80">
                        <Input
                            placeholder="Student name or ID..."
                            icon={<Search className="w-4 h-4" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-800/50 border-white/5"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-4">
                                <th className="pb-4 pl-6">Student Identity</th>
                                <th className="pb-4 text-center">Daily Status</th>
                                <th className="pb-4 text-center">Term Rank</th>
                                <th className="pb-4 text-right pr-6">Vault Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_STUDENTS.map((student) => (
                                <tr key={student.id} className="group transition-all">
                                    <td className="py-4 pl-6 bg-slate-900/40 border-y border-l border-white/5 rounded-l-2xl group-hover:bg-white/5 group-hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs border border-white/5">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="font-bold text-white text-sm">{student.name}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center bg-slate-900/40 border-y border-white/5 group-hover:bg-white/5 group-hover:border-white/10 transition-colors">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter
                                            ${student.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                student.status === 'Absent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center bg-slate-900/40 border-y border-white/5 group-hover:bg-white/5 group-hover:border-white/10 transition-colors font-mono text-slate-400 font-bold">
                                        {student.performance}
                                    </td>
                                    <td className="py-4 text-right pr-6 bg-slate-900/40 border-y border-r border-white/5 rounded-r-2xl group-hover:bg-white/5 group-hover:border-white/10 transition-colors">
                                        <Button variant="ghost" className="h-9 text-[10px] px-4 bg-white/5 hover:bg-white/10 border border-white/5">
                                            Full Portfolio
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
