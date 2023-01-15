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
    it('solves a n x m consistent and non unique solution system',async ()=>{
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
  });
});
/**
 * 1 - - - - - 
 * 0 0 0 1 - -
 * 0 0 0 0 1 -
 * 
 * 
 * 
 * 1 6 2 5 2 4  
 * 0 0 2 8 1 3  
 * 0 0 0 0 1 7  
 * 
rref
1, 6, 0,  3, 0| 0
0, 0, 1, -4, 0| 5
0, 0, 0,  0, 1| 7

vex 
0,  -6, 0,  -3,  0 | 0
0,   1, 0,   0,  0 | 0
0,   0, 0,   4,  0 | 5
0,   0, 0,   1,  0 | 0
0,   0, 0,   0,  0 | 7

vector = [0,0,5,0,7]
x_2 = [6,1,0,0,0]
x_4 = [-3,0,4,1,0]
 */