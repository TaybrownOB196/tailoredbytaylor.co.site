//Normalized vectors (also known as unit vectors)
import { Point2d } from './common';

class Vector2d {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    
    add(vector1) {
        this.x += vector1.x;
        this.y += vector1.y;
    }

    subtract(vector1) {
        this.x -= vector1.x;
        this.y -= vector1.y;
    }

    multiply(vector1) {
        this.x *= vector1.x;
        this.y *= vector1.y;
    }

    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    
    divide(vector1) {
        this.x /= vector1.x;
        this.y /= vector1.y;
    }

    divideScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    getPerpendicular() {
        let length = this.getLength();
        return new Vector2d(this.y/length, this.x/length);
    }

    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    //Change length of vector to 1
    getNormalize() {
        let length = this.getLength();
        return new Vector2d(this.x/length, this.y/length);
    }

    getDirection() {
        return Math.atan(Math.abs(this.y/this.x)) * 180/Math.PI;
    }

    getQuadrant() {
        if (this.x == 0 && this.y == 0) return 0;
        let val = Math.sign(this.x) + Math.sign(this.y);
        if(val == 2) return 1;
        else if (val == -2) return 3;
        else {
            return Math.sign(this.x) == -1 ? 2 : 4;
        }
    }

    rotateAroundPoint(point, angle) {

    }

    static getDistance(vector0, vector1) {
        let dx = vector0.x - vector1.x;
        let dy = vector0.y - vector1.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    
    static getCross(vector0, vector1) {
        return vector0.x * vector1.y - vector0.y * vector1.x;
    }

    //If return > 0 then vectors are facing the same direction
    //If return = 0 then vectors are perpendicular
    //If return < 0 then vectors are facing the opposite direction
    static getDotProduct(vector0, vector1) {
        return (vector1.x * vector0.x + vector1.y * vector0.y);
    }

    static pointsToVector(startPoint, endPoint) {
        return new Vector2d(endPoint.x-startPoint.x, endPoint.y-startPoint.y);
    }

    static getLinearBezierVector(vector0, vector1, fraction) {
        return new Vector2d(
            vector0.x + (fraction * (vector1.x - vector0.x)),
            vector0.y + (fraction * (vector1.y - vector0.y)));
    }
}

export default Vector2d;