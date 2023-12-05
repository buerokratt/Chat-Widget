import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import AuthCallback from './Auth';
import './i18n';
import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" Component={AuthCallback} />
        <Route index Component={App} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('byk-va'),
);
