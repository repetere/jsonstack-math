import { getBackend, setBackend, } from "./tensorflow_singleton";
import * as tf from '@tensorflow/tfjs-node';
import {Matrix} from './Matrix';
import {Vector} from './Vector';

export class System{
  labels: string[];
  system: Matrix;
  consistent?: boolean;
  unique?: boolean;
  solved?: boolean;
  constructor(system:Matrix|number[][],labels?:string[]){
    this.system = system instanceof Matrix ? system : new Matrix(system);
    this.labels = labels || [];
  }
  get coefficients():Matrix{
    const [coefficentMatrix, augmentedMatrix] = tf.split(this.system.elements,[this.system.properties.columns-1,1],1);
    return new Matrix(coefficentMatrix);
  }
  get augmentedColumn():Vector{
    const [coefficentMatrix, augmentedMatrix] = tf.split(this.system.elements,[this.system.properties.columns-1,1],1);
    return new Vector(augmentedMatrix.squeeze());
  }
  get labelNames():string[]{
    const labelNames=[];
    for(let i=0;i<this.system.properties.columns-1;i++){
      labelNames.push(this.labels[i] || `x_${i+1}`);
    }
    return labelNames;
  }
  async solve(){
    const A = this.system.rref();
    const B = new System(A);
    const coefficients = B.coefficients;
    const augmentedColumn = B.augmentedColumn;
    const mainDiagonal = coefficients.diagonal();
    const emptyRowIndexes:number[] =[];
    coefficients.elements.unstack().forEach((row,index)=>{
      if(row.sum().arraySync()===0){
        emptyRowIndexes.push(index);
        if(augmentedColumn.get()[index]!==0){
          this.consistent = false;
        }
      }
    });
    if(this.consistent===undefined) this.consistent = true;
    this.unique = mainDiagonal.get().every((value)=>value===1) && mainDiagonal.get().length === augmentedColumn.get().length;
    const pivots = coefficients.pivots;
    const basicVariableColumnIndexes = pivots.map((pivot)=>pivot[1]);
    const freeVariableColumnIndexes = (coefficients.row(0) as number[]).filter((rowValue,columnIndex)=>basicVariableColumnIndexes.includes(columnIndex)===false).map((rowValue,columnIndex)=>columnIndex);

    console.log(A.get(),{
      coefficients: coefficients.get(),
      augmentedColumn: augmentedColumn.get(),
      mainDiagonal: mainDiagonal.get(),
      emptyRowIndexes,
      unique: this.unique,
      consistent: this.consistent,
      pivots,
      basicVariableColumnIndexes,
      freeVariableColumnIndexes,
      labelNames: this.labelNames,
    });
    this.solved = true;
  }
}