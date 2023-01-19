import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from './Matrix';
import { Vector } from './Vector';
export class System {
    labels;
    system;
    consistent;
    unique;
    solved;
    solution;
    constructor(system, labels) {
        this.system = system instanceof Matrix ? system : new Matrix(system);
        this.labels = labels || [];
    }
    get coefficients() {
        const [coefficentMatrix, augmentedMatrix] = tf.split(this.system.elements, [this.system.properties.columns - 1, 1], 1);
        return new Matrix(coefficentMatrix);
    }
    get augmentedColumn() {
        const [coefficentMatrix, augmentedMatrix] = tf.split(this.system.elements, [this.system.properties.columns - 1, 1], 1);
        return new Vector(augmentedMatrix.squeeze());
    }
    get labelNames() {
        const labelNames = [];
        for (let i = 0; i < this.system.properties.columns - 1; i++) {
            labelNames.push(this.labels[i] || `x_${i + 1}`);
        }
        return labelNames;
    }
    parameterizeSolution({ pivots, freeVariableColumnIndexes, basicVariableColumnIndexes, coefficients, augmentedColumn, labelNames, }) {
        const vectorSolution = {};
        const solutionCoffientMatrix = [];
        const { pivotRows, pivotColumns } = pivots.reduce((acc, pivot) => {
            const [pivotRow, pivotColumn] = pivot;
            acc.pivotRows.push(pivotRow);
            acc.pivotColumns.push(pivotColumn);
            return acc;
        }, { pivotRows: [], pivotColumns: [] });
        // console.log({pivotRows,pivotColumns})
        const solutionAugmentedVector = labelNames.map((labelName, rowIndex) => {
            // console.log({labelName,rowIndex,augmentedColumn})
            return (pivotColumns.includes(rowIndex))
                ? augmentedColumn[pivotRows[pivotColumns.indexOf(rowIndex)]]
                : 0;
        });
        const emptyRow = coefficients[0].map(() => 0);
        pivotRows.forEach((rowIndex) => {
            let solutionCoefficientRow = [].concat(emptyRow);
            solutionCoefficientRow = solutionCoefficientRow.map((value, columnIndex) => {
                let coefficientValue = coefficients[rowIndex][columnIndex];
                if (basicVariableColumnIndexes.includes(columnIndex) && coefficientValue === 1) {
                    coefficientValue = 0;
                }
                else
                    coefficientValue = (coefficientValue !== 0) ? -1 * coefficientValue : 0;
                return coefficientValue;
            });
            solutionCoffientMatrix.push(solutionCoefficientRow);
        });
        freeVariableColumnIndexes.forEach((columnIndex) => {
            let solutionCoefficientRow = [].concat(emptyRow);
            solutionCoefficientRow[columnIndex] = 1;
            solutionCoffientMatrix.splice(columnIndex, 0, solutionCoefficientRow);
        });
        const A = new Matrix(solutionCoffientMatrix);
        vectorSolution.vector = solutionAugmentedVector;
        solutionCoffientMatrix[0].forEach((columnValue, columnIndex) => {
            const solutionVector = A.column(columnIndex).get();
            if (solutionVector.every((value) => value === 0) === false) {
                vectorSolution[labelNames[columnIndex]] = solutionVector;
            }
        });
        return vectorSolution;
    }
    async solve() {
        const A = this.system.rref();
        const B = new System(A);
        const coefficients = B.coefficients;
        const augmentedColumn = B.augmentedColumn;
        const mainDiagonal = coefficients.diagonal();
        const emptyRowIndexes = [];
        coefficients.elements.unstack().forEach((row, index) => {
            if (row.sum().arraySync() === 0) {
                emptyRowIndexes.push(index);
                if (augmentedColumn.get()[index] !== 0) {
                    this.consistent = false;
                }
            }
        });
        if (this.consistent === undefined)
            this.consistent = true;
        this.unique = mainDiagonal.get().every((value) => value === 1) && mainDiagonal.get().length === coefficients.row(0).length && this.consistent;
        const pivots = coefficients.pivots;
        const basicVariableColumnIndexes = pivots.map((pivot) => pivot[1]);
        const freeVariableColumnIndexes = coefficients.row(0).reduce((result, rowValue, columnIndex) => {
            if (basicVariableColumnIndexes.includes(columnIndex) === false) {
                result.push(columnIndex);
            }
            return result;
        }, []);
        const uniqueSolutions = (this.consistent === false)
            ? {}
            : pivots.reduce((solutions, [rowIndex, columnIndex]) => {
                const labelName = this.labelNames[columnIndex];
                const coffientRowSum = coefficients.elements.slice(rowIndex, 1).sum().arraySync();
                if (coffientRowSum === 1) {
                    const solutionValue = augmentedColumn.get()[rowIndex];
                    solutions[labelName] = solutionValue;
                }
                return solutions;
            }, {});
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
        const parameterizedSolutions = (this.unique || this.consistent === false)
            ? {}
            : this.parameterizeSolution({
                pivots,
                freeVariableColumnIndexes,
                basicVariableColumnIndexes,
                coefficients: coefficients.get(),
                augmentedColumn: augmentedColumn.get(),
                labelNames: this.labelNames,
            });
        const solutions = { ...uniqueSolutions, ...parameterizedSolutions };
        const isLinearlyIndependent = (this.consistent)
            ? (this.unique && augmentedColumn.components.sum().arraySync() === 0)
                ? true
                : false
            : undefined;
        const solution = {
            coefficients,
            augmentedColumn,
            unique: this.unique,
            consistent: this.consistent,
            pivots,
            basicVariableColumnIndexes,
            freeVariableColumnIndexes,
            labelNames: this.labelNames,
            isLinearlyIndependent,
            solutions,
        };
        this.solution = solution;
        this.solved = true;
        return solution;
    }
}
