import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from './layouts/PortalLayout';
import LoginPage from './pages/LoginPage';
import { StudentProvider } from './context/StudentContext';
import { GamificationProvider } from './context/GamificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Student Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import AiStudy from './pages/AiStudy';

function App() {
  return (
    <StudentProvider>
      <GamificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Login Page */}
            <Route path="/" element={<LoginPage />} />

            {/* Protected Student Portal Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="ai-study" element={<AiStudy />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch-all redirect to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GamificationProvider>
    </StudentProvider>
  );
}

export default App;
