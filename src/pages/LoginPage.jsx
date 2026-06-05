import { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Cpu, GraduationCap } from 'lucide-react';
import SomoBloomLogo from '../components/SomoBloomLogo';
import AnimatedIntro from '../components/AnimatedIntro';

export default function LoginPage() {
  const { login, isLoading: isContextLoading } = useStudent();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    setError('');
    setIsLoggingIn(true);
    
    try {
      // Calls StudentContext login, which automatically switches to Sandbox mode if offline
      await login(formData.email, formData.password);
      navigate('/student');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      {showIntro && <AnimatedIntro onComplete={() => setShowIntro(false)} />}
      <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-slate-800 bg-[#f8fafc] transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow delay-3000" />
      <div className="absolute top-[30%] right-[10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow delay-7000" />

      {/* Floating Geometric Art Blocks for Premium Wow Factor */}
      <div className="absolute top-[15%] left-[20%] w-12 h-12 bg-indigo-200/20 rounded-2xl border border-indigo-200/10 rotate-12 animate-float hidden md:block" />
      <div className="absolute bottom-[20%] right-[25%] w-16 h-16 bg-violet-200/25 rounded-full border border-violet-200/10 -rotate-45 animate-float-delayed hidden md:block" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/70 backdrop-blur-md border border-white/80 rounded-[2rem] shadow-xl mb-5 shadow-indigo-500/5 rotate-3 hover:rotate-0 transition-transform duration-300">
            <SomoBloomLogo size={60} showText={false} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 justify-center">
            Somo<span className="text-indigo-600">Bloom</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium tracking-wide">
            Kenyan CBC Student Portal
          </p>
        </div>

        {/* Glassmorphic Card Container */}
        <div className="glass-card p-8 md:p-10 relative overflow-hidden border border-white/60">
          {/* Shifting Top Decorative Accent Gradient */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back, Learner</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to your learning dashboard</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-4 py-3 rounded-2xl animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider pl-1">
                  <Mail size={12} className="text-indigo-500" /> Email or Phone Number
                </label>
                <div className="relative">
                  <input
                    required
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email or +254..."
                    className="w-full px-5 py-4 bg-white/80 border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider pl-1">
                  <Lock size={12} className="text-indigo-500" /> Password
                </label>
                <div className="relative">
                  <input
                    required
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-white/80 border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>



            <button 
              type="submit"
              disabled={isLoggingIn || isContextLoading} 
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isLoggingIn || isContextLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting to Portal...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Learn</span> 
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            

          </form>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          SomoBloom School Management System • {new Date().getFullYear()}
        </p>
      </div>
    </div>
    </>
  );
}
