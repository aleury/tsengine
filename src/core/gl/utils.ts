/**
 * The WebGL rendering context
 */
export var gl: WebGLRenderingContext;

/**
 * Responsible for setting up a WebGL rendering context.
 */
export default class GLUtils {
  /**
   * Initializes WebGL.
   * @param elementId The id of an existing canvas element.
   */
  public static initialize(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;

    if (elementId !== undefined) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement;
      if (canvas === undefined) {
        throw new Error(`Cannot find a canvas element with id ${elementId}`);
      }
    } else {
      canvas = document.createElement("canvas") as HTMLCanvasElement;
      document.body.appendChild(canvas);
    }

    gl = canvas.getContext("webgl");
    if (gl === undefined) {
      throw new Error("Unable to initialize WebGL");
    }

    return canvas;
  }
}
