import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    navigate('/', { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100); 
  }, [navigate]);

  return (
    <span>processing authentication...</span>
  );
};

export default AuthCallback;
