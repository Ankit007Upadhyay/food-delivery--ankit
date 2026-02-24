import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import { useNavigate } from "react-router-dom";

const FoodDisplay = ({ category, isHomePage = false }) => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Filter food items based on category and search
  const filteredFood = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // For home page, show only first 8 items as featured
  const displayFood = isHomePage ? filteredFood.slice(0, 8) : filteredFood;

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>{isHomePage ? "Featured Dishes" : "All Dishes"}</h2>
        {!isHomePage && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        )}
      </div>
      
      {displayFood.length === 0 ? (
        <div className="no-results">
          <p>No dishes found matching your criteria.</p>
        </div>
      ) : (
        <div className="food-display-list">
          {displayFood.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      )}
      
      {isHomePage && filteredFood.length > 8 && (
        <div className="view-all-container">
          <button className="view-all-btn" onClick={() => navigate('/menu')}>
            View All Dishes ({filteredFood.length - 8} more)
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
