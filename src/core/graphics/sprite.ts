import Texture from "./texture";
import TextureManager from "./textureManager";
import Vector3 from "../math/vector3";
import Shader from "../gl/shader";
import GLBuffer, { AttributeInfo } from "../gl/buffer";
import { gl } from "../gl/utils";

class Sprite {
  private _name: string;
  private _width: number;
  private _height: number;

  private _buffer: GLBuffer;
  private _texture: Texture;

  public position: Vector3 = new Vector3();

  public constructor(
    name: string,
    textureName: string,
    width: number = 100,
    height: number = 100
  ) {
    this._name = name;
    this._width = width;
    this._height = height;
    this._texture = TextureManager.getTexture(textureName);
  }

  public get name(): string {
    return this._name;
  }

  public load(): void {
    this._buffer = new GLBuffer(5);

    let positionAttr = new AttributeInfo();
    positionAttr.size = 3;
    positionAttr.offset = 0;
    positionAttr.location = 0;
    this._buffer.addAttribute(positionAttr);

    let texCoordAttr = new AttributeInfo();
    texCoordAttr.size = 2;
    texCoordAttr.offset = 3;
    texCoordAttr.location = 1;
    this._buffer.addAttribute(texCoordAttr);

    // prettier-ignore
    const vertices = [
      // x, y, z, u, v
      0, 0, 0, 0, 0,
      0, this._height, 0, 0, 1.0,
      this._width, this._height, 0, 1.0, 1.0,

      this._width, this._height, 0, 1.0, 1.0,
      this._width, 0, 0, 1.0, 0,
      0, 0, 0, 0, 0
    ]
    this._buffer.pushBackData(vertices);
    this._buffer.upload();
    this._buffer.unbind();
  }

  public destroy(): void {
    this._buffer.destroy();
    TextureManager.releaseTexture(this._texture.name);
  }

  public update(time: number): void {}

  public draw(shader: Shader): void {
    this._texture.activateAndBind(0);
    const diffuseLocation = shader.getUniformLocation("u_diffuse");
    gl.uniform1i(diffuseLocation, 0);

    this._buffer.bind();
    this._buffer.draw();
  }
}

export default Sprite;
