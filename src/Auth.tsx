import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WidgetService from "./services/widget-service";
import useChatSelector from './hooks/use-chat-selector';
import useAuthenticationSelector from './hooks/use-authentication-selector';

const AuthCallback = () => {
  const { chatId } = useChatSelector();
  const { userInfo } = useAuthenticationSelector();
  const navigate = useNavigate();

  useEffect(() => {
    WidgetService.authenticateUser(
      chatId ?? "",
      userInfo.personalCode,
      userInfo.firstName,
      userInfo.lastName,
    ).then(() => {
      navigate('/', { replace: true });
    });
  }, []);

  return (
    <div>
      <h2>please wait...</h2>
    </div>
  );
};

export default AuthCallback;
