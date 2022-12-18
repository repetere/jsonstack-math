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
     * @description returns the matrix
     * @returns the matrix
     */
    get(): number[][];
}
