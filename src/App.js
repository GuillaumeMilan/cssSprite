import React from 'react';
//import logo from './logo.svg';
import Sprite from './Sprite.js';
import Vector from './Geometry.js';
import './App.css';

function App() {
  const faceAnnimation = new Sprite("sprite-animate", './Amaura.png', new Vector(57, 71), new Vector(1, 0), new Vector(20, 26), 12, "3s", {})
  return (
    <div>
      <div className="Sprite-holder">
      </div>
      <div style={faceAnnimation.toCss()}></div>
    </div>
  );
}

export default App;
