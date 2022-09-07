export declare type matrix = number[][];
/**
 * Reduced Echelon Form Matrix
 * @see {https://github.com/substack/rref/blob/master/index.js}
 */
export declare function rref(A: matrix): matrix | undefined;
