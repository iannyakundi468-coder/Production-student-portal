import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface FeeCardProps {
    title: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
    onPay: () => void;
}

export const FeeCard: React.FC<FeeCardProps> = ({ title, amount, dueDate, status, onPay }) => {
    const statusColors = {
        paid: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        overdue: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    };

    const statusIcons = {
        paid: <CheckCircle className="w-4 h-4" />,
        pending: <Clock className="w-4 h-4" />,
        overdue: <AlertCircle className="w-4 h-4" />,
    };

    return (
        <Card className="flex flex-col justify-between h-full hover:scale-[1.02] transition-transform">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-white">{title}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                        {statusIcons[status]}
                        <span className="capitalize">{status}</span>
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <p className="text-3xl font-bold text-white">
                        KES {amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">Due: {dueDate}</p>
                </div>
            </div>

            {status !== 'paid' && (
                <Button
                    onClick={onPay}
                    variant={status === 'overdue' ? 'primary' : 'glass'}
                    className="w-full"
                >
                    Pay Now
                </Button>
            )}

            {status === 'paid' && (
                <div className="text-center py-2 text-emerald-400 font-medium text-sm border border-emerald-500/20 rounded-lg bg-emerald-500/5">
                    Payment Complete
                </div>
            )}
        </Card>
    );
};
