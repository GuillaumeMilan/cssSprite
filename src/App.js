import React from 'react';
import Sprite from './Sprite.js';
import Vector from './Geometry.js';
import FSMTransitions from './FSM/FSMTransitions.js'
import FSM from './FSM/FSM.js'
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

    this.FSMTransitions = new FSMTransitions()
    this.FSMTransitions.addAction("onMove",          this.onMove.bind(this))
    this.FSMTransitions.addAction("onEat",           this.onEat.bind(this))
    this.FSMTransitions.addAction("onFallingASleep", this.onFallingASleep.bind(this))
    this.FSMTransitions.addAction("onSleeping",      this.onSleeping.bind(this))
    this.FSMTransitions.addAction("onWakingUp",      this.onWakingUp.bind(this))
    this.FSMTransitions.addAction("onIdleing",       this.onIdleing.bind(this))

    this.FSMTransitions.addTransition("onMove",           "idle",           ["moving"])
    this.FSMTransitions.addTransition("onMove",           "moving",         ["moving"])
    this.FSMTransitions.addTransition("onEat",            "idle",           ["eating"])
    this.FSMTransitions.addTransition("onFallingASleep",  "idle",           ["falling-asleep"])
    this.FSMTransitions.addTransition("onSleeping",       "falling-asleep", ["sleeping"])
    this.FSMTransitions.addTransition("onWakingUp",       "sleeping",       ["waking-up"])
    this.FSMTransitions.addTransition("onIdleing",        "waking-up",      ["idle"])
    this.FSMTransitions.addTransition("onIdleing",        "moving",         ["idle"])
    this.FSMTransitions.addTransition("onIdleing",        "eating",         ["idle"])

    this.FSM = new FSM("idle", this.FSMTransitions, function(state, data) {
      self.setState({...data, action: state})
    })

    console.log("this.FSMTransitions", this.FSMTransitions)

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
      action: "idle",
      direction: "down",
      position: new Vector(40, 40),
      transition: 0,
    }
  }

  onFSMEvent(e, action) {
    return function () {
      try {
        return this.FSM.onEvent(e, action, this.state.action)
      } catch(e) {
        console.error(e)
        return
      }
    }.bind(this)
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
        69: () => self.onFSMEvent(e, "onEat")(),
        82: () => self.onFSMEvent(e, "onFallingASleep")(),
        90: () => self.onFSMEvent(e, "onWakingUp")(),
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

  onIdleing(e) {
    return {type: "next_state"}
  }

  onEat(e) {
    return {type: "next_state", timeouts: [{type: "common", callback: this.onFSMEvent(null, "onIdleing"), delay: this.EatSprite.animationTime}]}
  }

  onFallingASleep(e) {
    return {type: "next_state", timeouts: [{type: "common", callback: this.onFSMEvent(null, "onSleeping"), delay: this.FallASleepSprite.animationTime}]}
  }

  onSleeping(e) {
    return {type: "next_state"}
  }

  onWakingUp(e) {
    return {type: "next_state", timeouts: [{type: "common", callback: this.onFSMEvent(null, "onWakingUp"), delay: this.WakingUpSprite.animationTime}]}
  }

  onMove(e) {
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

    const data = {
      position: new Vector(x, y),
      transition: transition,
      direction: direction
    }
    return {type: "next_state", data: data, timeouts: [{type: "common", callback: this.onFSMEvent(null, "onIdleing"), delay: transition*1000}]}
  }

  render() {
    //console.log("State", this.state)
    return (
      <div className="Sprites-container">
        <div className="Sprite-example-container"><div className="Sprite-example"></div></div>
        <div className="Minigame" onClick={(e) => this.onFSMEvent(e, "onMove")()} ref={this.setMinigameRef.bind(this)}>
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
