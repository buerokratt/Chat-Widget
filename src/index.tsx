import React from 'react';
import ReactDOM from 'react-dom';
import { Navigate, Route, Routes, BrowserRouter as Router } from "react-router-dom";
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
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  </Provider>,
  document.getElementById("byk-va")
);
