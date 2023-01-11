import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from "./Matrix";
import { Vector } from "./Vector";

describe('Matrix',()=>{
  describe('constructor',()=>{
    it('create a matrix object',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m).toBeInstanceOf(Matrix);
      expect(m.rows).toBe(2);
      expect(m.columns).toBe(2);
    });
    it('create a matrix from tensor',()=>{
      const m = new Matrix(tf.tensor2d([[1,2],[3,4]]));
      expect(m).toBeInstanceOf(Matrix);
    });
  });
  describe('row',()=>{
    it('should return the rows of the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      const i_3 = new Matrix([[1,0,0,],[0,1,0],[0,0,1]]);
      expect(m.row()).toEqual([[1,2],[3,4]]);
      expect(i_3.row()).toEqual([[1,0,0,],[0,1,0],[0,0,1]]);
    });
    it('should return the row of the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.row(0)).toEqual([1,2]);
      expect(m.row(1)).toEqual([3,4]);
    });
    it('should return the element of the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.row(0,0)).toEqual(1);
      expect(m.row(1,0)).toEqual(3);
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
  describe('static identity',()=>{
    it('should return an identity matrix',()=>{
      const i = Matrix.identity(3);
      expect(i.get()).toMatchObject([[1,0,0],[0,1,0],[0,0,1]]);
      const i7 = Matrix.identity(7);
      expect(i7.get()).toMatchObject([
        [1,0,0,0,0,0,0],
        [0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0],
        [0,0,0,1,0,0,0],
        [0,0,0,0,1,0,0],
        [0,0,0,0,0,1,0],
        [0,0,0,0,0,0,1]
      ]);
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
  });
  describe('rref', () => {
    const A1 = [
      [ 1, 2, -1, -4],
      [ 2, 3, -1,-11],
      [-2, 0, -3, 22]
    ];
    const A2 = [
      [ 2, 1, -1, 8 ],
      [ -3, -1, 2, -11 ],
      [ -2, 1, 2, -3 ]
    ];
    const A3 = [
      [ 1, 2 ],
      [ 3, 4 ]
    ];
    const A4 = [
      [ 0, 0 ],
      [ 0, 0 ],
    ];
    const A5 = [
      [ 5, 0, ],
      [ 0, 0 ],
      [ 0, 0 ],
    ];
    const A6=[[]];
    it('should return rref of input matrix', () => {
      expect(new Matrix(A1).rref().get()).toMatchObject([
        [ 1, 0, 0, -8 ],
        [ 0, 1, 0, 1 ],
        [ 0, 0, 1, -2 ]
      ]);
      expect(new Matrix(A2).rref().get()).toMatchObject([
        [ 1, 0, 0, 2 ],
        [ 0, 1, 0, 3 ],
        [ 0, 0, 1, -1 ]
      ]);
      expect(new Matrix(A3).rref().get()).toMatchObject([
        [ 1, 0 ],
        [ 0, 1 ]
      ]);
      expect(new Matrix(A4).rref().get()).toMatchObject([
        [ 0, 0 ],
        [ 0, 0 ]
      ]);
      expect(new Matrix(A5).rref().get()).toMatchObject([
        [ 5, 0, ],
        [ 0, 0, ],
        [ 0, 0, ],
      ]);
      expect(new Matrix(A6).rref().get()).toMatchObject([
        
      ]);
    });
  });
  describe('augment',()=>{
    it('should return the augmented matrix with another matrix',()=>{
      const m = new Matrix([
        [1,2],
        [3,4]
      ]);
      const v = new Matrix([[6, 9],[7, 0]]);
      const a = m.augment(v);
      expect(a.get()).toMatchObject([
        [1,2,6,9],
        [3,4,7,0]
      ]);
    });
    it('should return the augmented matrix with a vector',()=>{
      const m = new Matrix([
        [1,2],
        [3,4]
      ]);
      const v = new Vector([6,7]);
      const a = m.augment(v);
      expect(a.get()).toMatchObject([
        [1,2,6],
        [3,4,7]
      ]);
    });
  });
  describe('pivots',()=>{
    it('should return the pivots of a 2x2 matrix',()=>{
      const m1 = new Matrix([
        [1,2],
        [3,4]
      ]);
      const m2 = new Matrix([
        [1,2],
        [0,4]
      ]);
      const m3 = new Matrix([
        [1,2],
        [0,1]
      ]);
      const m4 = new Matrix([
        [1,0],
        [0,1]
      ]);
      const m5 = new Matrix([
        [1,0],
        [0,0]
      ]);
      const m6 = new Matrix([
        [0,0],
        [0,0]
      ]);
      const m7 = new Matrix([
        [0,1],
        [0,0]
      ]);
      const m8 = new Matrix([
        [0,1],
        [0,7]
      ]);
      const m1p = m1.pivots;
      const m2p = m2.pivots;
      const m3p = m3.pivots;
      const m4p = m4.pivots;
      const m5p = m5.pivots;
      const m6p = m6.pivots;
      const m7p = m7.pivots;
      const m8p = m8.pivots;
      expect(m1p).toEqual([]);
      expect(m2p).toEqual([[0,0]]);
      expect(m3p).toEqual([[0,0],[1,1]]);
      expect(m4p).toEqual([[0,0],[1,1]]);
      expect(m5p).toEqual([[0,0]]);
      expect(m6p).toEqual([]);
      expect(m7p).toEqual([[0,1]]);
      expect(m8p).toEqual([]);
    });
    it('should return the pivots of a nxn matrix',()=>{
      const m1 = new Matrix([
        [1,2,3,4],
        [5,6,7,8],
        [9,10,11,12],
        [13,14,15,16],
      ]);
      const m2 = new Matrix([
        [1,2,3,4],
        [0,6,7,8],
        [0,10,11,12],
        [0,14,15,16],
      ]);
      const m3 = new Matrix([
        [1,0,0,4],
        [0,0,1,8],
        [0,0,0,12],
        [0,0,0,16],
      ]);
      const m4 = new Matrix([
        [1,4,6,1],
        [0,1,4,5],
        [0,0,1,5],
        [0,0,0,1],
      ]);
      const m5 = new Matrix([
        [0,0,0,0],
        [0,0,0,0],
        [0,0,1,0],
        [0,0,0,0]
      ]);
      const m6 = new Matrix([
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
      ]);
      const m7 = new Matrix([
        [0,1,0],
        [0,0,0],
        [0,0,1]
      ]);
      const m8 = new Matrix([
        [0,1,0],
        [0,7,0],
        [0,0,0]
      ]);
      const m1p = m1.pivots;
      const m2p = m2.pivots;
      const m3p = m3.pivots;
      const m4p = m4.pivots;
      const m5p = m5.pivots;
      const m6p = m6.pivots;
      const m7p = m7.pivots;
      const m8p = m8.pivots;
      expect(m1p).toEqual([]);
      expect(m2p).toEqual([[0,0]]);
      expect(m3p).toEqual([[0,0],[1,2]]);
      expect(m4p).toEqual([[0,0],[1,1],[2,2],[3,3]]);
      expect(m5p).toEqual([[2,2]]);
      expect(m6p).toEqual([]);
      expect(m7p).toEqual([[0,1],[2,2]]);
      expect(m8p).toEqual([]);
    });
    it('should return the pivots of a nxm matrix',()=>{
      const m1 = new Matrix([
        [1,2,3],
        [3,4,5]
      ]);
      const m2 = new Matrix([
        [1,2,3],
        [0,4,5]
      ]);
      const m3 = new Matrix([
        [1,2,0],
        [0,1,0]
      ]);
      const m4 = new Matrix([
        [0,1,0],
        [0,0,1]
      ]);
      const m5 = new Matrix([
        [0,0,1,0],
        [0,0,0,1]
      ]);
      const m1p = m1.pivots;
      const m2p = m2.pivots;
      const m3p = m3.pivots;
      const m4p = m4.pivots;
      const m5p = m5.pivots;
      expect(m1p).toEqual([]);
      expect(m2p).toEqual([[0,0]]);
      expect(m3p).toEqual([[0,0],[1,1]]);
      expect(m4p).toEqual([[0,1],[1,2]]);
      expect(m5p).toEqual([[0,2],[1,3]]);
    });
  });
  describe('get',()=>{
    it('should return the matrix',()=>{
      const m = new Matrix([[1,2],[3,4]]);
      expect(m.get()).toEqual([[1,2],[3,4]]);
    });
  });
});