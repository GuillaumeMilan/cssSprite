import React from 'react';
import Vector from './Geometry.js';
import Pokemon from './Pokemon/Pokemon.js';
import PNJ from './Pokemon/PNJ.js';
import './App.css';


/* TODO Implement FSM*/
/*
 * idle           -----onMove         -----> moving
 * moving         -----onMove         -----> moving
 * idle           -----onEat          -----> eating
 * idle           -----onFallingASleep-----> falling-asleep
 * falling-asleep -----onSleeping     -----> sleeping
 * sleeping       -----onWakingUp     -----> waking-up
 * waking-up      -----onIdleing      -----> idle
 * moving         -----onIdleing      -----> idle
 * eating         -----onIdleing      -----> idle
 */

class App extends React.Component {

  constructor(props) {

    super(props);

    const self = this;

    //this.Amaura2 = <Pokemon name="amaura2" src="./Amaura.png" position={new Vector(80, 80)} spriteRef={function(ref) {console.log("POKEMON REF", ref)}}/>
    this.Amaura2 = <PNJ name="amaura3" src="./Amaura.png" position={new Vector(200, 200)} minigameRef={() => self.state.minigameRef} spriteRef={function(ref, onFSMEvent) {}}/>
    this.Amaura3 = <Pokemon name="amaura3" src="./Amaura.png" position={new Vector(200, 200)} minigameRef={() => self.state.minigameRef} spriteRef={function(ref, onFSMEvent) {self.Amaura3onFSMEvent = onFSMEvent}}/>

    this.state = {}
  }

  componentDidMount() {
    const self = this;
    window.addEventListener("keydown", function(e) {
      const f = {
        69: () => self.Amaura3onFSMEvent(e, "onEat")(), /* E */
        82: () => self.Amaura3onFSMEvent(e, "onFallingASleep")(), /* R */
        90: () => self.Amaura3onFSMEvent(e, "onWakingUp")(), /* Z */
        87: () => self.onChangeDirection("up"), /* W */
        65: () => self.onChangeDirection("left"), /* A */
        83: () => self.onChangeDirection("down"), /* S */
        68: () => self.onChangeDirection("right") /* D */
      }[e.keyCode]
      console.log("KEYCODE", e.keyCode)
      return f && f()
    })
  }

  setMinigameRef(ref) {
    if(this.state.minigameRef)
      return
    this.setState({minigameRef: ref})
  }

  setSpriteRef(ref) {
    if(this.state.spriteRef)
      return
    this.setState({spriteRef: ref})
  }

  onIdleing(e) {
    return {type: "next_state", clearTimeouts: {type: "all"}}
  }

  onEat(e) {
    return {type: "next_state", data: {direction: "down"}, timeouts: [{type: "common", callback: this.onFSMEvent(null, "onIdleing"), delay: this.EatSprite.animationTime}], clearTimeouts: {type: "all"}}
  }

  onFallingASleep(e) {
    return {type: "next_state", timeouts: [{type: "common", callback: this.onFSMEvent(null, "onSleeping"), delay: this.FallASleepSprite.animationTime}], clearTimeouts: {type: "all"}}
  }

  onSleeping(e) {
    return {type: "next_state", clearTimeouts: {type: "all"}}
  }

  onWakingUp(e) {
    return {type: "next_state", data: {direction: "down"}, timeouts: [{type: "common", callback: this.onFSMEvent(null, "onIdleing"), delay: this.WakingUpSprite.animationTime}], clearTimeouts: {type: "all"}}
  }

  onMove(e) {
    const rect = this.state.minigameRef.getBoundingClientRect();
    const spriteRect = this.state.spriteRef.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const movementVect = new Vector(x - (spriteRect.left - rect.left) - this.selectedSprite().spriteSize.x/2, y - (spriteRect.top - rect.top) - this.selectedSprite().spriteSize.y/2);

    const angleSides = 4

    const angle = Math.floor(angleSides*movementVect.getAngle()/Math.PI)

    /* In case angle can't be defined we make down angle*/
    const direction = ({
      0: "right",
      1: "up",
      2: "left",
      3: "down"
    })[Math.ceil(angle/2) % angleSides] || "down"
    const transition = Math.sqrt(Math.pow(movementVect.x, 2) + Math.pow(movementVect.y, 2))/this.movementSpeed

    if(this.state.actionTimeout)
      clearTimeout(this.state.actionTimeout)

    const data = {
      position: new Vector(x, y),
      transition: transition,
      direction: direction
    }
    return {type: "next_state", data: data, timeouts: [{type: "common", callback: this.onFSMEvent(null, "onIdleing"), delay: transition*1000}], clearTimeouts: {type: "all"}}
  }

  render() {
    //console.log("State", this.state)
    return (
      <div className="Sprites-container">
        <div className="Sprite-example-container"><div className="Sprite-example"></div></div>
        <div className="Minigame" onClick={(e) => this.Amaura3onFSMEvent(e, "onMove")()} ref={this.setMinigameRef.bind(this)}>
          {this.Amaura3}
          {this.Amaura2}
          <div style={{
            position: "relative",
            float: "left",
            height: "100px",
            width: "100px",
            backgroundColor: "#f00",
            zIndex: 110,
            top: "10px",
            left: "10px"
          }}></div>
        </div>
      </div>
    );
  }
}

export default App;
