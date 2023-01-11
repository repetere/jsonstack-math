import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from "../../Matrix";
import { System } from '../../System';

describe('System of Linear Equations',()=>{
  describe('System Solutions chec',()=>{
    it('create a matrix object',()=>{
      const a = [
        [1,-2,-1],
        [-1,2,3],
      ];
      const A = new System(a);
      A.coefficients;
      // console.log(A.get());
      // const m = new Matrix([[1,2],[3,4]]);
      // expect(m).toBeInstanceOf(Matrix);
    });
    // it('create a matrix from tensor',()=>{
    //   const m = new Matrix(tf.tensor2d([[1,2],[3,4]]));
    //   expect(m).toBeInstanceOf(Matrix);
    // });
  });
});