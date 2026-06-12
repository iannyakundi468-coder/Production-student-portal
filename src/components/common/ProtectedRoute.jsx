import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // If role is not authorized, redirect to their home dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/student" replace />;
    if (user.role === 'guardian') return <Navigate to="/parent" replace />;
    if (user.role === 'staff') return <Navigate to="/teacher" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
