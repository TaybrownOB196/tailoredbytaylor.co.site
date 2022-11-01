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

    getPerpendicular() {
        let length = this.getLength();
        return new Vector2d(this.y/length, this.x/length);
    }

    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    getMagnitude() {
        return this.getLength();
    }

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

    static getQuadraticBezierVector(vector0, vector1, vector2, fraction) {
        let v0p = Math.pow(1 - fraction, 2);
        let v0 = new Vector2d(v0p * vector0.x, v0p * vector0.y);

        let v1p = 2 * (1 - fraction) * fraction;
        let v1 = new Vector2d(v1p * vector1.x, v1p * vector1.y);

        let v2p = Math.pow(fraction, 2);
        let v2 = new Vector2d(v2p * vector2.x, v2p * vector2.y);

        return new Vector2d(
            v0.x + v1.x + v2.x,
            v0.y + v1.y + v2.y
        );
    }

    static getQuadraticBezierVectorEnd(vector0, vector1, vector2, fraction) {
        let v0p = Math.pow(1 - fraction, 2);
        let v0 = new Vector2d(v0p * vector0.x, v0p * vector0.y);

        let v1p = 2 * (1 - fraction) * fraction;
        let v1 = new Vector2d(v1p * vector1.x, v1p * vector1.y);

        let v2p = Math.pow(fraction, 2);
        let v2 = new Vector2d(v2p * vector2.x, v2p * vector2.y);
        
        return new Vector2d(
            v0.x + v1.x + v2.x,
            v0.y + v1.y + v2.y
        );
    }
}

export default Vector2d;