import React from 'react';
import Sprite from '../Sprite.js';
import Vector from '../Geometry.js';
import FSMTransitions from '../FSM/FSMTransitions.js';
import FSM from '../FSM/FSM.js';
import '../App.css';

class Pokemon extends React.Component {

  constructor(props) {
    super(props);

    const self = this;

    self.FSMTransitions = new FSMTransitions()
    self.FSMTransitions.addAction("onMove",          self.onMove.bind(self))
    self.FSMTransitions.addAction("onEat",           self.onEat.bind(self))
    self.FSMTransitions.addAction("onFallingASleep", self.onFallingASleep.bind(self))
    self.FSMTransitions.addAction("onSleeping",      self.onSleeping.bind(self))
    self.FSMTransitions.addAction("onWakingUp",      self.onWakingUp.bind(self))
    self.FSMTransitions.addAction("onIdleing",       self.onIdleing.bind(self))

    self.FSMTransitions.addTransition("onMove",           "idle",           ["moving"])
    self.FSMTransitions.addTransition("onMove",           "moving",         ["moving"])
    self.FSMTransitions.addTransition("onEat",            "idle",           ["eating"])
    self.FSMTransitions.addTransition("onFallingASleep",  "idle",           ["falling-asleep"])
    self.FSMTransitions.addTransition("onSleeping",       "falling-asleep", ["sleeping"])
    self.FSMTransitions.addTransition("onWakingUp",       "sleeping",       ["waking-up"])
    self.FSMTransitions.addTransition("onIdleing",        "waking-up",      ["idle"])
    self.FSMTransitions.addTransition("onIdleing",        "moving",         ["idle"])
    self.FSMTransitions.addTransition("onIdleing",        "eating",         ["idle"])

    self.FSM = new FSM("idle", self.FSMTransitions, function(state, data) {
      self.setState({...data, action: state})
    })

    /* TODO Make pokemon sprite size comes as parameter */
    self.spriteSize = new Vector(20, 28);
    self.movementSpeed = 120;
    self.IdleFaceSprite   = new Sprite(self.props.name+"-idle-face",   self.props.src, new Vector(60, 69),   new Vector(1, 0), self.spriteSize, 12, 5000, {scalePow: 2});
    self.IdleLeftSprite   = new Sprite(self.props.name+"-idle-left",   self.props.src, new Vector(60, 98),   new Vector(1, 0), self.spriteSize, 12, 5000, {scalePow: 2});
    self.IdleBackSprite   = new Sprite(self.props.name+"-idle-back",   self.props.src, new Vector(60, 126),  new Vector(1, 0), self.spriteSize, 12, 5000, {scalePow: 2});
    self.IdleRightSprite  = new Sprite(self.props.name+"-idle-right",  self.props.src, new Vector(60, 156),  new Vector(1, 0), self.spriteSize, 12, 5000, {scalePow: 2});

    self.RunFaceSprite    = new Sprite(self.props.name+"-run-face",    self.props.src, new Vector(320, 69),  new Vector(1, 0), self.spriteSize, 12, 1000, {scalePow: 2});
    self.RunLeftSprite    = new Sprite(self.props.name+"-run-left",    self.props.src, new Vector(320, 98),  new Vector(1, 0), self.spriteSize, 12, 1000, {scalePow: 2});
    self.RunBackSprite    = new Sprite(self.props.name+"-run-back",    self.props.src, new Vector(320, 126), new Vector(1, 0), self.spriteSize, 12, 1000, {scalePow: 2});
    self.RunRightSprite   = new Sprite(self.props.name+"-run-right",   self.props.src, new Vector(320, 156), new Vector(1, 0), self.spriteSize, 12, 1000, {scalePow: 2});
    self.EatSprite        = new Sprite(self.props.name+"-eat",         self.props.src, new Vector(60,  0),   new Vector(1, 0), self.spriteSize, 12, 5000, {scalePow: 2});
    self.FallASleepSprite = new Sprite(self.props.name+"-fall-asleep", self.props.src, new Vector(300, 21),  new Vector(1, 0), self.spriteSize, 3,  1250, {scalePow: 2});
    self.ASleepSprite     = new Sprite(self.props.name+"-asleep",      self.props.src, new Vector(360, 21),  new Vector(1, 0), self.spriteSize, 3,  1250, {scalePow: 2});
    self.WakingUpSprite   = new Sprite(self.props.name+"-waking-up",   self.props.src, new Vector(420, 21),  new Vector(1, 0), self.spriteSize, 3,  1250, {scalePow: 2});

    self.state = {
      action: "idle",
      direction: "down",
      position: (self.props.position?self.props.position:new Vector(40,40)),
      zIndex: (self.props.position?self.props.position.y:40) + self.IdleFaceSprite.spriteSize.y/2,
      transition: 0,
    }
  }

  setSpriteRef(ref) {
    if(!this.state.ref)
      this.setState({ref: ref})
    this.props.spriteRef(ref, this.onFSMEvent.bind(this))
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
    const self = this
    const rect = this.props.minigameRef().getBoundingClientRect();
    const spriteRect = this.state.ref.getBoundingClientRect();

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

    const previousZIndexAnimation = this.state.ref.getAnimations().find((a) => a.animationName === "zIndex")
    previousZIndexAnimation && previousZIndexAnimation.cancel()
    const previousZIndex = Math.floor(spriteRect.top - rect.top + this.selectedSprite().spriteSize.y)
    const nextZIndex = Math.floor(y + this.selectedSprite().spriteSize.y/2)
    const zIndexAnimation = this.state.ref.animate([{zIndex: previousZIndex}, {zIndex: nextZIndex}], transition*1000)
    zIndexAnimation.animationName = "zIndex"
    zIndexAnimation.onfinish = function() {
      self.setState({zIndex: nextZIndex})
    }

    const data = {
      position: new Vector(x, y),
      transition: transition,
      direction: direction
    }
    return {type: "next_state", data: data, timeouts: [{type: "common", callback: this.onFSMEvent(null, "onIdleing"), delay: transition*1000}], clearTimeouts: {type: "all"}}
  }

  selectedSprite() {
    const self = this;
    return ({
      "falling-asleep": () => self.FallASleepSprite,
      "sleeping": () => self.ASleepSprite,
      "waking-up": () => self.WakingUpSprite,
      "eating": () => self.EatSprite,
      "moving": function(direction) {
        return ({
          "up": self.RunBackSprite,
          "left": self.RunLeftSprite,
          "down": self.RunFaceSprite,
          "right": self.RunRightSprite,
        })[self.state.direction]
      },
      "idle": function(direction) {
        return ({
          "up": self.IdleBackSprite,
          "left": self.IdleLeftSprite,
          "down": self.IdleFaceSprite,
          "right": self.IdleRightSprite,
        })[self.state.direction]
      }
    })[self.state.action]()
  }

  render() {
    return (
      <div  ref={this.setSpriteRef.bind(this)} style={{
        position: "relative",
        height: 0,
        width: 0,
        zIndex: this.state.zIndex,
        top: this.state.position.y - this.selectedSprite().spriteSize.y/2,
        left: this.state.position.x - this.selectedSprite().spriteSize.x/2,
        transition: `top ${this.state.transition}s linear, left ${this.state.transition}s linear`
      }}>
      <div className="PixelArt" style={{
          ...this.selectedSprite().toCss(),
       }}></div>
      </div>
    );
  }
}

export default Pokemon;
