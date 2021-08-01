import Shader from "./gl/shader";
import GLUtils, { gl } from "./gl/utils";
import Sprite from "./graphics/sprite";
import Matrix4x4 from "./math/matrix4x4";

class TSEngine {
  private _canvas: HTMLCanvasElement;
  private _shader: Shader;

  private _sprite: Sprite;
  private _projection: Matrix4x4;

  /**
   * Creates a new engine.
   */
  public constructor() {}

  /**
   * Starts the engine loop.
   */
  public start(): void {
    this._canvas = GLUtils.initialize();
    gl.clearColor(0, 0, 0, 1);

    this._shader = this.loadShader();
    this._shader.use();

    // Load Sprites
    this._sprite = new Sprite("test");
    this._sprite.load();
    this._sprite.position.x = 100;

    // prettier-ignore
    this._projection = Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100.0, 100.0);

    this.resize();
    this.loop();
  }

  /**
   * Resizes the canvas to fit the window.
   */
  public resize(): void {
    if (this._canvas === undefined) return;

    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;

    gl.viewport(-1, 1, -1, 1);
  }

  private loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set uniforms
    const colorLocation = this._shader.getUniformLocation("u_color");
    gl.uniform4f(colorLocation, 1, 0.5, 0, 1); // Make the sprite orange

    const projectionLocation = this._shader.getUniformLocation("u_projection");
    gl.uniformMatrix4fv(
      projectionLocation,
      false,
      new Float32Array(this._projection.data)
    );

    const modelLocation = this._shader.getUniformLocation("u_model");
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Matrix4x4.translation(this._sprite.position).data)
    );

    this._sprite.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShader(): Shader {
    const vertexSource = `
attribute vec3 a_position;

uniform mat4 u_projection;
uniform mat4 u_model;

void main() {
  gl_Position = u_projection * u_model * vec4(a_position, 1.0);
}    
`;

    const fragmentSource = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}  
`;
    return new Shader("basic", vertexSource, fragmentSource);
  }
}

export default TSEngine;
