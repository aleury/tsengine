/**
 * Represents a 3-dimensional vector.
 */
class Vector3 {
  private _x: number;
  private _y: number;
  private _z: number;

  /**
   * Creates a Vector3.
   * @param x The x coordinate.
   * @param y The y coordinate.
   * @param z The z coordinate.
   */
  public constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
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
   * Get the z coordinate.
   */
  public get z(): number {
    return this._z;
  }

  /**
   * Set the z coordinate.
   */
  public set z(value: number) {
    this._z = value;
  }

  /**
   * Convert the vector into an array.
   * @returns An array with vector components as elements.
   */
  public toArray(): number[] {
    return [this._x, this._y, this._z];
  }

  /**
   * Convert the vector into a Float32Array.
   * @returns A Float32Array with vector components as data.
   */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray());
  }
}

export default Vector3;
