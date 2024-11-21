import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import AuthCallback from './AuthCallback';
import './i18n';
import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/byk-widget" />} />
        <Route path="/byk-widget" Component={App} />
        <Route path="/auth/callback" Component={AuthCallback} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('byk-va'),
);
