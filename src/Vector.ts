import { getBackend, setBackend, } from "./tensorflow_singleton";
import * as tf from '@tensorflow/tfjs-node';
import {EPSILON, areEqual, toDegrees} from './util';
import {Matrix} from './Matrix';

/**
 * @description a vector class that uses tensorflow tensors to represent vectors
 * @export  Vector
 * @class Vector
 * @property {tf.Tensor} components - the components of the vector 
 */
export class Vector{
  /**
   * @description the components of the vector
   */
  components: tf.Tensor;
  /**
   * @description creates an instance of Vector.
   * @param {number[]|tf.Tensor} components - the components of the vector
   */
  constructor(components:number[]|tf.Tensor){
    // this.tf = getBackend();
    this.components = Array.isArray(components)
      ? tf.tensor1d(components)
      : components;
  }  
  /**
   * @description returns a new vector that is the current vector plus the vector passed in as an argument
   * @param components 
   * @returns a new vector that is the current vector plus the vector passed in as an argument 
   */
  add(components:number[]):Vector{
    return new Vector(this.components.add(tf.tensor1d(components)));
  }
  /**
   * @description returns a new vector that is the current vector minus the vector passed in as an argument
   * @param components 
   * @returns a new vector that is the current vector minus the vector passed in as an argument 
   */
  subtract(components:number[]):Vector{
    return new Vector(this.components.sub(tf.tensor1d(components)));
  }
  /**
   * @description returns a new vector that is the current vector scaled by the scalar passed in as an argument 
   * @param scalar  
   * @returns a new vector that is the current vector scaled by the scalar passed in as an argument
   */
  scaleBy(scalar:number):Vector{ 
    return new Vector(this.components.mul(scalar));
  }
  /**
   * @description returns the length of the vector
   * @returns the length of the vector
   */
  length():number{
    return this.components.norm().arraySync() as number;
  }
  /**
   * @description returns the dot product of the current vector and the vector passed in as an argument
   * @param vector 
   * @returns 
   */
  dotProduct(vector:Vector):number{
    return this.components.dot(vector.components).arraySync() as number;
  }
  /**
   * @description returns a new vector with the same direction as the current vector but with a length of 1
   * @returns a new vector with the same direction as the current vector but with a length of 1
   */
  normalize():Vector{
    return new Vector(this.components.div(this.length()));
  }
  /** 
   * @description returns true if the current vector and the vector passed in as an argument have the same direction 
   * @param vector
   * @returns true if the current vector and the vector passed in as an argument have the same direction
  */
  haveSameDirectionWith(vector:Vector):boolean{
    const dotProduct = this.normalize().dotProduct(vector.normalize());
    return areEqual(dotProduct,1);
  }
  /**
   * @description returns true if the current vector and the vector passed in as an argument have opposite directions
   * @param vector 
   * @returns true if the current vector and the vector passed in as an argument have opposite directions
   */
  haveOppositeDirectionTo(vector:Vector):boolean{
    const dotProduct = this.normalize().dotProduct(vector.normalize());
    return areEqual(dotProduct,-1);
  }
  /**
   * @description returns true if the current vector and the vector passed in as an argument are perpendicular
   * @param vector 
   * @returns true if the current vector and the vector passed in as an argument are perpendicular 
   */
  isPerpendicularTo(vector:Vector):boolean{
    const dotProduct = this.normalize().dotProduct(vector.normalize());
    return areEqual(dotProduct,0);
  }
  /** 
   * @description returns a new vector that is the cross product of the current vector and the vector passed in as an argument
   * @param vector
   * @returns a new vector that is the cross product of the current vector and the vector passed in as an argument
   */
  crossProduct(vector:Vector):Vector{
    const thisComponents = this.components.dataSync();
    const components = vector.components.dataSync();
 
    return new Vector([
      thisComponents[1] * components[2] - thisComponents[2] * components[1],
      thisComponents[2] * components[0] - thisComponents[0] * components[2],
      thisComponents[0] * components[1] - thisComponents[1] * components[0]
    ]);
  }
  /**
   * @description returns the angle between the current vector and the vector passed in as an argument
   * @param vector 
   * @returns the angle between the current vector and the vector passed in as an argument
   */
  angleBetween(vector:Vector):number{
    return toDegrees( 
      Math.acos(
        this.dotProduct(vector) / (this.length() * vector.length())
      )
    );
  }
  /**
   * @description returns a new vector that is the current vector but with the opposite direction 
   * @returns a new vector that is the current vector but with the opposite direction
   */
  negate():Vector{
    return this.scaleBy(-1);
  }
  /**
   * @description returns a new vector that is the current vector projected onto the vector passed in as an argument
   * @param vector
   * @returns a new vector that is the current vector projected onto the vector passed in as an argument
   * @example
   const vector = new Vector([1,2,3])
   const vector2 = new Vector([1,1,1])
   vector.projectOn(vector2) // returns a new vector with the same direction as vector2 but with a length of 2
   vector.projectOn(vector2).length() // returns 2
   vector.projectOn(vector2).haveSameDirectionWith(vector2) // returns true
   vector.projectOn(vector2).isPerpendicularTo(vector2) // returns true
   */
  projectOn(vector:Vector):Vector{
    const normalized = vector.normalize()
    const dotProductNormalized = this.dotProduct(normalized)
    return normalized.scaleBy(dotProductNormalized)
  }
  /**
   * @description returns a new vector that is the current vector but with a length of the number passed in as an argument
   * @param length 
   * @returns a new vector that is the current vector but with a length of the number passed in as an argument
   */
  withLength(length:number):Vector{
    return this.normalize().scaleBy(length);
  }
  /**
   * @description returns true if the current vector and the vector passed in as an argument are equal
   * @param vector 
   * @returns true if the current vector and the vector passed in as an argument are equal
   */
  equalTo(vector:Vector):boolean{
    return tf.equal(this.components,vector.components).all().arraySync()===1;
  }
  /**
   * @description returns a new vector that is the current vector transformed by the matrix passed in as an argument
   * @param matrix 
   * @returns a new vector that is the current vector transformed by the matrix passed in as an argument
   */
  transform(matrix:Matrix):Vector{
    const [ matrixRows, matrixColumns ] = matrix.elements.shape;
    const vectorMatrix = this.components.reshape([ 1, matrixRows ]);
    return new Vector(vectorMatrix.matMul(matrix.elements).reshape([ matrixRows ]));
  }
  /**
   * @description returns the components of the vector as an array
   * @returns the components of the vector as an array
   */
  get():number[]{
    return this.components.arraySync() as number[];
  }
}