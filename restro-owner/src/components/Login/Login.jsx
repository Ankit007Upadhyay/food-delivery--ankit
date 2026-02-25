import React, { useContext, useEffect } from "react";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import {useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate=useNavigate();
  const {admin,setAdmin,token, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    restaurantName: "",
    restaurantAddress: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const response = await axios.post(url + "/api/user/login", data);
    if (response.data.success) {
      if (response.data.role === "restro_owner") {
        setToken(response.data.token);
        setAdmin(true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", "true");
        toast.success("Login Successfully");
        navigate("/add")
      }else{
        toast.error("You are not a restaurant owner");
      }
    } else {
      toast.error(response.data.message);
    }
  };

  const onRegister = async (event) => {
    event.preventDefault();
    const registerData = {
      ...data,
      role: "restro_owner"
    };
    const response = await axios.post(url + "/api/user/register", registerData);
    if (response.data.success) {
      if (response.data.isApproved) {
        toast.success("Registration successful! Please login.");
        setCurrentState("Login");
      } else {
        toast.success("Restaurant owner registration submitted. Waiting for admin approval.");
        setCurrentState("Login");
      }
      setData({
        name: "",
        email: "",
        password: "",
        restaurantName: "",
        restaurantAddress: ""
      });
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(()=>{
    if(admin && token){
       navigate("/add");
    }
  },[])

  return (
    <div className="login-popup">
      <form onSubmit={currentState === "Login" ? onLogin : onRegister} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
              />
              <input
                name="restaurantName"
                onChange={onChangeHandler}
                value={data.restaurantName}
                type="text"
                placeholder="Restaurant name"
                required
              />
              <input
                name="restaurantAddress"
                onChange={onChangeHandler}
                value={data.restaurantAddress}
                type="text"
                placeholder="Restaurant address"
                required
              />
            </>
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <button type="submit">{currentState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          {currentState === "Login" 
            ? "Create a new account? " 
            : "Already have an account? "
          }
          <span onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}>
            Click here
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
