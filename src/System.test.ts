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
    it('solves a consistent and unique solution system',async ()=>{
      const a = [
        [1, -2, 1, 0],
        [0, 2, -8, 8],
        [5, 0, -5, 10],
      ]
      const A = new System(a);
      const solution = await A.solve();

      expect(solution.solutions.x_1).toBe(1);
      expect(solution.solutions.x_2).toBe(0);
      expect(solution.solutions.x_3).toBe(-1);
      expect(solution.unique).toBe(true);
      expect(solution.consistent).toBe(true);
      expect(solution.pivots).toHaveLength(3);
    });
    it('solves a consistent and non unique solution system',async ()=>{
      const a = [
        [1, 4, -5, 0],
        [2, -1, 8, 9],
      ]
      const A = new System(a);
      const solution = await A.solve();

      expect(solution.solutions.vector).toMatchObject([4,-1,0]);
      expect(solution.solutions.x_3).toMatchObject([-3,2,1]);
      expect(solution.unique).toBe(false);
      expect(solution.consistent).toBe(true);
      expect(solution.pivots).toHaveLength(2);
      
    });
    it('solves a m x n consistent and non unique solution system',async ()=>{
      const a = [
        [1,6,2,-5,-2,-4,],
        [0,0,2,-8,-1,3,],
        [0,0,0,0,1,7,]
      ]
      const A = new System(a);
      const solution = await A.solve();

      expect(solution.solutions.vector).toMatchObject([0,0,5,0,7]);
      expect(solution.solutions.x_2).toMatchObject([-6,1,0,0,0]);
      expect(solution.solutions.x_4).toMatchObject([-3,0,4,1,0]);
      expect(solution.solutions.x_5).toBe(7);
      expect(solution.unique).toBe(false);
      expect(solution.consistent).toBe(true);
      expect(solution.pivots).toHaveLength(3);
    });
    it('solves a m x n consistent and non unique solution system',async ()=>{
      const a = [
        [-3, 6,-1, 1, -7, 0],
        [ 1,-2, 2, 3, -1, 0],
        [ 2,-4, 5, 8, -4, 0]
      ]
      const A = new System(a);
      const solution = await A.solve();
      // console.log('solution.coefficients.get()',solution.coefficients.get())
      // console.log('solution.solutions',solution.solutions)
      // expect(solution.solutions.vector).toMatchObject([2,0,5,0,7]);
      // expect(solution.solutions.x_2).toMatchObject([1,0,-2,1,0]);
      // expect(solution.solutions.x_4).toMatchObject([-3,0,2,0,1]);
      // expect(solution.solutions.x_5).toBe(7);
      expect(solution.solutions.vector).toMatchObject([0,0,0,0,0]);
      expect(solution.solutions.x_2).toMatchObject([2,1,0,0,0]);
      expect(solution.solutions.x_4).toMatchObject([1,0,-2,1,0]);
      expect(solution.solutions.x_5).toMatchObject([-3,0,2,0,1]);
      expect(solution.unique).toBe(false);
      expect(solution.consistent).toBe(true);
      expect(solution.pivots).toHaveLength(2);
    });
    it('solves a inconsistent n x n system',async ()=>{
      const a = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 2, 4],
      ]
      const A = new System(a);
      const solution = await A.solve();
      expect(solution.solutions).toMatchObject({});
      expect(solution.unique).toBe(false);
      expect(solution.consistent).toBe(false);
      expect(solution.pivots).toHaveLength(2);
    });
    it('solves a inconsistent m x n system',async ()=>{
      const a = [
        [ 1, -2, -1,  3, 0],
        [-2,  4,  5, -5, 3],
        [ 3, -6, -6,  8, 2],
      ]
      const A = new System(a);
      const solution = await A.solve();
      // console.log('solution',solution)
      expect(solution.solutions).toMatchObject({});
      expect(solution.unique).toBe(false);
      expect(solution.consistent).toBe(false);
      expect(solution.pivots).toHaveLength(2);
    });
  });
});
