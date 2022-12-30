import * as tf from '@tensorflow/tfjs-node';
import { Vector } from './Vector';
/**
 * @description a matrix class that uses tensorflow tensors to represent matrices
 * @export  Matrix
 * @class Matrix
 * @property {tf.Tensor} elements - the elements of the matrix
 */
export declare class Matrix {
    elements: tf.Tensor;
    shape: number[];
    properties: {
        rows: number;
        columns: number;
    };
    /**
     * @description creates an instance of Matrix.
     * @param elements
     */
    constructor(elements: number[][] | tf.Tensor);
    /**
     * @description returns the rows of the matrix
     * @param row
     * @param column
     * @returns the rows of the matrix
     */
    rows(row?: number, column?: number): number[][] | number[] | number;
    /**
     * @description returns the column of the matrix
     * @param column
     * @returns the column of the matrix
     */
    column(column: number): Vector;
    /**
     * @description returns a transformed matrix
     * @param matrix
     * @returns a transformed matrix
     */
    transform(matrix: Matrix): Matrix;
    /**
     * @description returns sum of two matrices
     * @param matrix
     * @returns sum of two matrices
     */
    add(matrix: Matrix): Matrix;
    /**
     * @description returns the difference of two matrices
     * @param matrix
     * @returns the difference of two matrices
    */
    subtract(matrix: Matrix): Matrix;
    /**
     * @description returns the matrix scaled by the scalar passed in as an argument
     * @param scalar
     * @returns the matrix scaled by the scalar passed in as an argument
     */
    scaleBy(scalar: number): Matrix;
    /**
     * @description returns the matrix
     * @param matrix
     * @returns the matrix
     */
    multiply(matrix: Matrix): Matrix;
    /**
     * @description returns the transpose of the matrix
     * @returns the transpose of the matrix
     */
    transpose(): Matrix;
    determinant(): number;
    /**
     * @description returns the matrix
     * @returns the matrix
     */
    get(): number[][];
}
