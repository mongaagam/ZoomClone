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
            ✨ VibeConnect
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

