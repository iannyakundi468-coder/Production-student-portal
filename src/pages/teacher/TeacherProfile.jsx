import { useTeacher } from '../../context/TeacherContext';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Bell, 
  Eye, 
  LogOut, 
  Camera, 
  Check,
  ChevronRight,
  Sparkles,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';
import { useState } from 'react';

export default function TeacherProfile() {
  const { teacherData, updateProfile } = useTeacher();
  const { logout } = useAuth();
  const [isAiActive, setIsAiActive] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const settingsOptions = [
    { label: 'Account Settings', icon: User, description: 'Manage your profile and personal details' },
    { label: 'Notifications', icon: Bell, description: 'Configure how you receive alerts' },
    { label: 'Privacy & Security', icon: Shield, description: 'Update passwords and permissions' },
    { label: 'Display Preferences', icon: Eye, description: 'Customize your dashboard view' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-800">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile & Settings</h1>
        <p className="text-slate-500 mt-1">Manage your teacher account and portal preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-xl flex items-center justify-center overflow-hidden">
                {teacherData?.avatarUrl ? (
                  <img 
                    src={teacherData.avatarUrl} 
                    alt={teacherData.name} 
                    className="w-full h-full rounded-full bg-white object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <User size={48} className="text-slate-350" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>
            
            <h2 className="mt-6 text-xl font-bold text-slate-900">{teacherData?.name || 'Teacher'}</h2>
            <p className="text-sm text-indigo-600 font-medium">Certified Teacher</p>
            
            <div className="mt-8 w-full space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-white border border-slate-100 shadow-sm p-3 rounded-xl">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{teacherData?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-white border border-slate-100 shadow-sm p-3 rounded-xl">
                <Building size={16} className="text-slate-400" />
                <span>{teacherData?.school || "St. Joseph's Kisii South Academy"}</span>
              </div>
            </div>

            <button 
              onClick={logout}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 text-red-650 font-semibold hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Settings List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">General Settings</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {settingsOptions.map((option, index) => (
                <button 
                  key={index}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left group border border-transparent"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                      <option.icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{option.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 text-slate-900 flex items-center justify-between border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Pro Account Active</h3>
              <p className="text-slate-500 text-sm mt-1">Your teacher subscription is active until Sept 2027.</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <Check size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:bg-purple-400/40 transition-colors" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={20} className="text-purple-300" />
                  <h3 className="text-xl font-bold">Student AI Assistant</h3>
                </div>
                <p className="text-indigo-200/80 text-sm">
                  Enable AI personalized learning guides for your students to help them with their coursework and portfolios.
                </p>
              </div>
              
              <button 
                onClick={() => setIsAiActive(!isAiActive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                  isAiActive 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isAiActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                {isAiActive ? 'Activated' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
