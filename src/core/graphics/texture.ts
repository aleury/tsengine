import { gl } from "../gl/utils";
import Message from "../message/message";
import IMessageHandler from "../message/IMessageHander";
import AssetManager from "../assets/assetManager";
import { ImageAsset } from "../assets/imageAssetLoader";

const LEVEL: number = 0;
const BORDER: number = 0;

// One white pixel in rgba format.
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]);

/**
 * Represents a texture.
 */
class Texture implements IMessageHandler {
  private _name: string;
  private _width: number;
  private _height: number;
  private _messageCode: string;
  private _handle: WebGLTexture;
  private _isLoaded: boolean = false;

  /**
   * Create a texture.
   * @param name The texture name.
   * @param width The texture width. Default: 1
   * @param height The texture height. Default: 1
   */
  public constructor(name: string, width: number = 1, height: number = 1) {
    this._name = name;
    this._width = width;
    this._height = height;
    this._handle = gl.createTexture();
    this._messageCode = AssetManager.onAssetLoadedMessageCode(this._name);

    Message.subscribe(this._messageCode, this);

    this.bind();

    // prettier-ignore
    gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

    const asset = AssetManager.getAsset(this._name) as ImageAsset;
    if (asset !== undefined) {
      this.loadTextureFromAsset(asset);
    }
  }

  /**
   * Get the texture name.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Get the texture width.
   */
  public get width(): number {
    return this._width;
  }

  /**
   * Get the texture height.
   */
  public get height(): number {
    return this._height;
  }

  /**
   * Check if the texture is loaded.
   */
  public get isLoaded(): boolean {
    return this._isLoaded;
  }

  /**
   * Destroy the texture.
   */
  public destroy(): void {
    gl.deleteTexture(this._handle);
  }

  /**
   * Activate and bind the texture on the WebGL rendering context.
   * @param textureUnit
   */
  public activateAndBind(textureUnit: number = 0): void {
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    this.bind();
  }

  /**
   * Bind the texture to WebGL rendering context.
   */
  public bind(): void {
    gl.bindTexture(gl.TEXTURE_2D, this._handle);
  }

  /**
   * Unbind the texture from the WebGL rendering context.
   */
  public unbind(): void {
    gl.bindTexture(gl.TEXTURE_2D, undefined);
  }

  /**
   * Handle a message from the MessageBus.
   * @param message A message containing the texture asset.
   */
  public onMessage(message: Message): void {
    if (message.code !== this._messageCode) return;

    this.loadTextureFromAsset(message.context as ImageAsset);
  }

  private loadTextureFromAsset(asset: ImageAsset): void {
    this._width = asset.width;
    this._handle = asset.height;

    this.bind();

    // prettier-ignore
    gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data);

    this._isLoaded = true;
  }
}

export default Texture;
