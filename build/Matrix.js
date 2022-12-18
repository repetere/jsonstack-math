import * as tf from '@tensorflow/tfjs-node';
import { Vector } from './Vector';
/**
 * @description a matrix class that uses tensorflow tensors to represent matrices
 * @export  Matrix
 * @class Matrix
 * @property {tf.Tensor} elements - the elements of the matrix
 */
export class Matrix {
    elements;
    /**
     * @description creates an instance of Matrix.
     * @param elements
     */
    constructor(elements) {
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
    rows(row, column) {
        if (column !== undefined && row !== undefined)
            return this.elements.slice(row, 1).arraySync()[0][column];
        else if (row !== undefined)
            return this.elements.slice(row, 1).arraySync()[0];
        else
            return this.elements.arraySync();
    }
    /**
     * @description returns the column of the matrix
     * @param column
     * @returns the column of the matrix
     */
    column(column) {
        return new Vector(this.elements.transpose().unstack()[column]);
    }
    /**
     * @description returns a transformed matrix
     * @param matrix
     * @returns a transformed matrix
     */
    transform(matrix) {
        return new Matrix(this.elements.matMul(matrix.elements));
    }
    /**
     * @description returns the matrix
     * @returns the matrix
     */
    get() {
        return this.rows();
    }
}
