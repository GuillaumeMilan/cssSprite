import React from 'react';
//import logo from './logo.svg';
import Sprite from './Sprite.js';
import Vector from './Geometry.js';
import './App.css';

function App() {
  const faceAnimation = new Sprite("sprite-animate", './Amaura.png', new Vector(60, 71), new Vector(1, 0), new Vector(20, 26), 12, "3s", {})
  const profileLeft = new Sprite("amaura-left", './Amaura.png', new Vector(60, 98), new Vector(1, 0), new Vector(20, 28), 12, "3s", {})
  const backAnimation = new Sprite("amaura-back", './Amaura.png', new Vector(60, 127), new Vector(1, 0), new Vector(20, 27), 12, "3s", {})
  const profileRight = new Sprite("amaura-right", './Amaura.png', new Vector(60, 156), new Vector(1, 0), new Vector(20, 28), 12, "3s", {})
  return (
    <div className="Sprites-container">
      <div className="Sprite-holder">
      </div>
      <div className="Sprite" style={faceAnimation.toCss()}></div>
      <div className="Sprite" style={profileLeft.toCss()}></div>
      <div className="Sprite" style={backAnimation.toCss()}></div>
      <div className="Sprite" style={profileRight.toCss()}></div>
    </div>
  );
}

export default App;
