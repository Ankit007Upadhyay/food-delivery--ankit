import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";

// Version 4.0 - Fresh Build - 2025-02-25-12:32
console.log("🚀 Food Delivery App v4.0 - Fresh Build Deployed");
console.log("🕐 Build Time:", new Date().toISOString());

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>
);
