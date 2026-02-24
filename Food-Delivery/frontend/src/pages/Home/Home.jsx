import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = () => {
  const [category, setCategory] = useState("All");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading for smooth animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <div className={`modern-home ${isLoaded ? 'loaded' : ''}`}>
      <section className="hero-section">
        <Header />
      </section>
      
      <section className="explore-section">
        <div className="container">
          <ExploreMenu 
            category={category} 
            setCategory={handleCategoryChange} 
          />
        </div>
      </section>
      
      <section className="food-display-section">
        <div className="container">
          <FoodDisplay category={category} isHomePage={true} />
        </div>
      </section>
      
      <section className="app-download-section">
        <div className="container">
          <AppDownload />
        </div>
      </section>
    </div>
  );
};

export default Home;
