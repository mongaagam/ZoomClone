import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

export default function LandingPage() {
  const router = useNavigate();

  const buttonStyle = {
    padding: '12px 28px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '30px',
    background: '#FF9839',
    color: ' black',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0px 4px 15px rgba(231, 222, 222, 0.2)',
  };

  const bigButtonStyle = {
    ...buttonStyle,
    fontSize: '1.2rem',
    padding: '16px 36px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#ff7f00',
    transform: 'scale(1.05)',
    boxShadow: '0px 0px 12px #FF9839',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: `'Segoe UI', sans-serif` }}>
      
      {/* 3D Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Spline scene="https://prod.spline.design/BEMLG1Wwm6J012o5/scene.splinecode" />
      </div>

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px', alignItems: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#FF9839' }}>
            ✨ VibeConnect
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <HoverButton style={buttonStyle} onClick={() => router("/aljk23")}>Join as Guest</HoverButton>
            <HoverButton style={buttonStyle} onClick={() => router("/auth")}>Register</HoverButton>
            <HoverButton style={buttonStyle} onClick={() => router("/auth")}>Login</HoverButton>
          </div>
        </nav>

        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            <span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones
          </h1>
          <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>Cover a distance by VibeConnect</p>
          <div style={{ marginTop: '30px' }}>
            <Link to="/auth">
              <HoverButton style={bigButtonStyle}>Get Started</HoverButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom inline hover effect
function HoverButton({ children, style, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        ...(hover ? {
          backgroundColor: '#ff7f00',
          transform: 'scale(1.05)',
          boxShadow: '0px 0px 12px #FF9839'
        } : {})
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}
