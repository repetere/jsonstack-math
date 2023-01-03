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
  describe('multiply',()=>{
    it('should transform the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      const m_t = new Matrix([[-1,0],[0,1]]);
      const m_1 = m_t.multiply(m);
      expect(m_1.get()).toEqual([[-1,-2],[3,4]]);
    });
  });
  describe('transpose',()=>{  
    it('should transpose the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      const m_t = m.transpose();
      expect(m_t.get()).toEqual([[1,3],[2,4]]);
    });
  });
  describe('determinant',()=>{
    it('should return error for non square matrices',()=>{
      const m = new Matrix([[1,2],[3,4],[5,6]]);
      expect(()=>m.determinant()).toThrow();
    });
    it('should return the determinant of a 1x1 matrix',()=>{ 
      const m = new Matrix([[1]]);
      expect(m.determinant()).toEqual(1);
    });
    it('should return the determinant of a 2x2 matrix',()=>{
      const m = new Matrix([
        [ 0, 3],
        [-2, 1]
      ]);
      expect(m.determinant()).toEqual(6);
    });
    it('should return the determinant of a nxn matrix',()=>{
      const m = new Matrix([
        [ 1, 2, 3],
        [-1, 2, 3],
        [ 1, 1, 1]
      ]);
      const m2 = new Matrix([
        [2, -3,  1],
        [2,  0, -1],
        [1,  4,  5]
      ]);
      const m3 = new Matrix([
        [3, 0, 2, -1],
        [1, 2, 0, -2],
        [4, 0, 6, -3],
        [5, 0, 2,  0]
      ]);
      expect(m.determinant()).toEqual(-2);
      expect(m2.determinant()).toEqual(49);
      expect(m3.determinant()).toEqual(20);
    });
  });
  describe('static empty',()=>{
    it('should return an empty matrix',()=>{
      const e = Matrix.empty(2,2);
      const m = new Matrix([[2,2],[3,3]]);
      const em = Matrix.empty(m);
      expect(e.shape).toMatchObject([2,2]);
      expect(em.shape).toMatchObject([2,2]);
    });
  });
  describe('static zeros',()=>{
    it('should return a zero vector',()=>{
      const v = new Matrix([[2,2],[3,3]]);
      const ev = Matrix.zeros(v);
      const er = Matrix.zeros(3,3);
      expect(er.get().length).toEqual(3);
      expect(er.get()).toMatchObject([[0,0,0],[0,0,0],[0,0,0]]);
      expect(ev.get()).toMatchObject([[0,0],[0,0]]);
      expect(ev.get().length).toEqual(2);
    });
  });
  describe('static ones',()=>{
    it('should return a one vector',()=>{
      const v = new Matrix([[2,2],[3,3]]);
      const ev = Matrix.ones(v);
      const er = Matrix.ones(3,3);
      expect(er.get().length).toEqual(3);
      expect(er.get()).toMatchObject([[1,1,1],[1,1,1],[1,1,1]]);
      expect(ev.get()).toMatchObject([[1,1],[1,1]]);
      expect(ev.get().length).toEqual(2);
    });
  });
  describe('diagonal',()=>{
    it('should return the diagonal of the matrix',()=>{
      const m = new Matrix([
        [1,2],
        [3,4]
      ]);
      const d = m.diagonal();
      expect(d.get()).toMatchObject([1,4]);
    });
    it('should return the diagonal of a non square matrix',()=>{
      const A = new Matrix([
        [1, 2, 3, 4], 
        [5, 6,7,8],
        [9,10,11,12]
      ]);
      const d = A.diagonal();
      expect(d.get()).toMatchObject([1,6,11]);
    });
  });
  describe('trace',()=>{
    it('should return the trace of the matrix',()=>{
      const m = new Matrix([
        [1,2],
        [3,4]
      ]);
      const t = m.trace();
      expect(t).toEqual(5);
    });
  })
  describe('get',()=>{
    it('should return the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.get()).toEqual([[1,2],[3,4]]);
    });
  });
});