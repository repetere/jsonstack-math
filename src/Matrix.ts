import { getBackend, setBackend, } from "./tensorflow_singleton";
import * as tf from '@tensorflow/tfjs-node';
import {Vector} from './Vector';

/**
 * @description a matrix class that uses tensorflow tensors to represent matrices
 * @export  Matrix
 * @class Matrix
 * @property {tf.Tensor} elements - the elements of the matrix
 */
export class Matrix{
  elements: tf.Tensor;
  /**
   * @description creates an instance of Matrix.
   * @param elements 
   */
  constructor(elements:number[][]|tf.Tensor){
    this.elements = Array.isArray(elements)
      ? tf.tensor2d(elements)
      : elements;
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
   * @description returns the matrix
   * @returns the matrix
   */
  get():number[][]{
    return this.rows() as number[][];
  }
}