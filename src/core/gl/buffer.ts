import { urlToHttpOptions } from 'url';
import {gl} from './utils'

/**
 * Represents the information needed for a GLBuffer attribute.
 */
export class AttributeInfo {
  /**
   * The location of this attribute.
   */
  public location: number

  /**
   * The size (number of elements) of this attribute (i.e. Vector3 is 3).
   */
  public size: number;

  /**
   * The number of elements from the beginning of the buffer.
   */
  public offset: number;
}

/**
 * Represents a WebGL buffer.
 */
class GLBuffer {
  private _elementSize: number
  private _stride: number
  private _buffer: WebGLBuffer
  private _hasAttributes: boolean = false

  private _dataType: number
  private _targetBufferType: number
  private _mode: number
  private _typeSize: number

  private _data: number[] = []
  private _attributes: AttributeInfo[] = []

  /**
   * Create a new buffer.
   * @param elementSize Number of components of each element in the data given to the buffer.
   * @param dataType The data type in this buffer. Default: gl.FLOAT
   * @param targetBufferType The buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. Default: gl.ARRAY_BUFFER
   * @param mode The buffer drawing mode (i.e. gl.TRIANGLES or gl.LINES). Default: gl.TRIANGLES
   */
  public constructor(elementSize: number, dataType: number = gl.FLOAT, targetBufferType = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
    this._elementSize = elementSize
    this._dataType = dataType
    this._targetBufferType = targetBufferType
    this._mode = mode

    // Determine byte size
    switch (this._dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this._typeSize = 4
        break
      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        this._typeSize = 2
        break
      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        this._typeSize = 1
        break
      default:
        throw new Error(`Unrecognized data type: ${dataType}`)
    }

    this._stride = this._elementSize * this._typeSize
    this._buffer = gl.createBuffer()
  }

  /** 
   * Destroys this buffer.
   */
  public destroy(): void {
    gl.deleteBuffer(this._buffer)
  }

  /**
   * Binds the buffer to the WebGL rendering context.
   * @param normalized Indicates if the buffer data should be normalized. Default: false
   */
  public bind(normalized: boolean = false): void {
    gl.bindBuffer(this._targetBufferType, this._buffer)

    if (this._hasAttributes) {
      for (let attrib of this._attributes) {
        gl.vertexAttribPointer(
          attrib.location, 
          attrib.size, 
          this._dataType, 
          normalized, 
          this._stride, 
          attrib.offset*this._typeSize,
        )
        gl.enableVertexAttribArray(attrib.location)
      }
    }
  }

  /**
   * Unbinds the buffer from the WebGL rendering context.
   */
  public unbind(): void {
    for (let attrib of this._attributes) {
      gl.disableVertexAttribArray(attrib.location)
    }
    gl.bindBuffer(this._targetBufferType, undefined)
  }

  /**
   * Adds an attribute with the provided information to the buffer.
   * @param info The attribute information to be added.
   */
  public addAttribute(info: AttributeInfo): void {
    this._attributes.push(info)
    this._hasAttributes = true
  }

  /** 
   * Adds data to the buffer.
   */
  public pushBackData(data: number[]): void {
    for (let d of data) {
      this._data.push(d)
    }
  }

  /**
   * Uploads buffer data to the GPU.
   */
  public upload(): void {
    let bufferData: ArrayBuffer

    switch (this._dataType) {
      case gl.FLOAT:
        bufferData = new Float32Array(this._data)
        break
      case gl.INT:
        bufferData = new Int32Array(this._data)
        break
      case gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this._data)
        break
      case gl.SHORT:
        bufferData = new Int16Array(this._data)
        break
      case gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this._data)
        break
      case gl.BYTE:
        bufferData = new Int8Array(this._data)
        break
      case gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this._data)
        break
    }
    
    gl.bindBuffer(this._targetBufferType, this._buffer)
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)
  }

  /**
   * Draws the buffer.
   */
  public draw(): void {
    if (this._targetBufferType === gl.ARRAY_BUFFER) {
      gl.drawArrays(this._mode, 0, this._data.length / this._elementSize)
    } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
      gl.drawElements(this._mode, this._data.length, this._dataType, 0)
    }
  }
}


export default GLBuffer
