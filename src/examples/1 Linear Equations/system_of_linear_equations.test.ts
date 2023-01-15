import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from "../../Matrix";
import { System } from '../../System';

describe('System of Linear Equations',()=>{
  describe('Linear Independence',()=>{
    it('check if a set of vectors is linearly independent', async ()=>{
      const a = [
        [1, 2, 0],
        [3, 4, 0],
      ];
      const A = new System(a);
      const solution = await A.solve();
      expect(solution.isLinearlyIndependent).toBe(true);

      const b = [
        [1, 4, 2, 0],
        [2, 5, 1, 0],
        [3, 6, 0, 0],
      ];
      const B = new System(b);
      const solution2 = await B.solve();
      console.log({solution2})
      expect(solution2.isLinearlyIndependent).toBe(false);
    });
    // it('check if a set of vectors is linearly dependent',()=>{
    //   const a = [
    //     [1,2],
    //     [2,4],
    //   ];
    //   const A = new Matrix(a);
    //   expect(A.isLinearlyIndependent()).toBe(false);
    // });
  });
});