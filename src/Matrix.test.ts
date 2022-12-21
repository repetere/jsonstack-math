import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from "./Matrix";

describe('Matrix',()=>{
  describe('constructor',()=>{
    it('create a matrix object',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m).toBeInstanceOf(Matrix);
    });
    it('create a matrix from tensor',()=>{
      const m = new Matrix(tf.tensor2d([[1,2],[3,4]]));
      expect(m).toBeInstanceOf(Matrix);
    });
  });
  describe('rows',()=>{
    it('should return the rows of the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      const i_3 = new Matrix([[1,0,0,],[0,1,0],[0,0,1]]);
      expect(m.rows()).toEqual([[1,2],[3,4]]);
      expect(i_3.rows()).toEqual([[1,0,0,],[0,1,0],[0,0,1]]);
    });
    it('should return the row of the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.rows(0)).toEqual([1,2]);
      expect(m.rows(1)).toEqual([3,4]);
    });
    it('should return the element of the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.rows(0,0)).toEqual(1);
      expect(m.rows(1,0)).toEqual(3);
    });
  });
  describe('column',()=>{
    it('should return the column of the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.column(0).get()).toEqual([1,3]);
      expect(m.column(1).get()).toEqual([2,4]);
    });
  });
  describe('transform',()=>{
    it('should transform the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      const m_t = new Matrix([[-1,0],[0,1]]);
      const m_1 = m_t.transform(m);
      expect(m_1.get()).toEqual([[-1,-2],[3,4]]);
    });
  });
  describe('add',()=>{
    it('should add the matrix',()=>{
      const a = new Matrix([[1,2],[3,4]]);
      const b = new Matrix([[5,6],[7,8]]);
      const ab = a.add(b);
      const ba = b.add(a);
      expect(ab.get()).toEqual([[6,8],[10,12]]);
      expect(ba.get()).toEqual([[6,8],[10,12]]);
    });
  });
  describe('subtract',()=>{
    it('should subtract the matrix',()=>{
      const a = new Matrix([[1,2],[3,4]]);
      const b = new Matrix([[5,6],[7,8]]);
      const ab = a.subtract(b);
      const ba = b.subtract(a);
      expect(ab.get()).toEqual([[-4,-4],[-4,-4]]);
      expect(ba.get()).toEqual([[4,4],[4,4]]);
    });
  });
  describe('scaleBy',()=>{
    it('should scale the matrix',()=>{
      const a = new Matrix([[1,2],[3,4]]);
      const b = a.scaleBy(2);
      expect(b.get()).toEqual([[2,4],[6,8]]);
    });
  });
  describe('multiplu',()=>{
    it('should transform the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      const m_t = new Matrix([[-1,0],[0,1]]);
      const m_1 = m_t.multiply(m);
      expect(m_1.get()).toEqual([[-1,-2],[3,4]]);
    });
  });
  describe('get',()=>{
    it('should return the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.get()).toEqual([[1,2],[3,4]]);
    });
  });
});