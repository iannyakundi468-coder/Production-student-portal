import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Smartphone, CheckCircle, Loader2, Building2, Banknote, ArrowRight } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    amount: number;
    onSuccess: () => void;
}

type Step = 'select-method' | 'input-mpesa' | 'input-bank' | 'input-cash' | 'processing' | 'success';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, title, amount, onSuccess }) => {
    const [step, setStep] = useState<Step>('select-method');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep('select-method');
            setPhone('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const simulateProcessing = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        }, 2000);
    };

    const handleMpesaPay = (e: React.FormEvent) => {
        e.preventDefault();
        simulateProcessing();
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <Card className="w-full max-w-md relative z-10 animate-fade-in border-emerald-500/30">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Process Payment</h2>
                    <p className="text-gray-400 text-sm mt-1">{title}</p>
                    <p className="text-2xl font-bold text-white mt-2">KES {amount.toLocaleString()}</p>
                </div>

                {step === 'select-method' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 text-center mb-4">Choose a payment method:</p>

                        <button
                            onClick={() => setStep('input-mpesa')}
                            className="w-full p-4 rounded-xl bg-slate-800/50 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">M-PESA Express</p>
                                    <p className="text-xs text-gray-400">Automatic STK Push</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400" />
                        </button>

                        <button
                            onClick={() => setStep('input-bank')}
                            className="w-full p-4 rounded-xl bg-slate-800/50 hover:bg-blue-500/20 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">Bank Transfer</p>
                                    <p className="text-xs text-gray-400">KCB / Equity / Co-op</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
                        </button>

                        <button
                            onClick={() => setStep('input-cash')}
                            className="w-full p-4 rounded-xl bg-slate-800/50 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                                    <Banknote className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">Cash / Cheque</p>
                                    <p className="text-xs text-gray-400">Record officer collection</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-amber-400" />
                        </button>
                    </div>
                )}

                {step === 'input-mpesa' && (
                    <form onSubmit={handleMpesaPay} className="space-y-6">
                        <Input
                            label="M-PESA Phone Number"
                            placeholder="e.g. 0712 345 678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            required
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <Button type="button" variant="glass" onClick={() => setStep('select-method')}>Back</Button>
                            <Button type="submit" className="flex-1 bg-[#4CAF50] hover:bg-[#43a047] text-white">
                                Send STK Push
                            </Button>
                        </div>
                        <p className="text-xs text-center text-gray-500">
                            Check your phone for the PIN prompt.
                        </p>
                    </form>
                )}

                {step === 'input-bank' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-800 rounded-lg text-sm space-y-2">
                            <p className="text-gray-400">Pay Bill / Account Number:</p>
                            <p className="font-mono text-xl text-white">522522</p>
                            <p className="text-gray-400 mt-2">Account Name:</p>
                            <p className="font-bold text-white">The St Joseph's Kisii South Academy</p>
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="glass" onClick={() => setStep('select-method')}>Back</Button>
                            <Button className="flex-1" onClick={simulateProcessing}>
                                I have transferred
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'input-cash' && (
                    <div className="space-y-6 text-center">
                        <p className="text-gray-400">Please hand over the cash or cheque to the finance officer.</p>
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <p className="text-amber-400 font-bold mb-1">Receipt Generation</p>
                            <p className="text-xs text-gray-400">A digital receipt will be sent to the parent instantly.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="glass" onClick={() => setStep('select-method')}>Back</Button>
                            <Button className="flex-1" onClick={simulateProcessing}>
                                Confirm Receipt
                            </Button>
                        </div>
                    </div>
                )}


                {step === 'processing' && (
                    <div className="text-center py-8 space-y-4">
                        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">Processing...</h3>
                            <p className="text-gray-400 text-sm">Verifying transaction</p>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center py-8 space-y-4">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Payment Recorded!</h3>
                            <p className="text-gray-400 text-sm">Receipt sent to parent.</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
