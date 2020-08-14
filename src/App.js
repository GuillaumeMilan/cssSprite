import React from 'react';
import Sprite from './Sprite.js';
import Vector from './Geometry.js';
import './App.css';


/* TODO Implement FSM*/
/*
 * idle           -----onMove         -----> moving
 * idle           -----onEat          -----> eating
 * idle           -----onFallingASleep-----> falling-asleep
 * falling-asleep -----onSleeping     -----> sleeping
 * sleeping       -----onWakingUp     -----> waking-up
 * waking-up      -----onIdleing      -----> idle
 * moving         -----onIdleing      -----> idle
 * moving         -----onMove         -----> moving
 */

class App extends React.Component {

  constructor(props) {
    super(props);

    this.spriteSize = new Vector(20, 28);
    this.movementSpeed = 120;
    this.IdleFaceSprite   = new Sprite("amaura-idle-face",   './Amaura.png', new Vector(60, 69),   new Vector(1, 0), this.spriteSize, 12, 5000, {scalePow: 2});
    this.IdleLeftSprite   = new Sprite("amaura-idle-left",   './Amaura.png', new Vector(60, 98),   new Vector(1, 0), this.spriteSize, 12, 5000, {scalePow: 2});
    this.IdleBackSprite   = new Sprite("amaura-idle-back",   './Amaura.png', new Vector(60, 126),  new Vector(1, 0), this.spriteSize, 12, 5000, {scalePow: 2});
    this.IdleRightSprite  = new Sprite("amaura-idle-right",  './Amaura.png', new Vector(60, 156),  new Vector(1, 0), this.spriteSize, 12, 5000, {scalePow: 2});

    this.RunFaceSprite    = new Sprite("amaura-run-face",    './Amaura.png', new Vector(320, 69),  new Vector(1, 0), this.spriteSize, 12, 1000, {scalePow: 2});
    this.RunLeftSprite    = new Sprite("amaura-run-left",    './Amaura.png', new Vector(320, 98),  new Vector(1, 0), this.spriteSize, 12, 1000, {scalePow: 2});
    this.RunBackSprite    = new Sprite("amaura-run-back",    './Amaura.png', new Vector(320, 126), new Vector(1, 0), this.spriteSize, 12, 1000, {scalePow: 2});
    this.RunRightSprite   = new Sprite("amaura-run-right",   './Amaura.png', new Vector(320, 156), new Vector(1, 0), this.spriteSize, 12, 1000, {scalePow: 2});
    this.EatSprite        = new Sprite("amaura-eat",         './Amaura.png', new Vector(60,  0),   new Vector(1, 0), this.spriteSize, 12, 5000, {scalePow: 2});
    this.FallASleepSprite = new Sprite("amaura-fall-asleep", './Amaura.png', new Vector(300, 21),  new Vector(1, 0), this.spriteSize, 3,  1250, {scalePow: 2});
    this.ASleepSprite     = new Sprite("amaura-asleep",      './Amaura.png', new Vector(360, 21),  new Vector(1, 0), this.spriteSize, 3,  1250, {scalePow: 2});
    this.WakingUpSprite   = new Sprite("amaura-waking-up",   './Amaura.png', new Vector(420, 21),  new Vector(1, 0), this.spriteSize, 3,  1250, {scalePow: 2});



    this.state = {
      direction: "down",
      position: new Vector(40, 40),
      transition: 0,
    }
  }

  selectedSprite() {
    /* TODO Change it with a "switch" */
    if(this.state.action === "falling-asleep")
      return this.FallASleepSprite
    if(this.state.action === "sleeping")
      return this.ASleepSprite
    if(this.state.action === "waking-up")
      return this.WakingUpSprite
    if(this.state.action === "eating")
      return this.EatSprite
    if(this.state.action === "moving")
      return ({
        "up": this.RunBackSprite,
        "left": this.RunLeftSprite,
        "down": this.RunFaceSprite,
        "right": this.RunRightSprite,
      })[this.state.direction]

    return ({
      "up": this.IdleBackSprite,
      "left": this.IdleLeftSprite,
      "down": this.IdleFaceSprite,
      "right": this.IdleRightSprite,
    })[this.state.direction]
  }

  aumauraSpriteStyle() {
    return this.selectedSprite().toCss()
  }

  onChangeDirection(direction) {
    if(this.state.action)
      return
    this.setState({direction: direction})
  }

  componentDidMount() {
    const self = this;
    window.addEventListener("keydown", function(e) {
      const f = {
        69: () => self.onEat(),
        82: () => self.onFallingASleep(),
        90: () => self.onWakingUp(),
        87: () => self.onChangeDirection("up"),
        65: () => self.onChangeDirection("left"),
        83: () => self.onChangeDirection("down"),
        68: () => self.onChangeDirection("right")
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

  onEat(e) {
    if(this.state.action)
      return

    if(this.state.actionTimeout)
      clearTimeout(this.state.actionTimeout)

    this.setState({
      action: "eating",
      actionTimeout: setTimeout(() => this.setState({action: false}), this.EatSprite.animationTime)
    })
  }

  onFallingASleep(e) {
    if(this.state.action)
      return

    if(this.state.actionTimeout)
      clearTimeout(this.state.actionTimeout)

    this.setState({
      action: "falling-asleep",
      actionTimeout: setTimeout(() => this.onSleeping(), this.FallASleepSprite.animationTime)
    })
  }

  onSleeping(e) {
    if(this.state.action !== "falling-asleep")
      return

    if(this.state.actionTimeout)
      clearTimeout(this.state.actionTimeout)

    this.setState({
      action: "sleeping",
    })
  }

  onWakingUp(e) {
    if(this.state.action !== "sleeping")
      return

    if(this.state.actionTimeout)
      clearTimeout(this.state.actionTimeout)

    this.setState({
      action: "waking-up",
      actionTimeout: setTimeout(() => this.setState({action: false}), this.WakingUpSprite.animationTime)
    })
  }

  onMove(e) {
    if(this.state.action && this.state.action !== "moving")
      return

    const rect = this.state.minigameRef.getBoundingClientRect();
    const spriteRect = this.state.spriteRef.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const movementVect = new Vector(x - (spriteRect.left - rect.left) - this.selectedSprite().spriteSize.x/2, y - (spriteRect.top - rect.top) - this.selectedSprite().spriteSize.y/2);

    const angleSides = 4

    const angle = Math.floor(angleSides*movementVect.getAngle()/Math.PI)

    const direction = ({
      0: "right",
      1: "up",
      2: "left",
      3: "down"
    })[Math.ceil(angle/2) % angleSides]

    const transition = Math.sqrt(Math.pow(movementVect.x, 2) + Math.pow(movementVect.y, 2))/this.movementSpeed

    if(this.state.actionTimeout)
      clearTimeout(this.state.actionTimeout)

    this.setState({
      action: "moving",
      actionTimeout: setTimeout(() => this.setState({action: false}), transition * 1000),
      position: new Vector(x, y),
      transition: transition,
      direction: direction
    })
  }

  onIdleing(e) {
    this.setState({action: "idle"})
  }

  render() {
    console.log("State", this.state)
    return (
      <div className="Sprites-container">
        <div className="Sprite-example-container"><div className="Sprite-example"></div></div>
        <div className="Minigame" onClick={this.onMove.bind(this)} ref={this.setMinigameRef.bind(this)}>
          <div className="PixelArt" ref={this.setSpriteRef.bind(this)} style={{
            ...this.aumauraSpriteStyle(),
              position: "relative",
              top: this.state.position.y - this.selectedSprite().spriteSize.y/2,
              left: this.state.position.x - this.selectedSprite().spriteSize.x/2,
              transition: `top ${this.state.transition}s linear, left ${this.state.transition}s linear`
          }}></div>
        </div>
      </div>
    );
  }
}

export default App;
