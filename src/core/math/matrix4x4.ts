import Vector3 from "./vector3";

/**
 * Represents a 4-dimensional square matrix.
 */
class Matrix4x4 {
  private _data: number[] = [];

  private constructor(data: number[]) {
    this._data = data;
  }

  /**
   * Get the matrix elements as an array of numbers.
   */
  public get data(): number[] {
    return this._data;
  }

  /**
   * Create an identity matrix.
   * @returns An idenity matrix.
   */
  public static identity(): Matrix4x4 {
    // prettier-ignore
    return new Matrix4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  /**
   * Create an orthographic projection matrix.
   * @param left
   * @param right
   * @param bottom
   * @param top
   * @param near
   * @param far
   * @returns An orthographic projection matrix.
   */
  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4x4 {
    const lr: number = 1.0 / (left - right);
    const bt: number = 1.0 / (bottom - top);
    const nf: number = 1.0 / (near - far);

    // prettier-ignore
    return new Matrix4x4([
      -2.0*lr, 0, 0, 0,
      0, -2.0*bt, 0, 0,
      0, 0, 2.0*nf, 0,
      (right+left)*lr, (top+bottom)*bt, (far+near)*nf, 1,
    ])
  }

  /**
   * Creates a translation matrix.
   */
  public static translation(p: Vector3): Matrix4x4 {
    // prettier-ignore
    return new Matrix4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      p.x, p.y, p.z, 1,
    ])
  }
}

export default Matrix4x4;
