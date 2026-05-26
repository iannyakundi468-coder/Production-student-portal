import { Navigate } from 'react-router-dom';
import { useStudent } from '../../context/StudentContext';

export default function ProtectedRoute({ children }) {
  const { studentData } = useStudent();
  
  // If student is not logged in, redirect to login
  if (!studentData) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
