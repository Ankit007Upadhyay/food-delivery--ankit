import React, { useState } from 'react';
import './Menu.css';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';

const Menu = () => {
  const [category, setCategory] = useState("All");

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <div className="menu-hero-content">
          <h1>Our Complete Menu</h1>
          <p>Explore our full range of delicious dishes crafted with the finest ingredients</p>
        </div>
      </div>
      
      <div className="menu-content">
        <div className="container">
          <div className="menu-filters">
            <ExploreMenu 
              category={category} 
              setCategory={handleCategoryChange} 
            />
          </div>
          
          <div className="menu-food-display">
            <FoodDisplay category={category} isHomePage={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
