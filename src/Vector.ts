import { getBackend, setBackend, } from "./tensorflow_singleton";
import * as tf from '@tensorflow/tfjs-node';
import {EPSILON,areEqual} from './util';

export class Vector{
  constructor(components:number[]){
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
    return this.components.norm().arraySync();
  }
  /**
   * @description returns the dot product of the current vector and the vector passed in as an argument
   * @param vector 
   * @returns 
   */
  dotProduct(vector:Vector):number{
    return this.components.dot(vector.components).arraySync();
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
  haveSameDirection(vector:Vector):boolean{
    const dotProduct = this.normalize().dotProduct(vector.normalize());
    return areEqual(dotProduct,1);
  }
  /**
   * @description returns the components of the vector as an array
   * @returns the components of the vector as an array
   */
  get():number[]{
    return this.components.arraySync();
  }
}