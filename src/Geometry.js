/*
 * Kind of use less but may be use full in the future
 * TODO Matrix and other stuffs + definition of classical matrix (identity, ...)
 */

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static add(v1, v2) {
    return new Vector(v1.x+v2.x, v1.y+v2.y)
  }

  static mult(value, vector) {
    return new Vector(value*vector.x, value*vector.y)
  }

  /* This method is a replacement for matrix comming in the future */
  static matrix_mult(v1,v2) {
    return new Vector(v1.x*v2.x, v1.y*v2.y)
  }
}

export default Vector;
