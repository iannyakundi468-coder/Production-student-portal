import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    className = '',
    ...props
}) => {
    // Omit drag events that conflict with framer-motion types
    const {
        onDrag,
        onDragStart,
        onDragEnd,
        onDragOver,
        onDragEnter,
        onDragLeave,
        onDragExit,
        ...inputProps
    } = props;

    return (
        <div className="space-y-2 w-full group">
            {label && (
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        {icon}
                    </div>
                )}
                <motion.input
                    whileFocus={{ scale: 1.005 }}
                    className={`
            w-full bg-slate-900/50 border border-white/10 rounded-2xl
            ${icon ? 'pl-11' : 'pl-5'} pr-5 py-3.5
            text-white font-medium placeholder:text-slate-600
            focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5
            transition-all duration-300
            ${error ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/5' : ''}
            ${className}
          `}
                    {...(inputProps as any)}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-bold text-rose-500 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};
