import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Navigate, Route, Routes, HashRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import AuthCallback from './AuthCallback';
import './i18n';
import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route index element={<Navigate to="/byk-widget" />} />
        <Route path="/byk-widget" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  </Provider>,
  document.getElementById("byk-va")
);
