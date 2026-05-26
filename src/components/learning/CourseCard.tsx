import { ArrowRight, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CourseCardProps {
    title: string;
    progress: number;
    nextLesson: string;
    color?: string;
    icon?: React.ElementType;
}

export const CourseCard = ({ title, progress, nextLesson, color = 'emerald', icon: Icon = BookOpen }: CourseCardProps) => {
    return (
        <Card className={`border-l-4 border-l-${color}-500 hover:bg-slate-800/50 transition-colors group cursor-pointer`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 bg-${color}-500/10 rounded-xl text-${color}-400`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400">Progress</span>
                    <p className={`text-lg font-bold text-${color}-400`}>{progress}%</p>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-${color}-400 transition-colors">{title}</h3>
            <p className="text-sm text-gray-400 mb-4 line-clamp-1">Next: {nextLesson}</p>

            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full bg-${color}-500 transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <Button variant="glass" className="w-full text-xs flex justify-between items-center group-hover:bg-${color}-500/10 group-hover:text-${color}-400 transition-all">
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </Card>
    );
};
