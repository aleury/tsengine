import IAsset from "./IAsset";

interface IAssetLoader {
  readonly supportedExtensions: string[];
  loadAsset(name: string): IAsset;
}

export default IAssetLoader;
