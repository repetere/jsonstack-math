import { getBackend, setBackend, } from "./tensorflow_singleton";
import * as tf from '@tensorflow/tfjs-node';
import {Vector} from './Vector';
import {sum} from './util';

/**
 * @description a matrix class that uses tensorflow tensors to represent matrices
 * @export  Matrix
 * @class Matrix
 * @property {tf.Tensor} elements - the elements of the matrix
 */
export class Matrix{
  elements: tf.Tensor;
  shape: number[];
  properties: {
    rows: number;
    columns: number;
  };
  /**
   * @description returns a new random matrix
   * @param input 
   * @returns a new random matrix
   */
  static empty(input:number|Matrix,inputColumns?:number):Matrix{
    return input instanceof Matrix 
      ? new Matrix(tf.randomUniform(input.elements.shape))
      : new Matrix(tf.randomUniform([input,inputColumns as number]));
  }
  /**
   * @description returns a new zero matrix
   * @param input 
   * @returns a new zero matrix
   */
  static zeros(input:number|Matrix,inputColumns?:number):Matrix{
    return input instanceof Matrix 
      ? new Matrix(tf.zerosLike(input.elements))
      : new Matrix(tf.zeros([input,inputColumns as number]));
  }
  /**
   * @description returns a new ones matrix
   * @param input 
   * @returns a new ones matrix
   */
    static ones(input:number|Matrix,inputColumns?:number):Matrix{
      return input instanceof Matrix 
        ? new Matrix(tf.onesLike(input.elements))
        : new Matrix(tf.ones([input,inputColumns as number]));
    }
  /**
   * @description creates an instance of Matrix.
   * @param elements 
   */
  constructor(elements:number[][]|tf.Tensor){
    this.elements = Array.isArray(elements)
      ? tf.tensor2d(elements)
      : elements;
    this.shape = this.elements.shape;
    this.properties = {
      rows: this.shape[0],
      columns: this.shape[1],
    };
  }
  /**
   * @description returns the rows of the matrix 
   * @param row 
   * @param column 
   * @returns the rows of the matrix 
   */
  rows(row?:number,column?:number):number[][]|number[]|number{
    if(column!==undefined && row!==undefined) return (this.elements as tf.Tensor2D).slice(row,1).arraySync()[0][column] as number;
    else if(row!==undefined) return (this.elements as tf.Tensor2D).slice(row,1).arraySync()[0] as number[];
    else return this.elements.arraySync() as number[][];
  }
  /**
   * @description returns the column of the matrix
   * @param column 
   * @returns the column of the matrix 
   */
  column(column:number):Vector{
    return new Vector(this.elements.transpose().unstack()[column]);
  }
  /**
   * @description returns a transformed matrix
   * @param matrix 
   * @returns a transformed matrix
   */
  transform(matrix:Matrix):Matrix{
    return new Matrix(this.elements.matMul(matrix.elements));
  }
  /**
   * @description returns sum of two matrices
   * @param matrix 
   * @returns sum of two matrices 
   */
  add(matrix:Matrix):Matrix{
    return new Matrix(this.elements.add(matrix.elements));
  }
  /**
   * @description returns the difference of two matrices
   * @param matrix
   * @returns the difference of two matrices
  */
  subtract(matrix:Matrix):Matrix{
    return new Matrix(this.elements.sub(matrix.elements));
  }
  /**
   * @description returns the matrix scaled by the scalar passed in as an argument
   * @param scalar 
   * @returns the matrix scaled by the scalar passed in as an argument
   */
  scaleBy(scalar:number):Matrix{
    return new Matrix(this.elements.mul(scalar));
  }
  /**
   * @description returns the matrix
   * @param matrix 
   * @returns the matrix
   */
  multiply(matrix:Matrix):Matrix{
    return new Matrix(this.elements.matMul(matrix.elements));
  }
  /**
   * @description returns the transpose of the matrix 
   * @returns the transpose of the matrix
   */
  transpose():Matrix{
    return new Matrix(this.elements.transpose());
  }
  determinant():number{
    const rowLength = (this.rows() as number[][]).length;
    if (rowLength !== (this.rows(0) as number[]).length) {
      throw new Error('Only matrices with the same number of rows and columns are supported.')
    }
    if (rowLength === 1) {
      return this.rows(0,0) as number;
    } else if (rowLength === 2) {
      return ((this.rows(0,0) as number) * (this.rows(1,1) as number) - (this.rows(0,1) as number) * (this.rows(1,0) as number)) as number;
    }

    const parts = (this.rows(0) as number[]).map((coef, index) => {
      const matrixRows = (this.rows() as number[][]).slice(1).map(row => [ ...row.slice(0, index), ...row.slice(index + 1)])
      const matrix = new Matrix(matrixRows)
      const result = coef * matrix.determinant()
      return index % 2 === 0 ? result : -result
    })

    return sum(parts);
  }
  /**
   * @description returns the matrix
   * @returns the matrix
   */
  get():number[][]{
    return this.rows() as number[][];
  }
}