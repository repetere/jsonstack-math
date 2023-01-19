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
        reduced: boolean;
    };
    /**
     * @description returns a new random matrix
     * @param input
     * @returns a new random matrix
     */
    static empty(input: number | Matrix, inputColumns?: number): Matrix;
    /**
     * @description returns a new zero matrix
     * @param input
     * @returns a new zero matrix
     */
    static zeros(input: number | Matrix, inputColumns?: number): Matrix;
    /**
     * @description returns a new ones matrix
     * @param input
     * @returns a new ones matrix
     */
    static ones(input: number | Matrix, inputColumns?: number): Matrix;
    /**
     * @description returns a new identity matrix
     * @param size
     * @returns a new identity matrix
    */
    static identity(size: number): Matrix;
    /**
     * @description creates an instance of Matrix.
     * @param elements
     */
    constructor(elements: number[][] | tf.Tensor, options?: {
        reduced?: boolean;
    });
    get rows(): number;
    get columns(): number;
    /**
     * @description returns the rows of the matrix
     * @param row
     * @param column
     * @returns the rows of the matrix
     */
    row(row?: number, column?: number): number[][] | number[] | number;
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
    /**
     * @description returns the inverse of the matrix
     * @returns the determinant of the matrix
     */
    determinant(): number;
    /**
     * @description returns the main diagonal of the matrix
     * @returns the main diagonal of the matrix
     */
    diagonal(): Vector;
    /**
     * @description returns the trace of the matrix
     * @returns the trace of the matrix
    */
    trace(): number;
    /**
     * @description returns the row reduced echelon form of the matrix
     * @returns the rref of the matrix
     */
    rref(): Matrix;
    /**
     * @description augments a matrix with a vector or matrix
     * @param augmentedColumns  the vector or matrix to augment the matrix with
     * @returns the augmented matrix
    */
    augment(augmentedColumns: Vector | Matrix): Matrix;
    /**
     * @description returns the eigenvalues of the matrix
     * @returns the eigenvalues of the matrix
     */
    eigenvalues(options?: {
        iterations?: number;
        rounded?: boolean;
        unique?: boolean;
    }): Promise<Vector>;
    /**
     * @description returns the eigenvectors of the matrix
     * @param options
     * @returns the eigenvectors of the matrix
     */
    eigenvectors(options?: {
        iterations?: number;
        rounded?: boolean;
    }): Promise<any>;
    /**
     * @description returns the pivot positions of the matrix
     * @returns the pivot positions of the matrix
     */
    get pivots(): number[][];
    /**
     * @description returns the inverse of the matrix
     * @returns the inverse of the matrix
     */
    get inverse(): Matrix | undefined;
    /**
     * @description returns the matrix
     * @returns the matrix
     */
    get(): number[][];
}
