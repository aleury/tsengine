import IAsset from "./IAsset";
import IAssetLoader from "./IAssetLoader";

class AssetManager {
  private static _loaders: IAssetLoader[] = [];
  private static _loadedAssets: Map<string, IAsset> = new Map<string, IAsset>();

  private constructor() {}

  public static initialize(): void {}

  public static registerLoader(loader: IAssetLoader): void {
    AssetManager._loaders.push(loader);
  }

  public static loadAsset(name: string): void {}

  public static isAssetLoaded(name: string): boolean {
    return AssetManager._loadedAssets.has(name);
  }

  public static getAsset(name: string): IAsset {
    if (!AssetManager.isAssetLoaded(name)) {
      AssetManager.loadAsset(name);
    }

    return AssetManager._loadedAssets.get(name);
  }
}

export default AssetManager;
