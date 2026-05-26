import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'premium' | 'danger';
    delay?: number;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    delay = 0,
    hover = true
}) => {
    const baseStyles = 'rounded-3xl p-6 transition-all duration-300 border';

    const variants = {
        default: 'bg-slate-900/50 border-white/5 backdrop-blur-md',
        glass: 'bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl',
        premium: 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border-white/10 border-t-indigo-500/50 shadow-2xl',
        danger: 'bg-rose-950/10 border-rose-500/20 backdrop-blur-md shadow-lg shadow-rose-900/10'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={hover ? {
                y: -4,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            } : {}}
            className={`${baseStyles} ${variants[variant]} ${className} relative overflow-hidden group`}
        >
            {/* Decorative Glow for Premium */}
            {variant === 'premium' && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-500" />
            )}

            {children}
        </motion.div>
    );
};
