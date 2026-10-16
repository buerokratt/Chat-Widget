import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";
import { WIDGET_TARGET_ELEMENT_ID } from "./utils/widget-instance-utils";
import { getMobileAppTheme } from "./utils/browser-utils";
import { THEME_ATTRIBUTE } from "./styling/style_settings";
import "./i18n";
import "./index.scss";

const getBasePath = () => {
  const { pathname } = window.location;
  if (!pathname || pathname === "/") return "/";
  const basePath = pathname.split("/")[1];
  return `/${basePath}`;
};

const baseName = getBasePath();

const targetElement = document.getElementById(WIDGET_TARGET_ELEMENT_ID);
targetElement?.classList.add("byk-va-root");

const mobileAppTheme = getMobileAppTheme();
if (mobileAppTheme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, mobileAppTheme);
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  targetElement
);
