import * as tf from '@tensorflow/tfjs-node';
import { Vector } from './Vector';
import { sum } from './util';
/**
 * @description a matrix class that uses tensorflow tensors to represent matrices
 * @export  Matrix
 * @class Matrix
 * @property {tf.Tensor} elements - the elements of the matrix
 */
export class Matrix {
    elements;
    shape;
    properties;
    /**
     * @description creates an instance of Matrix.
     * @param elements
     */
    constructor(elements) {
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
     * @description returns sum of two matrices
     * @param matrix
     * @returns sum of two matrices
     */
    add(matrix) {
        return new Matrix(this.elements.add(matrix.elements));
    }
    /**
     * @description returns the difference of two matrices
     * @param matrix
     * @returns the difference of two matrices
    */
    subtract(matrix) {
        return new Matrix(this.elements.sub(matrix.elements));
    }
    /**
     * @description returns the matrix scaled by the scalar passed in as an argument
     * @param scalar
     * @returns the matrix scaled by the scalar passed in as an argument
     */
    scaleBy(scalar) {
        return new Matrix(this.elements.mul(scalar));
    }
    /**
     * @description returns the matrix
     * @param matrix
     * @returns the matrix
     */
    multiply(matrix) {
        return new Matrix(this.elements.matMul(matrix.elements));
    }
    /**
     * @description returns the transpose of the matrix
     * @returns the transpose of the matrix
     */
    transpose() {
        return new Matrix(this.elements.transpose());
    }
    determinant() {
        const rowLength = this.rows().length;
        if (rowLength !== this.rows(0).length) {
            throw new Error('Only matrices with the same number of rows and columns are supported.');
        }
        if (rowLength === 1) {
            return this.rows(0, 0);
        }
        else if (rowLength === 2) {
            return (this.rows(0, 0) * this.rows(1, 1) - this.rows(0, 1) * this.rows(1, 0));
        }
        const parts = this.rows(0).map((coef, index) => {
            const matrixRows = this.rows().slice(1).map(row => [...row.slice(0, index), ...row.slice(index + 1)]);
            const matrix = new Matrix(matrixRows);
            const result = coef * matrix.determinant();
            return index % 2 === 0 ? result : -result;
        });
        return sum(parts);
    }
    /**
     * @description returns the matrix
     * @returns the matrix
     */
    get() {
        return this.rows();
    }
}
