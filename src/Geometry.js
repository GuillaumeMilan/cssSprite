class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toCssMarginTopLeft() {
    return {marginTop: this.y, marginLeft: this.x};
  }

  toCssMarginTopRight() {
    return {marginTop: this.y, marginRight: this.x};
  }

  toCssMarginBottomLeft() {
    return {marginBottom: this.y, marginLeft: this.x};
  }

  toCssMarginBottomRight() {
    return {marginBottom: this.y, marginRight: this.x};
  }
}

export default Point;
