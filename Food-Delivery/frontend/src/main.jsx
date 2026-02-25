import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";

// Version 5.0 - Vercel Auto Routing
console.log("🚀 Food Delivery App v5.0 - Vercel Auto Routing");
console.log("🕐 Deploy Time:", new Date().toISOString());

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>
);
