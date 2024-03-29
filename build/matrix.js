import * as tf from '@tensorflow/tfjs-node';
import { Vector } from './Vector';
import { System } from './System';
import { sum, areEqual } from './util';
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
     * @description returns a new random matrix
     * @param input
     * @returns a new random matrix
     */
    static empty(input, inputColumns) {
        return input instanceof Matrix
            ? new Matrix(tf.randomUniform(input.elements.shape))
            : new Matrix(tf.randomUniform([input, inputColumns]));
    }
    /**
     * @description returns a new zero matrix
     * @param input
     * @returns a new zero matrix
     */
    static zeros(input, inputColumns) {
        return input instanceof Matrix
            ? new Matrix(tf.zerosLike(input.elements))
            : new Matrix(tf.zeros([input, inputColumns]));
    }
    /**
     * @description returns a new ones matrix
     * @param input
     * @returns a new ones matrix
     */
    static ones(input, inputColumns) {
        return input instanceof Matrix
            ? new Matrix(tf.onesLike(input.elements))
            : new Matrix(tf.ones([input, inputColumns]));
    }
    /**
     * @description returns a new identity matrix
     * @param size
     * @returns a new identity matrix
    */
    static identity(size) {
        return new Matrix(tf.eye(size));
    }
    /**
     * @description creates an instance of Matrix.
     * @param elements
     */
    constructor(elements, options) {
        this.elements = Array.isArray(elements)
            ? tf.tensor2d(elements)
            : elements;
        this.shape = this.elements.shape;
        this.properties = {
            rows: this.shape[0],
            columns: this.shape[1],
            reduced: options?.reduced ?? false
        };
    }
    get rows() {
        return this.properties.rows;
    }
    get columns() {
        return this.properties.columns;
    }
    /**
     * @description returns the rows of the matrix
     * @param row
     * @param column
     * @returns the rows of the matrix
     */
    row(row, column) {
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
    /**
     * @description returns the inverse of the matrix
     * @returns the determinant of the matrix
     */
    determinant() {
        const rowLength = this.row().length;
        if (rowLength !== this.row(0).length) {
            throw new Error('Only matrices with the same number of rows and columns are supported.');
        }
        if (rowLength === 1) {
            return this.row(0, 0);
        }
        else if (rowLength === 2) {
            return (this.row(0, 0) * this.row(1, 1) - this.row(0, 1) * this.row(1, 0));
        }
        const parts = this.row(0).map((coef, index) => {
            const matrixRows = this.row().slice(1).map(row => [...row.slice(0, index), ...row.slice(index + 1)]);
            const matrix = new Matrix(matrixRows);
            const result = coef * matrix.determinant();
            return index % 2 === 0 ? result : -result;
        });
        return sum(parts);
    }
    /**
     * @description returns the main diagonal of the matrix
     * @returns the main diagonal of the matrix
     */
    diagonal() {
        const diagonalTensor = tf.tidy(() => {
            const [rows, columns] = this.elements.shape;
            const diagonalTensors = [];
            tf.unstack(this.elements).forEach((tensor, i) => {
                if (i < columns)
                    diagonalTensors.push(tensor.slice([i], [1]));
            });
            return tf.concat(diagonalTensors);
        });
        return new Vector(diagonalTensor);
    }
    /**
     * @description returns the trace of the matrix
     * @returns the trace of the matrix
    */
    trace() {
        return this.diagonal().components.sum().dataSync()[0];
    }
    /**
     * @description returns the row reduced echelon form of the matrix
     * @returns the rref of the matrix
     */
    rref() {
        if (this.properties.reduced)
            return this;
        const A = this.get();
        const { rows, columns } = this.properties;
        if (rows < 1 || columns < 1)
            return this;
        let lead = 0;
        for (let k = 0; k < rows; k++) {
            if (columns <= lead)
                return new Matrix(A, { reduced: true });
            let i = k;
            while (A[i][lead] === 0) {
                i++;
                if (rows === i) {
                    i = k;
                    lead++;
                    if (columns === lead)
                        return new Matrix(A, { reduced: true });
                }
            }
            let irow = A[i];
            let krow = A[k];
            A[i] = krow;
            A[k] = irow;
            let val = A[k][lead];
            for (let j = 0; j < columns; j++) {
                if (areEqual(val, 0) === false)
                    A[k][j] /= val;
                else
                    A[k][j] = 0;
                if (A[k][j] === -0)
                    A[k][j] = 0;
            }
            for (let i = 0; i < rows; i++) {
                if (i === k)
                    continue;
                val = A[i][lead];
                for (let j = 0; j < columns; j++) {
                    A[i][j] -= val * A[k][j];
                    if (A[i][j] === -0)
                        A[i][j] = 0;
                }
            }
            lead++;
        }
        return new Matrix(A, { reduced: true });
    }
    /**
     * @description augments a matrix with a vector or matrix
     * @param augmentedColumns  the vector or matrix to augment the matrix with
     * @returns the augmented matrix
    */
    augment(augmentedColumns) {
        if (augmentedColumns instanceof Vector) {
            return new Matrix(this.elements.concat(augmentedColumns.components.expandDims(1), 1));
        }
        return new Matrix(this.elements.concat(augmentedColumns.elements, 1));
    }
    /**
     * @description returns the eigenvalues of the matrix
     * @returns the eigenvalues of the matrix
     */
    async eigenvalues(options = { iterations: 1000, rounded: false, unique: false }) {
        const A = tf.tidy(() => {
            let [Q, R] = tf.linalg.qr(this.elements);
            for (let i = 0; i < (options?.iterations || 1000); i++) {
                [Q, R] = tf.linalg.qr(R.matMul(Q));
            }
            return R.matMul(Q);
        });
        const eigenvalueDiagonal = (options?.rounded) ? new Matrix(A.round()).diagonal() : new Matrix(A).diagonal();
        if (options?.unique)
            return new Vector(tf.unique(eigenvalueDiagonal.components).values);
        return eigenvalueDiagonal;
    }
    /**
     * @description returns the eigenvectors of the matrix
     * @param options
     * @returns the eigenvectors of the matrix
     */
    async eigenvectors(options = { iterations: 1000, rounded: false }) {
        const eigenvalues = await this.eigenvalues({ ...options, unique: true });
        const eigenvectors = await Promise.all(eigenvalues.get().map(async (eigenvalue) => {
            const A = this.elements.sub(tf.scalar(eigenvalue).mul(tf.eye(this.rows)));
            // console.log({eigenvalue})
            const [rows, columns] = A.shape;
            const B = new Matrix(A).augment(Vector.zeros(rows));
            const augmentedSystem = new System(B);
            const solution = await augmentedSystem.solve();
            return {
                eigenvalue,
                eigenvectors: solution.solutions
            };
        }));
        return eigenvectors.map(({ eigenvalue, eigenvectors }) => {
            const { vector, ...vectors } = eigenvectors;
            const evs = Object.values(vectors);
            const evectors = evs
                .map((ev) => ev.length
                ? new Vector(ev)
                : undefined)
                .filter((ev) => ev);
            return {
                eigenvalue,
                eigenvectors: evectors,
                multiplicity: evectors.length
            };
        });
    }
    async diagonalize(options = { iterations: 1000, rounded: true }) {
        let D = undefined;
        let P = undefined;
        let P_inverse = undefined;
        let diagonalizable = true;
        const { rows, columns } = this.properties;
        const d = Matrix.zeros(rows, columns).get();
        const p_transposed = [];
        const eigenvectors = await this.eigenvectors(options);
        const numberOfEigenvectors = eigenvectors.reduce((acc, eigenvector) => acc + eigenvector.multiplicity, 0);
        console.log({ numberOfEigenvectors, eigenvectors });
        if (numberOfEigenvectors < rows)
            return { P, D, P_inverse, diagonalizable: false };
        let e = 0;
        eigenvectors
            .sort((a, b) => b.eigenvalue - a.eigenvalue)
            .forEach((eigen) => {
            const { eigenvalue, eigenvectors, multiplicity } = eigen;
            for (let i = 0; i < multiplicity; i++) {
                d[e][e] = eigenvalue;
                const ev = eigenvectors[i].get();
                p_transposed.push(ev);
                e++;
            }
        });
        P = new Matrix(p_transposed).transpose();
        const p_rref = P.rref();
        if (p_rref.pivots.length < columns)
            return { P, D, P_inverse, diagonalizable: false };
        P_inverse = P.inverse;
        D = new Matrix(d);
        return { P, D, P_inverse, diagonalizable };
    }
    /**
     * @description returns the pivot positions of the matrix
     * @returns the pivot positions of the matrix
     */
    get pivots() {
        // then i,j is a pivot
        const pivots = [];
        const { rows, columns } = this.properties;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (this.row(i, j) === 1) {
                    if (this.row(i)
                        .slice(0, j)
                        .every(value => value === 0) // and all values in the row to the left of i,j are 0
                        &&
                            this.column(j)
                                .get()
                                .slice(i + 1)
                                .every(value => value === 0) // and all values in the column below i,j are 0
                    ) {
                        pivots.push([i, j]);
                    }
                }
            }
        }
        return pivots;
    }
    /**
     * @description returns the inverse of the matrix
     * @returns the inverse of the matrix
     */
    get inverse() {
        const { rows, columns } = this.properties;
        if (rows !== columns)
            throw new Error('Only square matrices have an inverse');
        if (this.determinant() === 0)
            return undefined;
        const augmentedMatrix = this.augment(Matrix.identity(rows));
        const rref = augmentedMatrix.rref();
        const [I, A_inv] = tf.split(rref.elements, 2, 1);
        return new Matrix(A_inv);
    }
    /**
     * @description returns the matrix
     * @returns the matrix
     */
    get() {
        return this.row();
    }
}
