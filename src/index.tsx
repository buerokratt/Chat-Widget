import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";
import "./i18n";
import "./index.scss";

const getBasePath = () => {
  const { pathname } = window.location;
  console.log(pathname);
   if (!pathname || pathname === "/") return "/";
  const basePath = pathname.split("/")[1];
  return `/${basePath}`;
};

const baseName = getBasePath();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('byk-va'),
);
