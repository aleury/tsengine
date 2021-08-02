import Shader from "./gl/shader";
import GLUtils, { gl } from "./gl/utils";
import Sprite from "./graphics/sprite";
import Matrix4x4 from "./math/matrix4x4";
import AssetManager from "./assets/assetManager";
import MessageBus from "./message/messageBus";

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
    AssetManager.initialize();

    this._canvas = GLUtils.initialize();
    gl.clearColor(0, 0, 0, 1);

    this._shader = this.loadShader();
    this._shader.use();

    // prettier-ignore
    this._projection = Matrix4x4.orthographic(0, this._canvas.width,  this._canvas.height, 0, -100.0, 100.0);

    // Load Sprites
    this._sprite = new Sprite("test", "/assets/textures/crates_study_x2.png");
    this._sprite.load();
    this._sprite.position.x = 200;
    this._sprite.position.y = 100;

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

    // prettier-ignore
    this._projection = Matrix4x4.orthographic(0, this._canvas.width,  this._canvas.height, 0, -100.0, 100.0);

    gl.viewport(0, 0, this._canvas.width, this._canvas.height);
  }

  private loop(): void {
    MessageBus.update(0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set uniforms
    const tintLocation = this._shader.getUniformLocation("u_tint");
    // gl.uniform4f(tintLocation, 1, 0.5, 0, 1); // Make the sprite orange
    gl.uniform4f(tintLocation, 1, 1, 1, 1); // white

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

    this._sprite.draw(this._shader);

    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShader(): Shader {
    const vertexSource = `
attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projection;
uniform mat4 u_model;

varying vec2 v_texCoord;

void main() {
  gl_Position = u_projection * u_model * vec4(a_position, 1.0);
  v_texCoord = a_texCoord;
}    
`;

    const fragmentSource = `
precision mediump float;

uniform vec4 u_tint;
uniform sampler2D u_diffuse;

varying vec2 v_texCoord;

void main() {
  gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
}  
`;
    return new Shader("basic", vertexSource, fragmentSource);
  }
}

export default TSEngine;
