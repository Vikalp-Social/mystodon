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
          Choose Your Algorithms, Choose Your Experiences.
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
          empowering users with the freedom to decide what they consume on social media and how they consume it.</p>
          <p>At Vikalp.Social, we are dedicated to providing options that put you in control.</p>
        <p>
          We’re a work in progress, continuously improving and evolving to create a platform that gives people the 
          freedom to shape their social media experience.
        </p>
      </section>

      <section className="about-features">
        <div className="feature">
          <h2>Part of the Fediverse</h2>
          <p>
            Vikalp is just a client which can connect to any Mastodon Instance.
          </p>
        </div>
        <div className="feature">
          <h2>Privacy First</h2>
          <p>
          We do not store any information about you. Enjoy a space free from tracking, and hidden algorithms.
          </p>
        </div>
        <div className="feature">
          <h2>100% Open Source</h2>
          <p>
            Open Source is part of our DNA. Find all the code <a href='https://github.com/Vikalp-Social'>here</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
