import React, { useState, useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import { StoreContext } from "./context/StoreContext";
import "./App.css";

const App = () => {
  const url = "http://localhost:4000";
  const { token } = useContext(StoreContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    console.log("Toggle sidebar clicked, current state:", isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="app">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {token ? <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} /> : null}
      
      {/* Mobile Sidebar */}
      {token && (
        <>
          <div 
            className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
            onClick={toggleSidebar}
          ></div>
          <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <Sidebar toggleSidebar={toggleSidebar} />
          </div>
        </>
      )}
      
      <div className="app-main">
        {/* Desktop Sidebar */}
        {token && <div className="desktop-sidebar"><Sidebar /></div>}
        
        <div className="content-area">
          <Routes>
            <Route path="/" element={
              token ? <Navigate to="/add" replace /> : <Login url={url}/>
            } />
            <Route path="/add" element={
              token ? <Add url={url}/> : <Navigate to="/" replace />
            } />
            <Route path="/list" element={
              token ? <List url={url}/> : <Navigate to="/" replace />
            } />
            <Route path="/orders" element={
              token ? <Orders /> : <Navigate to="/" replace />
            } />
            <Route path="/profile" element={
              token ? <Profile /> : <Navigate to="/" replace />
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
