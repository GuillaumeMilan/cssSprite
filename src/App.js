import React from 'react';
//import logo from './logo.svg';
import Sprite from './Sprite.js';
import Point from './Geometry.js';
import './App.css';

function App() {
  const faceAnnimation = new Sprite("amaura-face-walk", './Amaura.png', (new Point(57, 71)), (new Point(297, 71)), new Point(20, 26), 12, "2s", {})
  return (
    <div>
      <div>TEXT</div>
      <div className="Sprite-holder">
      </div>
      <div style={faceAnnimation.toCss()}></div>
    </div>
  );
}

export default App;
