import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'style'> {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost' | 'premium';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// Combine ButtonHTMLAttributes with framer-motion props
type CombinedProps = ButtonProps & HTMLMotionProps<'button'>;

export const Button: React.FC<CombinedProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  isLoading,
  ...props
}) => {
  const baseStyles = 'font-semibold transition-all duration-300 flex items-center justify-center gap-2 rounded-xl relative overflow-hidden group';

  const sizeStyles = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-8 text-base'
  };

  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:bg-emerald-700';
      break;
    case 'secondary':
      variantStyles = 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:bg-blue-700';
      break;
    case 'premium':
      variantStyles = 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50';
      break;
    case 'outline':
      variantStyles = 'border-2 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-white/5 active:bg-white/10';
      break;
    case 'ghost':
      variantStyles = 'text-slate-400 hover:text-white hover:bg-white/5';
      break;
    case 'glass':
    default:
      variantStyles = 'backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30';
      break;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      {...props}
    >
      {/* Premium Shimmer for premium variant */}
      {variant === 'premium' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
      )}

      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};
