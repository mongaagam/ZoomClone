import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import '../styles/landing.css';

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="landingContainer">
      
      {/* 3D Background */}
      <div className="bgContainer">
        <Spline scene="https://prod.spline.design/BEMLG1Wwm6J012o5/scene.splinecode" />
      </div>

      {/* Foreground content */}
      <div className="contentWrapper">
        <nav className="navbar">
          <div className="brand">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 10px rgba(255, 152, 57, 0.2))' }}>
              <defs>
                <linearGradient id="logoGradLanding" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF9839" />
                  <stop offset="100%" stopColor="#FF5E62" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="28" fill="url(#logoGradLanding)" />
              <rect x="25" y="33" width="32" height="32" rx="6" fill="white" />
              <polygon points="56,41 72,31 72,67 56,57" fill="white" />
              <path d="M30,49 L36,49 L39,39 L43,59 L46,49 L52,49" stroke="#FF5E62" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Vibe<span style={{ color: '#FF9839' }}>Connect</span></span>
          </div>
          <div className="navActions">
            <button className="btn" onClick={() => router("/aljk23")}>Join as Guest</button>
            <button className="btn" onClick={() => router("/auth")}>Register</button>
            <button className="btn" onClick={() => router("/auth")}>Login</button>
          </div>
        </nav>

        <div className="heroSection">
          <h1 className="heroTitle">
            <span>Connect</span> with your loved Ones
          </h1>
          <p className="heroSubtitle">Cover a distance by VibeConnect</p>
          <div>
            <Link to="/auth">
               <button className="btnBig">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

