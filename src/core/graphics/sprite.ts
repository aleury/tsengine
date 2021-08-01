import GLBuffer, { AttributeInfo } from "../gl/buffer";
import Vector3 from "../math/vector3";

class Sprite {
  private _name: string;
  private _width: number;
  private _height: number;

  private _buffer: GLBuffer;

  public position: Vector3 = new Vector3();

  public constructor(name: string, width: number = 100, height: number = 100) {
    this._name = name;
    this._width = width;
    this._height = height;
  }

  public load(): void {
    this._buffer = new GLBuffer(3);

    let positionAttr = new AttributeInfo();
    positionAttr.size = 3;
    positionAttr.offset = 0;
    positionAttr.location = 0;
    this._buffer.addAttribute(positionAttr);

    // prettier-ignore
    const vertices = [
      // x, y, z
      0, 0, 0,
      0, this._height, 0,
      this._width, this._height, 0,

      this._width, this._height, 0,
      this._width, 0, 0,
      0, 0, 0,
    ]
    this._buffer.pushBackData(vertices);
    this._buffer.upload();
    this._buffer.unbind();
  }

  public update(time: number): void {}

  public draw(): void {
    this._buffer.bind();
    this._buffer.draw();
  }
}

export default Sprite;
