import * as util from './util';

describe('util', function () { 
  // describe('rref', () => {
  //   const A1 = [
  //     [ 1, 2, -1, -4],
  //     [ 2, 3, -1,-11],
  //     [-2, 0, -3, 22]
  //   ];
  //   const A2 = [
  //     [ 2, 1, -1, 8 ],
  //     [ -3, -1, 2, -11 ],
  //     [ -2, 1, 2, -3 ]
  //   ];
  //   it('should return rref of input matrix', () => {
  //     expect(util.rref(A1)).toMatchObject([
  //       [ 1, 0, 0, -8 ],
  //       [ -0, 1, 0, 1 ],
  //       [ -0, -0, 1, -2 ]
  //     ]);
  //     expect(util.rref(A2)).toMatchObject([
  //       [ 1, 0, 0, 2 ],
  //       [ 0, 1, 0, 3 ],
  //       [ -0, -0, 1, -1 ]
  //     ]);
  //   });

  describe('areEqual', () => {
    it('should return true if two matrices are equal', () => {
      expect(util.areEqual(1, 1)).toBe(true);
      expect(util.areEqual(2, 2)).toBe(true);
    });
    it('should return false if two matrices are not equal', () => {
      expect(util.areEqual(1, 3.000000000000004)).toBe(false);
      expect(util.areEqual(2, 1)).toBe(false);
    });
  });
  describe('toDegrees', () => {
    it('should return the degree equivalent of the input radian', () => {
      expect(util.toDegrees(0)).toBe(0);
      expect(util.toDegrees(Math.PI)).toBe(180);
      expect(util.toDegrees(Math.PI / 2)).toBe(90);
    });
  });
  describe('toRadians', () => {
    it('should return the radian equivalent of the input degree', () => {
      expect(util.toRadians(0)).toBe(0);
      expect(util.toRadians(180)).toBe(Math.PI);
      expect(util.toRadians(90)).toBe(Math.PI / 2);
    });
  });
  describe('sum', () => {
    it('should return the sum of the input array', () => {
      expect(util.sum([1, 2, 3, 4])).toBe(10);
      expect(util.sum([1, 2, 3, 4, 5])).toBe(15);
    });
  });
});

/*
const EPSILON = 0.00000001

const areEqual = (one, other, epsilon = EPSILON) =>
  Math.abs(one - other) < epsilon

const toDegrees = radians => (radians * 180) / Math.PI
const toRadians = degrees => (degrees * Math.PI) / 180
const sum = arr => arr.reduce((acc, value) => acc + value, 0)
const withoutElementAtIndex = (arr, index) => [ ...arr.slice(0, index), ...arr.slice(index + 1) ]

class Vector {
  constructor(...components) {
    this.components = components
  }
  add({ components }) {
    return new Vector(
      ...components.map((component, index) => this.components[index] + component)
    )
  }
  subtract({ components }) {
    return new Vector(
      ...components.map((component, index) => this.components[index] - component)
    )
  }
  scaleBy(number) {
    return new Vector(
      ...this.components.map(component => component * number)
    )
  }
  length() {
    return Math.hypot(...this.components)
  }
  dotProduct({ components }) {
    return components.reduce((acc, component, index) => acc + component * this.components[index], 0)
  }
  normalize() {
    return this.scaleBy(1 / this.length())
  }
  haveSameDirectionWith(other) {
    const dotProduct = this.normalize().dotProduct(other.normalize())
    return areEqual(dotProduct, 1)
  }
  haveOppositeDirectionTo(other) {
    const dotProduct = this.normalize().dotProduct(other.normalize())
    return areEqual(dotProduct, -1)
  }
  isPerpendicularTo(other) {
    const dotProduct = this.normalize().dotProduct(other.normalize())
    return areEqual(dotProduct, 0)
  }
  // 3D vectors only
  crossProduct({ components }) {
    return new Vector(
      this.components[1] * components[2] - this.components[2] * components[1],
      this.components[2] * components[0] - this.components[0] * components[2],
      this.components[0] * components[1] - this.components[1] * components[0]
    )
  }
  angleBetween(other) {
    return toDegrees(
      Math.acos(
        this.dotProduct(other) /
        (this.length() * other.length())
      )
    )
  }
  negate() {
    return this.scaleBy(-1)
  }
  withLength(newLength) {
    console.log('from util test this.normalize()',this.normalize())
    return this.normalize().scaleBy(newLength)
  }
  projectOn(other) {
    const normalized = other.normalize()
    return normalized.scaleBy(this.dotProduct(normalized))
  }
  equalTo({ components }) {
    return components.every((component, index) => areEqual(component, this.components[index]))
  }
  transform(matrix) {
    const columns = matrix.columns()
    if(columns.length !== this.components.length) {
      throw new Error('Matrix columns length should be equal to vector components length.')
    }

    const multiplied = columns
      .map((column, i) => column.map(c => c * this.components[i]))
    const newComponents = multiplied[0].map((_, i) => sum(multiplied.map(column => column[i])))
    return new Vector(...newComponents)
  }
}


const one = new Vector(2, 3)
console.log(one.length())
// 3.6055512754639896
const modified = one.withLength(10)
// 10
console.log({modified},modified.length())


get columns from a matrix:
const x = tf.tensor([
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9,10,11,12]
]);
​
//x.slice([0,3],[3,1]).print();
​
tf.unstack(x,1).forEach(tensor => tensor.print());
​
​
Tensor
    [1, 5, 9]
Tensor
    [2, 6, 10]
Tensor
    [3, 7, 11]
Tensor
    [4, 8, 12]
EditRun

*/