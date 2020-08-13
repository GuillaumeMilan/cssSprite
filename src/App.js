import React from 'react';
import Sprite from './Sprite.js';
import Vector from './Geometry.js';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.spriteSize = new Vector(20, 28);
    this.movementSpeed = 120;
    this.IdleFaceSprite  = new Sprite("amaura-idle-face", './Amaura.png', new Vector(60, 69), new Vector(1, 0), this.spriteSize, 12, "5s", {});
    this.IdleLeftSprite  = new Sprite("amaura-idle-left", './Amaura.png', new Vector(60, 98), new Vector(1, 0), this.spriteSize, 12, "5s", {});
    this.IdleBackSprite  = new Sprite("amaura-idle-back", './Amaura.png', new Vector(60, 126), new Vector(1, 0), this.spriteSize, 12, "5s", {});
    this.IdleRightSprite = new Sprite("amaura-idle-right", './Amaura.png', new Vector(60, 156), new Vector(1, 0), this.spriteSize, 12, "5s", {});

    this.RunFaceSprite  = new Sprite("amaura-run-face", './Amaura.png', new Vector(320, 69), new Vector(1, 0), this.spriteSize, 12, "1s", {});
    this.RunLeftSprite  = new Sprite("amaura-run-left", './Amaura.png', new Vector(320, 98), new Vector(1, 0), this.spriteSize, 12, "1s", {});
    this.RunBackSprite  = new Sprite("amaura-run-back", './Amaura.png', new Vector(320, 126), new Vector(1, 0), this.spriteSize, 12, "1s", {});
    this.RunRightSprite = new Sprite("amaura-run-right", './Amaura.png', new Vector(320, 156), new Vector(1, 0), this.spriteSize, 12, "1s", {});



    this.state = {
      direction: "down",
      position: new Vector(40, 40),
      transition: 0,
    }
  }

  aumauraSpriteStyle() {
    if(this.state.moving)
      return ({
        "up": this.RunBackSprite,
        "left": this.RunLeftSprite,
        "down": this.RunFaceSprite,
        "right": this.RunRightSprite,
      })[this.state.direction].toCss()

    return ({
      "up": this.IdleBackSprite,
      "left": this.IdleLeftSprite,
      "down": this.IdleFaceSprite,
      "right": this.IdleRightSprite,
    })[this.state.direction].toCss()
  }

  componentDidMount() {
    const self = this;
    window.addEventListener("keydown", function(e) {
      if(self.state.moving)
        return
      const f = {
        87: () => self.setState({direction: "up"}),
        65: () => self.setState({direction: "left"}),
        83: () => self.setState({direction: "down"}),
        68: () => self.setState({direction: "right"})
      }[e.keyCode]
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

  onMoveSprite(e) {
    const rect = this.state.minigameRef.getBoundingClientRect();
    const spriteRect = this.state.spriteRef.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const movementVect = new Vector(x - (spriteRect.left - rect.left) - this.spriteSize.x/2, y - (spriteRect.top - rect.top) - this.spriteSize.y/2);

    const angleSides = 4

    const angle = Math.floor(angleSides*movementVect.getAngle()/Math.PI)

    const direction = ({
      0: "right",
      1: "up",
      2: "left",
      3: "down"
    })[Math.ceil(angle/2) % angleSides]

    const transition = Math.sqrt(Math.pow(movementVect.x, 2) + Math.pow(movementVect.y, 2))/this.movementSpeed

    if(this.state.movementTimeout)
      clearTimeout(this.state.movementTimeout)

    this.setState({
      moving: true,
      movementTimeout: setTimeout(() => this.setState({moving: false}), transition * 1000),
      position: new Vector(x, y),
      transition: transition,
      direction: direction
    })
  }

  render() {
    return (

      <div className="Sprites-container">
        <div className="Sprite-example-container"><div className="Sprite-example"></div></div>
        <div className="Minigame" onClick={this.onMoveSprite.bind(this)} ref={this.setMinigameRef.bind(this)}>
          <div ref={this.setSpriteRef.bind(this)} style={{
            ...this.aumauraSpriteStyle(),
              position: "relative",
              top: this.state.position.y - this.spriteSize.y/2,
              left: this.state.position.x - this.spriteSize.x/2,
              transition: `top ${this.state.transition}s linear, left ${this.state.transition}s linear`
          }}></div>
        </div>
      </div>
    );
  }
}

export default App;
