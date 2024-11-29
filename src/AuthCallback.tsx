import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/test', { replace: true });
  }, []);

  return (
    <span>processing authentication...</span>
  );
};

export default AuthCallback;
