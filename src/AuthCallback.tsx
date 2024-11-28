import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions
import { setIsAuthenticated } from './slices/authentication-slice'; // Import the action

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  useEffect(() => {
    const handleAuthentication = async () => {
      dispatch(setIsAuthenticated());
      navigate('/', { replace: true });
    };

    handleAuthentication();
  }, [dispatch, navigate]);

  return (
    <span>Processing authentication...</span>
  );
};

export default AuthCallback;
