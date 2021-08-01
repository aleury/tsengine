import IAsset from "./IAsset";

interface IAssetLoader {
  readonly supportedExtensions: string[];
  loadAsset(name: string): void;
}

export default IAssetLoader;
