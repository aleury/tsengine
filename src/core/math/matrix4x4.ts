import Vector3 from "./vector3"

class Matrix4x4 {
  private _data: number[] = []

  private constructor(data: number[]) {
    this._data = data
  }

  public get data(): number[] {
    return this._data
  }

  public static identity(): Matrix4x4 {
    return new Matrix4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4x4 {
    const lr: number = 1.0 / (left - right)
    const bt: number = 1.0 / (bottom - top)
    const nf: number = 1.0 / (near - far)

    return new Matrix4x4([
      -2.0*lr, 0, 0, 0,
      0, -2.0*bt, 0, 0,
      0, 0, 2.0*nf, 0,
      (right+left)*lr, (top+bottom)*bt, (far+near)*nf, 1,
    ])
  }

  public static translation(p: Vector3): Matrix4x4 {
    return new Matrix4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      p.x, p.y, p.z, 1,
    ])
  }
}

export default Matrix4x4

