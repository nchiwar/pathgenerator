import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, session } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !session) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, session, navigate]);

  if (!isAuthenticated && !session) {
    return null;
  }

  return <>{children}</>;
};
