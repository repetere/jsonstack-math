import { Matrix } from './Matrix';
import { Vector } from './Vector';
export declare class System {
    labels: string[];
    system: Matrix;
    consistent?: boolean;
    unique?: boolean;
    solved?: boolean;
    solution?: any;
    constructor(system: Matrix | number[][], labels?: string[]);
    get coefficients(): Matrix;
    get augmentedColumn(): Vector;
    get labelNames(): string[];
    parameterizeSolution({ pivots, freeVariableColumnIndexes, basicVariableColumnIndexes, coefficients, augmentedColumn, labelNames, }: any): {
        [key: string]: number[];
    };
    solve(): Promise<{
        coefficients: Matrix;
        augmentedColumn: Vector;
        unique: boolean;
        consistent: boolean;
        pivots: number[][];
        basicVariableColumnIndexes: number[];
        freeVariableColumnIndexes: number[];
        labelNames: string[];
        isLinearlyIndependent: boolean | undefined;
        solutions: {
            [x: string]: number | number[];
        };
    }>;
}
