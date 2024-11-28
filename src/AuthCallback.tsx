import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectTo = location.state?.from || '/';  
    navigate(redirectTo, { replace: true });  
  }, [location, navigate]);

  return (
    <span>Processing authentication...</span>
  );
};

export default AuthCallback;
