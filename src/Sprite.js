import Vector from './Geometry.js';

function camelToCss(string) {
  return string.replace(/[\w]([A-Z])/g, function(m) {
    return m[0] + "-" + m[1];
  }).toLowerCase();
}
function generateKeyFramesText(keyFramesId, keyFrames) {
  return "@keyframes " + keyFramesId + "{" + Object.keys(keyFrames).map(function(key) {
    const properties = Object.keys(keyFrames[key]).map((propsKey) => `${camelToCss(propsKey)}: ${keyFrames[key][propsKey]};\n`)
    return `${key} {${properties}}`
  }).join("\n") + "}";
}

function uploadKeyFrame(keyFrameID, keyFrameContent) {
  /* Horrible code but document.styleSheets seems to not be iterable */
  var keyFrameSheet = undefined;
  var keyFrameIndex = undefined;
  for(var i = 0; i < document.styleSheets.length; i++) {
    for(var j = 0; j < (document.styleSheets[i].cssRules.length); j++) {
      if((document.styleSheets[i].cssRules[j] instanceof CSSKeyframesRule) && document.styleSheets[i].cssRules[j].name === keyFrameID) {
        keyFrameSheet = i;keyFrameIndex = j;
        document.styleSheets[keyFrameSheet].deleteRule(keyFrameIndex)
        break;
      }
    }
  }
  if((keyFrameSheet === undefined) || (keyFrameIndex === undefined)) {
    keyFrameSheet = 0;
    keyFrameIndex = document.styleSheets[keyFrameSheet].length;
  }
  document.styleSheets[keyFrameSheet].insertRule(generateKeyFramesText(keyFrameID, keyFrameContent), keyFrameIndex)
}

class Sprite {

  #spriteSize = undefined;

  constructor(id, imageSrc, firstSprite, spriteDirection, spriteSize, framesCount, animationTime, opts) {
    this.id = id;
    this.imageSrc = imageSrc;
    this.firstSprite = firstSprite;
    this.spriteDirection = spriteDirection;
    this.#spriteSize = spriteSize;
    this.framesCount = framesCount;
    this.animationTime = animationTime;
    this.keyFrames = this.generateKeyFrames();
    this.opts = opts;
    uploadKeyFrame(this.id, this.keyFrames)
  }

  get scale() {
    return Math.pow(2, (this.opts && this.opts.scalePow) || 0)
  }

  get spriteSize() {
    return Vector.mult(this.scale, this.#spriteSize)
  }

  lastSprite() {
    return Vector.add(this.firstSprite, Vector.matrix_mult(Vector.mult(this.framesCount, this.#spriteSize), this.spriteDirection))
  }

  generateKeyFrames() {
    return {
      "0%": {
        backgroundPosition: `-${this.firstSprite.x}px -${this.firstSprite.y}px`
      },
      "100%": {
        backgroundPosition: `-${this.lastSprite().x}px -${this.lastSprite().y}px`
      }
    };
  }

  toContainerCss() {
    return {
      width: "0px"
    }
  }

  toCss() {
    return {
      width: this.#spriteSize.x,
      height: this.#spriteSize.y,
      background: `url('${this.imageSrc}')`,
      backgroundPosition: `-${this.firstSprite.x}px -${this.firstSprite.y}px`,
      animation: `${this.id} ${this.animationTime/1000}s steps(${this.framesCount}) infinite`,
      transformOrigin: "0px 0px",
      transform: `scale(${this.scale})`,
    }
  }
}

export default Sprite;
