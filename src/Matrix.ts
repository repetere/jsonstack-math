import { getBackend, setBackend, } from "./tensorflow_singleton";
import * as tf from '@tensorflow/tfjs-node';
import {Vector} from './Vector';
import {System} from './System';
import {sum,EPSILON, areEqual} from './util';

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
    reduced: boolean;
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
   * @description returns a new identity matrix
   * @param size 
   * @returns a new identity matrix
  */
  static identity(size:number):Matrix{
    return new Matrix(tf.eye(size));
  }
  /**
   * @description creates an instance of Matrix.
   * @param elements 
   */
  constructor(elements:number[][]|tf.Tensor,options?:{reduced?:boolean}){
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
  get rows():number{
    return this.properties.rows;
  } 
  get columns():number{
    return this.properties.columns;
  }
  /**
   * @description returns the rows of the matrix 
   * @param row 
   * @param column 
   * @returns the rows of the matrix 
   */
  row(row?:number,column?:number):number[][]|number[]|number{
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
  /**
   * @description returns the inverse of the matrix
   * @returns the determinant of the matrix
   */
  determinant():number{
    const rowLength = (this.row() as number[][]).length;
    if (rowLength !== (this.row(0) as number[]).length) {
      throw new Error('Only matrices with the same number of rows and columns are supported.')
    }
    if (rowLength === 1) {
      return this.row(0,0) as number;
    } else if (rowLength === 2) {
      return ((this.row(0,0) as number) * (this.row(1,1) as number) - (this.row(0,1) as number) * (this.row(1,0) as number)) as number;
    }

    const parts = (this.row(0) as number[]).map((coef, index) => {
      const matrixRows = (this.row() as number[][]).slice(1).map(row => [ ...row.slice(0, index), ...row.slice(index + 1)])
      const matrix = new Matrix(matrixRows)
      const result = coef * matrix.determinant()
      return index % 2 === 0 ? result : -result
    })

    return sum(parts);
  }
  /**
   * @description returns the main diagonal of the matrix
   * @returns the main diagonal of the matrix
   */
  diagonal():Vector{
    const diagonalTensor = tf.tidy(() => {     
      const [rows,columns] = this.elements.shape;
      const diagonalTensors:tf.Tensor[] = [];
      tf.unstack(this.elements).forEach((tensor,i) => {
        if(i<columns) diagonalTensors.push( tensor.slice([i],[1]));
      });
      return tf.concat(diagonalTensors);
   });
   return new Vector(diagonalTensor);
  }
  /** 
   * @description returns the trace of the matrix
   * @returns the trace of the matrix
  */
  trace():number{
    return this.diagonal().components.sum().dataSync()[0];
  }
  /**
   * @description returns the row reduced echelon form of the matrix
   * @returns the rref of the matrix
   */
  rref():Matrix{
    if(this.properties.reduced) return this;
    const A = this.get();
    const {rows,columns} = this.properties;
    if(rows<1||columns<1) return this;
    let lead = 0;
    for (let k = 0; k < rows; k++) {
      if (columns <= lead) return new Matrix(A,{reduced:true});

      let i = k;
      while (A[i][lead] === 0) {
        i++;
        if (rows === i) {
            i = k;
            lead++;
            if (columns === lead) return new Matrix(A,{reduced:true});
        }
      }
      let irow = A[i]; 
      let krow = A[k];
      A[i] = krow;
      A[k] = irow;
      
      let val = A[k][lead];
      for (let j = 0; j < columns; j++) {
        if(areEqual(val,0) ===false) A[k][j] /= val; 
        else A[k][j] = 0;
        
        if(A[k][j]=== -0) A[k][j] = 0;
      }
      
      for (let i = 0; i < rows; i++) {
        if (i === k) continue;
        val = A[i][lead];
        for (let j = 0; j < columns; j++) {
          A[i][j] -= val * A[k][j];
          if(A[i][j]=== -0) A[i][j] = 0;
        }
      }
      lead++;
    }
    return new Matrix(A,{reduced:true});
  }
  /**
   * @description augments a matrix with a vector or matrix
   * @param augmentedColumns  the vector or matrix to augment the matrix with
   * @returns the augmented matrix
  */
  augment(augmentedColumns:Vector|Matrix):Matrix{
    if(augmentedColumns instanceof Vector){
      return new Matrix(this.elements.concat(augmentedColumns.components.expandDims(1),1));
    }
    return new Matrix(this.elements.concat(augmentedColumns.elements,1));
  }
  /**
   * @description returns the eigenvalues of the matrix
   * @returns the eigenvalues of the matrix
   */
  async eigenvalues(options:{iterations?:number; rounded?:boolean; unique?:boolean}={iterations:1000,rounded:false, unique:false}):Promise<Vector>{
    const A = tf.tidy(() => {
      let [Q,R] = tf.linalg.qr(this.elements);
      for(let i = 0; i < (options?.iterations||1000); i++){
        [Q,R] = tf.linalg.qr(R.matMul(Q));
      }
      return R.matMul(Q);
    });
    const eigenvalueDiagonal = (options?.rounded) ? new Matrix(A.round()).diagonal():new Matrix(A).diagonal();
    if(options?.unique) return new Vector(tf.unique(eigenvalueDiagonal.components).values);
    return eigenvalueDiagonal;
  }
  /**
   * @description returns the eigenvectors of the matrix
   * @param options 
   * @returns the eigenvectors of the matrix
   */
  async eigenvectors(options:{iterations?:number; rounded?:boolean}={iterations:1000,rounded:false}):Promise<any>{
    const eigenvalues = await this.eigenvalues({...options,unique:true});
    const eigenvectors = await Promise.all(eigenvalues.get().map(async(eigenvalue:number)=>{
      const A = this.elements.sub(tf.scalar(eigenvalue).mul(tf.eye(this.rows)));
      // console.log({eigenvalue})
      const[rows,columns] = A.shape;
      const B = new Matrix(A).augment(Vector.zeros(rows))
      const augmentedSystem = new System(B);
      const solution = await augmentedSystem.solve();
      return {
        eigenvalue,
        eigenvectors:solution.solutions
      }
    }));
    return eigenvectors.map(({eigenvalue,eigenvectors}) => {
      const {vector,...vectors} = eigenvectors;
      const evs:number[][] = Object.values(vectors) as number[][];
      return {
        eigenvalue,
        eigenvectors:evs.map((ev:number[])=>new Vector(ev)),
        multiplicity:evs.length
      }
    });
  }
  /**
   * @description returns the pivot positions of the matrix
   * @returns the pivot positions of the matrix
   */
  get pivots():number[][]{
    // then i,j is a pivot
    const pivots = [];
    const {rows,columns} = this.properties;
    for(let i = 0; i < rows; i++){   
      for(let j = 0; j < columns; j++){
        if(this.row(i,j) === 1){ 
          if(
            (this.row(i) as number[])
              .slice(0,j)
              .every(value => value === 0) // and all values in the row to the left of i,j are 0
            && 
            this.column(j)
              .get()
              .slice(i+1)
              .every(value => value === 0) // and all values in the column below i,j are 0
            ){
            pivots.push([i,j]);
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
  get inverse():Matrix|undefined{
    const {rows,columns} = this.properties;
    if(rows !== columns) throw new Error('Only square matrices have an inverse');
    if(this.determinant() === 0) return undefined;
    const augmentedMatrix = this.augment(Matrix.identity(rows));
    const rref = augmentedMatrix.rref();
    const inverseRows:tf.Tensor[] = [];
    rref.elements.transpose().unstack().forEach((tensor,i) => {
      if(i >= columns) inverseRows.push(tensor);
    });
    const inverseTensor = (rows===2) ? tf.stack(inverseRows).transpose() : tf.stack(inverseRows);
    return new Matrix(inverseTensor);
    // const inverse = rref.column(columns,columns);
    // return inverse;
  }
  /**
   * @description returns the matrix
   * @returns the matrix
   */
  get():number[][]{
    return this.row() as number[][];
  }
}