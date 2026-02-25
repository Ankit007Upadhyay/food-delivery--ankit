import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";

// Version 2.0 - HashRouter Fix
console.log("🚀 Food Delivery App v2.0 - HashRouter Enabled");

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </HashRouter>
);
