import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigate(location.state?.from || '/', { replace: true });
  }, [location, navigate]);

  return (
    <span>processing authentication...</span>
  );
};

export default AuthCallback;
