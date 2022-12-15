// export type matrix = number[][];
// /**
//  * Reduced Echelon Form Matrix
//  * @see {https://github.com/substack/rref/blob/master/index.js}
//  * @note see https://www.npmjs.com/package/nyo for future
//  */
// export function rref(A:matrix) {
//   var rows = A.length;
//   var columns = A[0].length;
//   var lead = 0;
//   for (var k = 0; k < rows; k++) {
//       if (columns <= lead) return;
//       var i = k;
//       while (A[i][lead] === 0) {
//           i++;
//           if (rows === i) {
//               i = k;
//               lead++;
//               if (columns === lead) return;
//           }
//       }
//       var irow = A[i], krow = A[k];
//       A[i] = krow, A[k] = irow;
//       var val = A[k][lead];
//       for (var j = 0; j < columns; j++) {
//           A[k][j] /= val;
//       }
//       for (var i = 0; i < rows; i++) {
//           if (i === k) continue;
//           val = A[i][lead];
//           for (var j = 0; j < columns; j++) {
//               A[i][j] -= val * A[k][j];
//           }
//       }
//       lead++;
//   }
//   return A;
// };
export const EPSILON = 1e-6;
export const areEqual = (a, b) => Math.abs(a - b) < EPSILON;
export const toDegrees = (radians) => (radians * 180) / Math.PI;
export const toRadians = (degrees) => (degrees * Math.PI) / 180;
