import React from "react";
import "./Header.css";
import { assets } from "../../assets/frontend_assets/assets";

const Header = () => {
  return (
    <div className="modern-header">
      <div className="header-background">
        <img src={assets.header_img} alt="Food delivery" className="header-image" />
      </div>
      <div className="header-contents">
        <div className="header-content-wrapper">
          <h1>Order your favourite food here</h1>
          <p>
            Choose from a diverse menu featuring a delectable array of dishes
            crafted with the finest ingredients and culinary expertise. Our
            mission is to satisfy your cravings and elevate your dining
            experience, one delicious meal at a time.
          </p>
          <button className="modern-header-btn">View Menu</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
