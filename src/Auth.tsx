import { useEffect } from 'react';
import queryString from 'query-string';

const AuthCallback = () => {

  useEffect(() => {
    const params = queryString.parse(window.location.search);
    const token = params.token;
  }, []);

  return (
    <div>
      <h2>Handling Auth Callback...</h2>
    </div>
  );
};

export default AuthCallback;
