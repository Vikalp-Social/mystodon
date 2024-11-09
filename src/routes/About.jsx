// About.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/about.css';
import ThemePicker from '../theme/ThemePicker';

function About() {
  let navigate = useNavigate()

  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Welcome to Vikalp.Social</h1>
        <p>
          Join a network that values privacy, autonomy, and community. Here, you’re part of a user-first platform.
        </p>
        <div className="cta-buttons">
          <button className="my-button" type="submit" onClick={() => window.location.pathname = "/"}>Explore</button>
          <button className="my-button" type="submit" onClick={() => window.open("https://joinmastodon.org/", "_blank")}>Join Now</button>
        </div>
      </header>

      <section className="about-description">
        <h2>Our Mission: Freedom of Choice</h2>
        <p>
          <strong>Vikalp</strong>, which means “Choice” in various Indian languages, represents our vision: 
          empowering users with the freedom to decide what they consume on social media and how they consume it. 
          At Vikalp.Social, we are dedicated to providing options that put you in control.
        </p>
        <p>
          We’re a work in progress, continuously improving and evolving to create a platform that gives people the 
          freedom to shape their social media experience.
        </p>
      </section>

      <section className="about-features">
        <div className="feature">
          <h2>Decentralized and Open-Source</h2>
          <p>
            Your data remains yours, free from centralized control. Join a network by the users, for the users.
          </p>
        </div>
        <div className="feature">
          <h2>No Ads, No Tracking</h2>
          <p>
            Enjoy a space free from ads, tracking, and hidden algorithms. Connect and engage without distractions.
          </p>
        </div>
        <div className="feature">
          <h2>Community-Focused Connections</h2>
          <p>
            Explore and join communities that matter to you. Unique, user-moderated spaces designed for genuine engagement.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
