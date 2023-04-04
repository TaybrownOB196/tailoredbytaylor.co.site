import Vector2d from './Vector2d';

//TODO: Reform logic into a transform class for a vector2d using an adapter style library or something
class Matrix2d {
    constructor() {
        //Support 2D vectors only
        this.matrixDim = 2;
        this.container = [];
        for(let c=0; c<this.matrixDim; c++) {
            let rowValues = [];
            for(let r=0; r<this.matrixDim; r++) {
                rowValues.push(0);
            }
            this.container.push(rowValues);
        }
    }

    multiplyVector2d(vector2d) {
        return new Vector2d(
            this.container[0][0] * vector2d.x + this.container[0][1] * vector2d.y,
            this.container[1][0] * vector2d.x + this.container[1][1] * vector2d.y);
    }
}

export default Matrix2d;

// let m1 = new Matrix2d(2);
// console.log(m1)
// m1.container[0][0] = 10;
// m1.container[0][1] = 1;
// m1.container[1][0] = 20;
// m1.container[1][1] = 2;
// console.log(m1.multiplyVector2d(new Vector2d(2,3)));
////expect (23,46)