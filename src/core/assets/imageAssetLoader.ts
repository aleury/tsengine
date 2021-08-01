import AssetManager from "./assetManager";
import IAsset from "./IAsset";
import IAssetLoader from "./IAssetLoader";

class ImageAsset implements IAsset {
  public readonly name: string;
  public readonly data: HTMLImageElement;

  public constructor(name: string, data: HTMLImageElement) {
    this.name = name;
    this.data = data;
  }

  public get width(): number {
    return this.data.width;
  }

  public get height(): number {
    return this.data.height;
  }
}

class ImageAssetLoader implements IAssetLoader {
  public get supportedExtensions(): string[] {
    return ["png", "gif", "jpg"];
  }

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
