import { getBackend, setBackend, } from "./tensorflow_singleton";
import * as tf from '@tensorflow/tfjs-node';
import { Vector } from "./vector";

describe('Vector',()=>{
  describe('constructor',()=>{
    it('create a vector object',()=>{
      const v = new Vector([1,2,3]);
      expect(v).toBeInstanceOf(Vector);
    });
    it('create a vector from tensor',()=>{
      const v = new Vector(tf.tensor1d([1,2,3]));
      expect(v).toBeInstanceOf(Vector);
    });
  });
  describe('add',()=>{
    it('should add a vector to the current vector',()=>{
      const v = new Vector([1,2,3]);
      const w = v.add([1,1,1]);
      expect(w.get()).toEqual([2,3,4]);
    });
    it('should throw an error if vectors are not the same length',()=>{
      const v = new Vector([1,2,3]);
      expect(()=>{
        v.add([1,1]);
      }).toThrowError('Incompatible shapes: [3] vs. [2]');
    });
  });
  describe('subtract',()=>{
    it('should subtract a vector from the current vector',()=>{
      const v = new Vector([1,2,3]);
      const w = v.subtract([1,1,1]);
      expect(w.get()).toEqual([0,1,2]);
    });
    it('should throw an error if vectors are not the same length',()=>{
      const v = new Vector([1,2,3]);
      expect(()=>{
        v.subtract([1,1]);
      }).toThrowError('Incompatible shapes: [3] vs. [2]');
    });
  });
  describe('scaleBy',()=>{  
    it('should scale the vector by a scalar',()=>{
      const v = new Vector([1,2,3]);
      const w = v.scaleBy(2);
      expect(w.get()).toEqual([2,4,6]);
    });
  });
  describe('dotProduct',()=>{
    it('should return the dot product of two vectors',()=>{
      const v_1 = new Vector([1,4]);
      const v_2 = new Vector([2,2]);
      const v_3 = new Vector([6,2]);
      const v_4 = new Vector([2,3]);
      expect(v_1.dotProduct(v_2)).toBeCloseTo(10);
      expect(v_2.dotProduct(v_3)).toBeCloseTo(16);
      expect(v_3.dotProduct(v_4)).toBeCloseTo(18);
    });
    it('should throw an error if vectors are not the same length',()=>{
      const v = new Vector([1,2,3]);
      expect(()=>{
        v.dotProduct(new Vector([1,1]));
      }).toThrowError('inner dimensions of inputs must match');
    });
  });
  describe('normalize',()=>{ 
    it('should return the normalized vector',()=>{
      const v_2 = new Vector([0,5]);
      const v_3 = new Vector([3,4]);
      const v_4 = new Vector([2,4]);
      expect(v_2.normalize().get()).toEqual([0,1]);
      const norm_v_3 = v_3.normalize().get();
      expect(norm_v_3[0]).toBeCloseTo(0.6);
      expect(norm_v_3[1]).toBeCloseTo(0.8);

      const norm_v_4 = v_4.normalize().get();
      expect(norm_v_4[0]).toBeCloseTo(0.44721);
      expect(norm_v_4[1]).toBeCloseTo(0.89443);
      // expect(norm_v_4[0]).toEqual([0.4472135954999579,0.8944271909999159]);
    });
  });
  describe('length',()=>{
    it('should return the length of the vector',()=>{
      const v_1 = new Vector([1,2,3]);
      const v_2 = new Vector([0,5]);
      const v_3 = new Vector([6,2]);
      const v_4 = new Vector([2,3]);
      expect(v_1.length()).toBeCloseTo(3.7416573867739413);
      expect(v_2.length()).toBeCloseTo(5);
      expect(v_3.length()).toBeCloseTo(6.32);
      expect(v_4.length()).toBeCloseTo(3.605);
    });
  });
  describe('haveSameDirection',()=>{
    it('should return true if the vectors have the same direction',()=>{
      const v_1 = new Vector([1,2,3]);
      const v_2 = new Vector([2,4,6]);
      const v_3 = new Vector([1,2,3]);
      const v_4 = new Vector([-1,-2,-3]);
      expect(v_1.haveSameDirection(v_2)).toBe(true);
      expect(v_1.haveSameDirection(v_3)).toBe(true);
      expect(v_1.haveSameDirection(v_4)).toBe(false);
      const a = new Vector([2,4]);
      const b = new Vector([4,8]);
      expect(a.haveSameDirection(b)).toBe(true);
    });
  });
  describe('get',()=>{
    it('should return the components of the vector',()=>{
      const v = new Vector([1,2,3]);
      expect(v.get()).toEqual([1,2,3]);
    });
  });
});