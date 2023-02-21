import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from "../Matrix";
import { Vector } from "../Vector";
import { System } from '../System';

describe('Inner Product',()=>{
  describe('u dot v',()=>{
    it('should multiply vectors', async ()=>{
      const u = new Vector([2,-5,-1]);
      const v = new Vector([3,2,-3]);
      expect(u.dotProduct(v)).toBe(-1);
    });
    it('should norm (get the length) a vector',()=>{
      const u = new Vector([1,-2,2,0]);
      expect(u.length()).toBe(3);
    });
    it('should normaize a vector',()=>{
      const u = new Vector([1,-2,2,0]);
      const u_norm = u.normalize();
      expect(u_norm.length()).toBe(1);
    });
    it('should compute the distance between two vectors',()=>{
      const u = new Vector([7,1]);
      const v = new Vector([3,2]);
      const u_minus_v = u.subtract(v);
      u_minus_v.print();
      const u_dist_v = u_minus_v.length();
      expect(u_dist_v).toBeCloseTo(Math.sqrt(17));
      // expect(u_minus_v.length()).toBe(5);
    });
  });
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
      //   [ .8,-.6, 0],
      //   [ .6, .8, 0],
      //   [  0, 0, 1.07],
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
