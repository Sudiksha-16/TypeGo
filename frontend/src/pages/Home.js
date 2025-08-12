import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../styles/Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to TypeGo</h1>
      <p className="home-description">
        Your typing assistant, improve your typing skills with real-time accuracy and speed tracking.
      </p>
      
      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/test" className="nav-link">Typing Test</Link>
        <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
      </div>
    </div>
  );
};

export default Home;
/*import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../styles/Home.css"; // Import styles

const Home = () => {
  const fullText = "Your typing assistant, improve your typing skills with real-time accuracy and speed tracking.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust speed of typing (lower = faster)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to TypeGo</h1>
      {/* Use displayedText instead of full text */
      {/*<p className="home-description">{displayedText}</p>

      {/* Navigation Links */}
      {/*<div className="nav-links">
        <Link to="/test" className="nav-link">Typing Test</Link>
        <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
      </div>
    </div>
  );
};

export default Home;*/}
