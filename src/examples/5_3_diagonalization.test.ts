import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from "../Matrix";
import { System } from '../System';

describe('Diagonalization',()=>{
  // describe('Example 1 A^k',()=>{
  //   it('should compute D^k easily', async ()=>{
  //     const D = new Matrix([
  //       [5,0],
  //       [0,3],
  //     ]);
  //     const DD = D.multiply(D);
  //     const D_2 = new Matrix([
  //       [5**2,0],
  //       [0,3**2],
  //     ]);
  //     expect(DD.get()).toEqual(D_2.get());
  //   });
  // });
  // describe('Example 2 A^k , using A^k = P D^k P^-1',()=>{
  //   it('should compute D^k easily', async ()=>{
  //     const A = new Matrix([
  //       [ 7,2],
  //       [-4,1],
  //     ]);
  //     const D = new Matrix([
  //       [5,0],
  //       [0,3],
  //     ]);
  //     const P = new Matrix([
  //       [ 1, 1],
  //       [-1,-2],
  //     ]);
  //     const P_inv = P.inverse as Matrix;

  //     expect(P_inv.get()).toMatchObject([ 
  //       [  2,  1 ], 
  //       [ -1, -1 ] 
  //     ]);
  //     // P D P^-1 = A
  //     expect(P.multiply(D).multiply(P_inv).get()).toMatchObject(A.get());
  //     //A^2 = P D^2 P^-1
  //     expect(A.multiply(A).get()).toMatchObject(P.multiply(D).multiply(D).multiply(P_inv).get());
  //   });
  // });
  describe('diagonalize a matrix',()=>{
    it('diagnoalize a matrix', async ()=>{
      // const A = new Matrix([ 
      //   [ 5, 0, 0, 0],
      //   [ 0, 5, 0, 0],
      //   [ 1, 4,-3, 0],
      //   [-1,-2, 0,-3]
      // ]);
      // const {P,D,P_inverse} = await A.diagonalize();
      // console.log('P');
      // P.elements.print();
      // console.log('D');
      // D.elements.print();
      // console.log('P_inverse');
      // P_inverse.elements.print();
      // expect(P.multiply(D).multiply(P_inverse).get()).toMatchObject(A.get());
    });
    it('should handle a matrix that is not diagonalizable', async ()=>{
      const A = new Matrix([ 
        [ 5, 1],
        [ 0, 5],
      ]);
      const {P,D,P_inverse,diagonalizable} = await A.diagonalize();
      console.log({P,D,P_inverse});
      expect(P).toBeUndefined();
      expect(D).toBeUndefined();
      expect(P_inverse).toBeUndefined();
      expect(diagonalizable).toBe(false);
      // expect(P.multiply(D).multiply(P_inverse).get()).toMatchObject(A.get());
    });
    // it('should diagonalize a matrix', async ()=>{
    //   const A = new Matrix([
    //     [ 1, 3, 3],
    //     [-3,-5,-3],
    //     [ 3, 3, 1],
    //   ]);
    //   const {P,D,P_inverse} = await A.diagonalize();
    //   expect(A.multiply(P).get()).toMatchObject(P.multiply(D).get());
    //   expect(A.multiply(A).get()).toMatchObject(P.multiply(D).multiply(D).multiply(P_inverse).get());
    // });
    // it('should diagonalize a matrix', async ()=>{
    //   const A = new Matrix([
    //     [ 0, -1],
    //     [ 1,  0],
    //   ]);
    //   const {P,D,P_inverse} = await A.diagonalize();
    //   console.log('P',P.get());
    //   console.log('D',D.get());
    //   console.log('P_inverse',P_inverse.get());
    // });
  });
});
//https://github.com/tensorflow/tfjs-core/pull/1675
