import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from "../../Matrix";
import { System } from '../../System';

describe('System of Linear Equations',()=>{
  describe('Linear Independence',()=>{
    // it('check if a set of vectors is linearly independent', async ()=>{
    //   const a = [
    //     [1, 2, 0],
    //     [3, 4, 0],
    //   ];
    //   const A = new System(a);
    //   const solution = await A.solve();
    //   expect(solution.isLinearlyIndependent).toBe(true);

    //   const b = [
    //     [1, 4, 2, 0],
    //     [2, 5, 1, 0],
    //     [3, 6, 0, 0],
    //   ];
    //   const B = new System(b);
    //   const solution2 = await B.solve();
    //   // console.log({solution2})
    //   expect(solution2.isLinearlyIndependent).toBe(false);
    // });
    it('solves a m x n consistent and non unique solution system',async ()=>{
      // const a = [
      //   [-3, 6,-1, 1, -7, 0],
      //   [ 1,-2, 2, 3, -1, 0],
      //   [ 2,-4, 5, 8, -4, 0]
      // ]
      // const A = new System(a);
      // const solution = await A.solve();


      // console.log('solution.coefficients.get()',solution.coefficients.get())
      // console.log('solution.solutions',solution.solutions)
      // const b = [
      //   [2,3],
      //   [3,-6],
      // ];
      // const B = new Matrix(b);
      // const solution2 = await B.eigenvalues({rounded:true});
      // console.log('solution2.get()',solution2.get());
      const c = [
        [4,-1,6],
        [2, 1,6],
        [2,-1,8],
      ]
      const C = new Matrix(c);
      const solution3 = await C.eigenvectors({rounded:true});
      console.log('solution3[0]',solution3[0]);

      const d = [
        [0,-1],
        [1, 0],
      ];
      const D = new Matrix(d);
      const solution4 = await D.eigenvalues({rounded:false});
      console.log('solution4.get()',solution4.get());
    });
    it('should rref correctly',async ()=>{
      const a = [
        [2, -1, 6],
        [2, -1, 6],
        [2, -1, 6]
      ];
      const A = new Matrix(a);
      const solution = await A.rref();
      console.log('solution.get()',solution.get());
    });
    //Column Space A = Pivor Columns of A
    //Null Space A = Non Pivor Columns of A
  });
});
//https://github.com/tensorflow/tfjs-core/pull/1675