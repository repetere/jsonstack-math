export declare class Vector {
    constructor(components: number[]);
    /**
     * @description returns a new vector that is the current vector plus the vector passed in as an argument
     * @param components
     * @returns a new vector that is the current vector plus the vector passed in as an argument
     */
    add(components: number[]): Vector;
    /**
     * @description returns a new vector that is the current vector minus the vector passed in as an argument
     * @param components
     * @returns a new vector that is the current vector minus the vector passed in as an argument
     */
    subtract(components: number[]): Vector;
    /**
     * @description returns a new vector that is the current vector scaled by the scalar passed in as an argument
     * @param scalar
     * @returns a new vector that is the current vector scaled by the scalar passed in as an argument
     */
    scaleBy(scalar: number): Vector;
    /**
     * @description returns the length of the vector
     * @returns the length of the vector
     */
    length(): number;
    /**
     * @description returns the dot product of the current vector and the vector passed in as an argument
     * @param vector
     * @returns
     */
    dotProduct(vector: Vector): number;
    /**
     * @description returns a new vector with the same direction as the current vector but with a length of 1
     * @returns a new vector with the same direction as the current vector but with a length of 1
     */
    normalize(): Vector;
    /**
     * @description returns true if the current vector and the vector passed in as an argument have the same direction
     * @param vector
     * @returns true if the current vector and the vector passed in as an argument have the same direction
    */
    haveSameDirectionWith(vector: Vector): boolean;
    /**
     * @description returns true if the current vector and the vector passed in as an argument have opposite directions
     * @param vector
     * @returns true if the current vector and the vector passed in as an argument have opposite directions
     */
    haveOppositeDirectionTo(vector: Vector): boolean;
    /**
     * @description returns true if the current vector and the vector passed in as an argument are perpendicular
     * @param vector
     * @returns true if the current vector and the vector passed in as an argument are perpendicular
     */
    isPerpendicularTo(vector: Vector): boolean;
    /**
     * @description returns a new vector that is the cross product of the current vector and the vector passed in as an argument
     * @param vector
     * @returns a new vector that is the cross product of the current vector and the vector passed in as an argument
     */
    crossProduct(vector: Vector): Vector;
    /**
     * @description returns the angle between the current vector and the vector passed in as an argument
     * @param vector
     * @returns the angle between the current vector and the vector passed in as an argument
     */
    angleBetween(vector: Vector): number;
    /**
     * @description returns a new vector that is the current vector but with the opposite direction
     * @returns a new vector that is the current vector but with the opposite direction
     */
    negate(): Vector;
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
    projectOn(vector: Vector): Vector;
    /**
     * @description returns a new vector that is the current vector but with a length of the number passed in as an argument
     * @param length
     * @returns a new vector that is the current vector but with a length of the number passed in as an argument
     */
    withLength(length: number): Vector;
    /**
     * @description returns true if the current vector and the vector passed in as an argument are equal
     * @param vector
     * @returns true if the current vector and the vector passed in as an argument are equal
     */
    equalTo(vector: Vector): boolean;
    /**
     * @description returns the components of the vector as an array
     * @returns the components of the vector as an array
     */
    get(): number[];
}
