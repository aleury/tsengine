import { gl } from "./utils";

type AttributeLocation = number;

type AttributeMap = Map<string, AttributeLocation>;

type UniformMap = Map<string, WebGLUniformLocation>;

/**
 * Represents a WebGL shader.
 */
class Shader {
  private _name: string;
  private _program: WebGLProgram;
  private _attributes: AttributeMap;
  private _uniforms: UniformMap;

  /**
   * Creates a new shader.
   * @param name The name of this shader.
   * @param vertexSource The source of the vertex shader.
   * @param fragmentSource The source of the fragment shader.
   */
  public constructor(
    name: string,
    vertexSource: string,
    fragmentSource: string
  ) {
    let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
    let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

    this._name = name;
    this._program = this.createProgram(vertexShader, fragmentShader);
    this._attributes = this.detectAttributes(this._program);
    this._uniforms = this.detectUniforms(this._program);
  }

  /**
   * Mark shader to be used.
   */
  public use(): void {
    gl.useProgram(this._program);
  }

  /**
   * The name of the shader.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Get the location of the attribute the given name.
   * @param name Name of the attribue.
   * @returns The attribute location.
   */
  public getAttributeLocation(name: string): AttributeLocation {
    if (!this._attributes.has(name)) {
      throw new Error(
        `Unable to find attribute named '${name}' in the shader named ${this._name}`
      );
    }
    return this._attributes.get(name);
  }

  /**
   * Get the location of the uniform with the given name.
   * @param name Name of the uniform.
   * @returns The uniform location.
   */
  public getUniformLocation(name: string): WebGLUniformLocation {
    if (!this._uniforms.has(name)) {
      throw new Error(
        `Unable to find uniform named '${name}' in the shader named ${this._name}`
      );
    }
    return this._uniforms.get(name);
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      throw new Error(`Error compiling shader "${this._name}": ${info}`);
    }

    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error(
        `Error linking program for shader "${this._name}": ${info}`
      );
    }

    return program;
  }

  private detectAttributes(program: WebGLProgram): AttributeMap {
    const attributes: AttributeMap = new Map();

    const attributeCount = gl.getProgramParameter(
      program,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < attributeCount; ++i) {
      let info: WebGLActiveInfo = gl.getActiveAttrib(program, i);
      if (!info) break;

      attributes.set(info.name, gl.getAttribLocation(program, info.name));
    }

    return attributes;
  }

  private detectUniforms(program: WebGLProgram): UniformMap {
    const uniforms: UniformMap = new Map();

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; ++i) {
      let info: WebGLActiveInfo = gl.getActiveUniform(program, i);
      if (!info) break;

      uniforms.set(info.name, gl.getUniformLocation(program, info.name));
    }

    return uniforms;
  }
}

export default Shader;
