import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RoleGuard({ role, children }) {
  const { profile } = useAuth();

  if (profile && profile.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
