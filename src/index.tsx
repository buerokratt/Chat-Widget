import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import AuthCallback from "./AuthCallback";
import { Provider } from "react-redux";
import { store } from "./store";

// Automatically detect the subpath from the current location
const getBasePath = () => {
  const { pathname } = window.location;
  // Assume the app is served from the first segment of the path
  const basePath = pathname.split("/")[1];
  return `/${basePath}`;
};

const baseName = getBasePath();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/" Component={App} />
        <Route path="/auth/callback" Component={AuthCallback} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("byk-va"),
);
