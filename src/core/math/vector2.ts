/**
 * Represents a 2-dimensional vector.
 */
class Vector2 {
  private _x: number;
  private _y: number;

  /**
   * Creates a Vector2.
   * @param x The x coordinate.
   * @param y The y coordinate.
   */
  public constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  /**
   * Get the x coordinate.
   */
  public get x(): number {
    return this._x;
  }

  /**
   * Set the x coordinate.
   */
  public set x(value: number) {
    this._x = value;
  }

  /**
   * Get the y coordinate.
   */
  public get y(): number {
    return this._y;
  }

  /**
   * Set the y coordinate.
   */
  public set y(value: number) {
    this._y = value;
  }

  /**
   * Convert the vector into an array.
   * @returns An array with vector components as elements.
   */
  public toArray(): number[] {
    return [this._x, this._y];
  }

  /**
   * Convert the vector into a Float32Array.
   * @returns A Float32Array with vector components as data.
   */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray());
  }
}

export default Vector2;
