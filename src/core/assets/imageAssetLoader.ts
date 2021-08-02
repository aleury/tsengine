import IAsset from "./IAsset";
import IAssetLoader from "./IAssetLoader";
import AssetManager from "./assetManager";

/**
 * ImageAsset represents a image.
 */
export class ImageAsset implements IAsset {
  public readonly name: string;
  public readonly data: HTMLImageElement;

  /**
   * Create an image asset.
   * @param name The name of the image asset.
   * @param data The data of the image asset.
   */
  public constructor(name: string, data: HTMLImageElement) {
    this.name = name;
    this.data = data;
  }

  /**
   * Get the image width.
   */
  public get width(): number {
    return this.data.width;
  }

  /**
   * Get the image height.
   */
  public get height(): number {
    return this.data.height;
  }
}

/**
 * ImageAssetLoader loads an image.
 * Supported extensions are png, gif, and jpg.
 */
class ImageAssetLoader implements IAssetLoader {
  /**
   * Get the supported extensions.
   */
  public get supportedExtensions(): string[] {
    return ["png", "gif", "jpg"];
  }

  /**
   * Load an image asset.
   * @param name Name of the asset.
   */
  public loadAsset(name: string): void {
    const image: HTMLImageElement = new Image();
    image.onload = this.onImageLoaded.bind(this, name, image);
    image.src = name;
  }

  private onImageLoaded(assetName: string, image: HTMLImageElement): void {
    console.log(`onImageLoaded: assetName/image`, assetName, image);
    AssetManager.onAssetLoaded(new ImageAsset(assetName, image));
  }
}

export default ImageAssetLoader;
