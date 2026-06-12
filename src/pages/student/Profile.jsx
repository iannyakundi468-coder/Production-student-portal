import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStudent } from '../../context/StudentContext';
import { Camera, Save, X, Edit2, AlertCircle, User, Bot, CheckCircle2, XCircle, Printer } from 'lucide-react';
import ReportCardPrintView from '../../components/ReportCardPrintView';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  grade: z.string().min(1, 'Grade is required'),
  interests: z.string().optional(),
});

export default function Profile() {
  const { studentData, portfolio, competencies, attendance, updateProfile, toggleAiStudy } = useStudent();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(studentData.avatarUrl);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone || '',
      grade: studentData.grade,
      interests: studentData.interests || '',
    },
  });

  const onSubmit = (data) => {
    // Simulate API call
    setTimeout(() => {
      updateProfile({
        ...data,
        avatarUrl: avatarPreview,
      });
      setIsEditing(false);
    }, 500);
  };

  const handleCancel = () => {
    reset();
    setAvatarPreview(studentData.avatarUrl);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result;
        setAvatarPreview(newAvatarUrl);
        updateProfile({ avatarUrl: newAvatarUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and settings.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 rounded-xl transition-colors font-medium"
          >
            <Printer size={18} />
            Report Card
          </button>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-700">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-gray-400" size={48} />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold">{studentData.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{studentData.id}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Click image to upload new avatar</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              {isEditing ? (
                <>
                  <input
                    {...register('name')}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.name.message}
                    </p>
                  )}
                </>
              ) : (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {studentData.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              {isEditing ? (
                <>
                  <input
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.email.message}
                    </p>
                  )}
                </>
              ) : (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {studentData.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              {isEditing ? (
                <>
                  <input
                    {...register('phone')}
                    placeholder="(555) 000-0000"
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.phone.message}
                    </p>
                  )}
                </>
              ) : (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  {studentData.phone || 'Not provided'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade Level</label>
              {isEditing ? (
                <>
                  <select
                    {...register('grade')}
                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                  </select>
                </>
              ) : (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {studentData.grade}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Academic Interests</label>
              {isEditing ? (
                <textarea
                  {...register('interests')}
                  rows={3}
                  placeholder="e.g. Computer Science, Debate Club, Robotics..."
                  className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 min-h-[80px]">
                  {studentData.interests || 'No interests added yet.'}
                </div>
              )}
            </div>

          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>      {/* AI Assistant Status Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Bot className="text-blue-500" size={24} />
          AI Study Assistant Status
        </h3>
        
        <div className={`flex items-center justify-between p-6 rounded-2xl border ${studentData.aiStudyEnabled ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'}`}>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {studentData.aiStudyEnabled ? 'Activated' : 'Inactive'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {studentData.aiStudyEnabled 
                ? 'Your teacher has enabled AI-powered study assistance for your account. You can now access smart tutoring.' 
                : 'The AI Study Assistant is currently disabled. Your teacher must activate this feature for your account.'}
            </p>
          </div>
          <div className="flex-shrink-0">
            {studentData.aiStudyEnabled ? (
              <CheckCircle2 className="text-green-500" size={32} />
            ) : (
              <XCircle className="text-gray-400" size={32} />
            )}
          </div>
        </div>
      </div>

      <ReportCardPrintView 
        student={studentData} 
        portfolio={portfolio} 
        competencies={competencies} 
        attendance={attendance} 
      />
    </div>
  );
}
