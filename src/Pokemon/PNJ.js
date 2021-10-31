/*import React from 'react';
import Sprite from '../Sprite.js';
import Vector from '../Geometry.js';
import FSMTransitions from '../FSM/FSMTransitions.js';
import FSM from '../FSM/FSM.js';
import '../App.css';*/
import Pokemon from './Pokemon.js';

class PNJ extends Pokemon {
  /*constructor(props) {
    super(props);
  }*/

  componentDidMount() {
    this.decisionLoop()
  }

  decisionLoop() {
    this.takeDecision()
    setTimeout(this.decisionLoop.bind(this), Math.random()*3000)
  }

  takeDecision() {
    if(!this.props.minigameRef())
      return
    if(Math.random() < 0.9)
      return
    const rect = this.props.minigameRef().getBoundingClientRect();
    let next_x = Math.random()*rect.width
    let next_y = Math.random()*rect.height
    return this.onFSMEvent({clientX: next_x + rect.left, clientY: next_y + rect.top}, "onMove")()
  }
}

export default PNJ;
