import Message from "../message/message";
import IAsset from "./IAsset";
import IAssetLoader from "./IAssetLoader";

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
  "MESSAGE_ASSET_LOADER_ASSET_LOADED";

class AssetManager {
  private static _loaders: IAssetLoader[] = [];
  private static _loadedAssets: Map<string, IAsset> = new Map<string, IAsset>();

  private constructor() {}

  public static initialize(): void {}

  public static registerLoader(loader: IAssetLoader): void {
    AssetManager._loaders.push(loader);
  }

  public static onAssetLoaded(asset: IAsset): void {
    AssetManager._loadedAssets.set(asset.name, asset);
    Message.send(
      `${MESSAGE_ASSET_LOADER_ASSET_LOADED}::${asset.name}`,
      AssetManager,
      asset
    );
  }

  public static loadAsset(name: string): void {
    const extension = name.split(".").pop().toLowerCase();

    const loader = AssetManager._loaders.find((l) =>
      l.supportedExtensions.includes(extension)
    );
    if (loader === undefined) {
      console.error(
        `Couldn't find a loader for asset extension '${extension}'.`
      );
      return;
    }

    loader.loadAsset(name);
  }

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
