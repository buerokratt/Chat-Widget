import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import AuthCallback from './AuthCallback';
import './i18n';
import './index.scss';

const getBasePath = () => {
  const { pathname } = window.location;
  const basePath = pathname.split("/")[1];
  return `/${basePath}`;
};

const baseName = getBasePath();

const Root = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/auth/callback') {
      setTimeout(() => {
        window.location.reload();
      }, 100); 
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" Component={App} />
      <Route path="/auth/callback" Component={AuthCallback} />
    </Routes>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={baseName}>
      <Root />
    </BrowserRouter>
  </Provider>,
  document.getElementById("byk-va")
);
