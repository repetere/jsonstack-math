import * as util from './util';

describe('util', function () { 
  // describe('rref', () => {
  //   const A1 = [
  //     [ 1, 2, -1, -4],
  //     [ 2, 3, -1,-11],
  //     [-2, 0, -3, 22]
  //   ];
  //   const A2 = [
  //     [ 2, 1, -1, 8 ],
  //     [ -3, -1, 2, -11 ],
  //     [ -2, 1, 2, -3 ]
  //   ];
  //   it('should return rref of input matrix', () => {
  //     expect(util.rref(A1)).toMatchObject([
  //       [ 1, 0, 0, -8 ],
  //       [ -0, 1, 0, 1 ],
  //       [ -0, -0, 1, -2 ]
  //     ]);
  //     expect(util.rref(A2)).toMatchObject([
  //       [ 1, 0, 0, 2 ],
  //       [ 0, 1, 0, 3 ],
  //       [ -0, -0, 1, -1 ]
  //     ]);
  //   });
    describe('areEqual', () => {
      it('should return true if two matrices are equal', () => {
        expect(util.areEqual(1, 1)).toBe(true);
        expect(util.areEqual(2, 2)).toBe(true);
      });
      it('should return false if two matrices are not equal', () => {
        expect(util.areEqual(1, 3.000000000000004)).toBe(false);
        expect(util.areEqual(2, 1)).toBe(false);
      });
    });
  });
// });