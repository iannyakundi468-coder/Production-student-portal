import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { ParentProvider } from './context/ParentContext';
import { TeacherProvider } from './context/TeacherContext';
import { AdminProvider } from './context/AdminContext';
import { GamificationProvider } from './context/GamificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/PortalLayout';
import ParentLayout from './components/parent/layout/Layout';
import TeacherLayout from './components/teacher/layout/Layout';
import AdminLayout from './components/admin/layout/Layout';

// Common Pages
import LoginPage from './pages/LoginPage';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAiStudy from './pages/student/AiStudy';
import StudentPortfolio from './pages/student/Portfolio';
import StudentProfile from './pages/student/Profile';

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard';
import ParentPaymentFlow from './pages/parent/PaymentFlow';
import ParentProgressViewer from './pages/parent/ProgressViewer';
import ParentMessagesHub from './pages/parent/MessagesHub';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClasses from './pages/teacher/Classes';
import TeacherPortfolio from './pages/teacher/TeacherPortfolio';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherTimetable from './pages/teacher/Timetable';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminClassSetup from './pages/admin/ClassSetup';
import AdminFinancialOverview from './pages/admin/FinancialOverview';
import AdminSystemSettings from './pages/admin/SystemSettings';
import AdminTimetable from './pages/admin/Timetable';
import AdmissionsPanel from './pages/admin/AdmissionsPanel';
import AnnouncementsPanel from './pages/admin/AnnouncementsPanel';


function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') return <Navigate to="/student" replace />;
  if (user.role === 'guardian') return <Navigate to="/parent" replace />;
  if (user.role === 'staff') return <Navigate to="/teacher" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <GamificationProvider>
          <ParentProvider>
            <TeacherProvider>
              <AdminProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Root & Authentication Routes */}
                    <Route path="/" element={<HomeRedirect />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Student Protected Routes */}
                    <Route
                      path="/student"
                      element={
                        <ProtectedRoute allowedRoles={['student']}>
                          <StudentLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<StudentDashboard />} />
                      <Route path="ai-study" element={<StudentAiStudy />} />
                      <Route path="portfolio" element={<StudentPortfolio />} />
                      <Route path="profile" element={<StudentProfile />} />
                    </Route>

                    {/* Parent Protected Routes */}
                    <Route
                      path="/parent"
                      element={
                        <ProtectedRoute allowedRoles={['guardian']}>
                          <ParentLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<ParentDashboard />} />
                      <Route path="pay" element={<ParentPaymentFlow />} />
                      <Route path="progress" element={<ParentProgressViewer />} />
                      <Route path="messages" element={<ParentMessagesHub />} />
                    </Route>

                    {/* Teacher Protected Routes */}
                    <Route
                      path="/teacher"
                      element={
                        <ProtectedRoute allowedRoles={['staff']}>
                          <TeacherLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<TeacherDashboard />} />
                      <Route path="classes" element={<TeacherClasses />} />
                      <Route path="portfolio" element={<TeacherPortfolio />} />
                      <Route path="profile" element={<TeacherProfile />} />
                      <Route path="timetable" element={<TeacherTimetable />} />
                      
                      {/* Delegated Admin Panels */}
                      <Route path="admissions" element={<AdmissionsPanel />} />
                      <Route path="finance" element={<AdminFinancialOverview />} />
                      <Route path="timetable/manage" element={<AdminTimetable />} />
                      <Route path="announcements" element={<AnnouncementsPanel />} />
                    </Route>

                    {/* Admin Protected Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUserManagement />} />
                      <Route path="classes" element={<AdminClassSetup />} />
                      <Route path="admissions" element={<AdmissionsPanel />} />
                      <Route path="finance" element={<AdminFinancialOverview />} />
                      <Route path="settings" element={<AdminSystemSettings />} />
                      <Route path="timetable" element={<AdminTimetable />} />
                      <Route path="announcements" element={<AnnouncementsPanel />} />
                    </Route>

                    {/* Fallback Redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </AdminProvider>
            </TeacherProvider>
          </ParentProvider>
        </GamificationProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;
