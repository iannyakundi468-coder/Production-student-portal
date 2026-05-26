import React from 'react';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-slate-900 text-white overflow-hidden">
            {/* Left Panel - Branding & Art */}
            <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 border-r border-white/5">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg backdrop-blur-sm">
                        <GraduationCap className="w-8 h-8 text-emerald-400" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">St Joseph's Academy</span>
                </div>

                <div className="space-y-6 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight">
                        Managing Schools <br />
                        <span className="text-emerald-400">Made Simple.</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Join the ecosystem built for Kenyan education. Manage fees, track performance, and connect with parents instantly.
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                    <div className="h-1 w-12 bg-slate-700/50 rounded-full"></div>
                    <div className="h-1 w-12 bg-slate-700/50 rounded-full"></div>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12 relative">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[100px]"></div>

                <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">{title}</h2>
                        <p className="text-gray-400">{subtitle}</p>
                    </div>

                    {children}

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            By using St Joseph's Academy, you agree to our <a href="#" className="text-emerald-400 hover:underline">Terms</a> and <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
