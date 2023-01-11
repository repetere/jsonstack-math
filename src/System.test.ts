import * as tf from '@tensorflow/tfjs-node';
import { System } from "./System";
import { Matrix } from "./Matrix";
import { Vector } from "./Vector";

describe('System',()=>{
  describe('constructor',()=>{
    it('create a system object',()=>{
      const m = new System([[1,2],[3,4]]);
      const m2 = new System(new Matrix([[1,2],[3,4]]));
      expect(m).toBeInstanceOf(System);
      expect(m2).toBeInstanceOf(System);
    });
    it('create a system with labels',()=>{
      const m = new System([[1,2],[3,4]],['x','y']);
      expect(m).toBeInstanceOf(System);
      expect(m.labels).toEqual(['x','y']);
    });
  });
  describe('coefficients',()=>{
    it('get the coefficients of the system',()=>{
      const m = new System([[1,2,3],[4,5,6]]);
      expect(m.coefficients).toBeInstanceOf(Matrix);
      expect(m.coefficients.get()).toEqual([[1,2],[4,5]]);
    });
  });
  describe('augmentedColumn',()=>{
    it('get the augmented column of the system',()=>{
      const m = new System([[1,2,3],[4,5,6]]);
      expect(m.augmentedColumn).toBeInstanceOf(Vector);
      expect(m.augmentedColumn.get()).toEqual([3,6]);
    });
  });
  describe('solve',()=>{
    it('solve the system',async ()=>{
      const a = [
        [1, -2, 1, 0],
        [0, 2, -8, 8],
        [5, 0, -5, 10],
      ]
      const A = new System(a);
      const solution = await A.solve();
      // const m = new System([[1,2,3],[4,5,6]]);
      // expect(m.solve()).toBeInstanceOf(Vector);
      // expect(m.solve().get()).toEqual([3,6]);
    });
  });
});
/**
 * 1 - - - - - 
 * 0 0 0 1 - -
 * 0 0 0 0 1 -
 */