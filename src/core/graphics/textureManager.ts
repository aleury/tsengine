import Texture from "./texture";

class TextureReferenceNode {
  private _texture: Texture;
  private _referenceCount: number = 1;

  public constructor(texture: Texture) {
    this._texture = texture;
  }

  public get texture(): Texture {
    return this._texture;
  }

  public get referenceCount(): number {
    return this._referenceCount;
  }

  public addReference(): void {
    this._referenceCount += 1;
  }

  public removeReference(): void {
    this._referenceCount -= 1;
  }
}

/**
 * TextureManager manages the life of a texture by a reference counting mechanism.
 * If all references to the texture are released, it wiil be removed.
 */
class TextureManager {
  private static _textures: Map<string, TextureReferenceNode> = new Map();

  private constructor() {}

  /**
   * Get the texture by the given name.
   * @param name The texture name.
   * @returns The texture.
   */
  public static getTexture(name: string): Texture {
    if (!TextureManager._textures.has(name)) {
      const texture = new Texture(name);
      TextureManager._textures.set(name, new TextureReferenceNode(texture));
      return texture;
    }

    const node = TextureManager._textures.get(name);
    node.addReference();
    return node.texture;
  }

  /**
   * Release the texture.
   * @param name The texture name
   */
  public static releaseTexture(name: string): void {
    if (!TextureManager._textures.has(name)) {
      console.warn(
        `A texture named '${name}' does not exist and therefore cannot be released.`
      );
      return;
    }

    const node = TextureManager._textures.get(name);
    node.removeReference();

    if (node.referenceCount < 1) {
      node.texture.destroy();
      TextureManager._textures.delete(name);
    }
  }
}

export default TextureManager;
