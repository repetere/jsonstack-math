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
  parameterizeSolution({
    pivots,
    freeVariableColumnIndexes,
    basicVariableColumnIndexes,
    coefficients,
    augmentedColumn,
    labelNames,
  }:any){
    const vectorSolution:{[key: string]:number[]}={};
    const solutionCoffientMatrix:number[][]=[];
    const {pivotRows,pivotColumns} = pivots.reduce((acc:any,pivot:number[])=>{
      const [pivotRow,pivotColumn] = pivot;
      acc.pivotRows.push(pivotRow);
      acc.pivotColumns.push(pivotColumn);
      return acc;
    },{pivotRows:[],pivotColumns:[]});
    // console.log({pivotRows,pivotColumns})

    const solutionAugmentedVector:number[]=labelNames.map((labelName:string,rowIndex:number)=>{
      // console.log({labelName,rowIndex,augmentedColumn})
      return (pivotColumns.includes(rowIndex))
        ? augmentedColumn[pivotRows[pivotColumns.indexOf(rowIndex)]] 
        : 0;
    });

    const emptyRow = coefficients[0].map(()=>0);
    pivotRows.forEach((rowIndex:number)=>{
      let solutionCoefficientRow:number[] = [].concat(emptyRow);
      solutionCoefficientRow = solutionCoefficientRow.map((value,columnIndex)=>{
        let coefficientValue:number = coefficients[rowIndex][columnIndex];
        if(basicVariableColumnIndexes.includes(columnIndex) && coefficientValue===1){
          coefficientValue = 0;
        } else coefficientValue =(coefficientValue!==0)? -1*coefficientValue:0;
        return coefficientValue;
      }) 
      solutionCoffientMatrix.push(solutionCoefficientRow);
    });

    freeVariableColumnIndexes.forEach((columnIndex:number)=>{
      let solutionCoefficientRow:number[] = [].concat(emptyRow);
      solutionCoefficientRow[columnIndex] = 1;
      solutionCoffientMatrix.splice(columnIndex,0,solutionCoefficientRow);
    });
    const A = new Matrix(solutionCoffientMatrix);
    vectorSolution.vector = solutionAugmentedVector;
    solutionCoffientMatrix[0].forEach((columnValue,columnIndex)=>{
      const solutionVector = A.column(columnIndex).get();
      if(solutionVector.every((value)=>value===0)===false){
        vectorSolution[labelNames[columnIndex]] = solutionVector;
      }
    });
    return vectorSolution;
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
    this.unique = mainDiagonal.get().every((value)=>value===1) && mainDiagonal.get().length === (coefficients.row(0) as number[]).length && this.consistent;
    const pivots = coefficients.pivots;
    const basicVariableColumnIndexes = pivots.map((pivot)=>pivot[1]);
    const freeVariableColumnIndexes = (coefficients.row(0) as number[]).reduce((result:number[],rowValue:number,columnIndex:number)=>{
      if(basicVariableColumnIndexes.includes(columnIndex)===false){
        result.push(columnIndex);
      }
      return result;
    },[])
  
    const uniqueSolutions =(this.consistent===false)
      ? {}
      : pivots.reduce((solutions,[rowIndex,columnIndex])=>{
      const labelName = this.labelNames[columnIndex];
      const coffientRowSum = coefficients.elements.slice(rowIndex,1).sum().arraySync();
      if(coffientRowSum===1){
        const solutionValue = augmentedColumn.get()[rowIndex];
        solutions[labelName] = solutionValue;
      }
      return solutions;
    },{} as {[key:string]:number});

    // console.log(A.get(),{
    //   coefficients: coefficients.get(),
    //   augmentedColumn: augmentedColumn.get(),
    //   mainDiagonal: mainDiagonal.get(),
    //   emptyRowIndexes,
    //   unique: this.unique,
    //   consistent: this.consistent,
    //   pivots,
    //   basicVariableColumnIndexes,
    //   freeVariableColumnIndexes,
    //   labelNames: this.labelNames,
    // });
    const parameterizedSolutions = (this.unique || this.consistent===false)
      ?{}
      :this.parameterizeSolution({
        pivots,
        freeVariableColumnIndexes,
        basicVariableColumnIndexes,
        coefficients: coefficients.get(),
        augmentedColumn: augmentedColumn.get(),
        labelNames: this.labelNames,
      });
    const solutions = {...uniqueSolutions,...parameterizedSolutions};
    
    // console.log({solutions})
    this.solved = true;

    return {
      coefficients,
      augmentedColumn,
      unique: this.unique,
      consistent: this.consistent,
      pivots,
      basicVariableColumnIndexes,
      freeVariableColumnIndexes,
      labelNames: this.labelNames,
      solutions,
    }
  }
}