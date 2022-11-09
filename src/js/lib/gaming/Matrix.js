import Vector2d from './Vector2d';

//TODO: Reform logic into a transform class for a vector2d using an adapter style library or something
class Matrix2d {
    constructor(vectorCount) {
        //Support 2D vectors only
        this.vectorDim = 2;
        this.canMultiplyVector2d = false;
        if (vectorCount == 2 || vectorCount == 1) {
            this.canMultiplyVector2d = true;
        }
        this.container = [];
        for(let c=0; c<vectorCount; c++) {
            let rowValues = [];
            for(let r=0; r<this.vectorDim; r++) {
                rowValues.push(0);
            }
            this.container.push(rowValues);
        }
    }

    static vectorsToMatrix(vectors) {
        let toReturn = new Matrix2d(vectors.length);
        let vCount=0;
        for(let vector of vectors) {
            toReturn.container[vCount][0] = vector.x;
            toReturn.container[vCount][1] = vector.y;
            vCount++;
        }

        return toReturn;
    }

    multiplyVector2d(vector2d) {
        if (!this.canMultiplyVector2d) throw new Exception('unable to multiply due to dimensions');
        let x = 0;
        let y = 0;
        for (let vectorIdx=0; vectorIdx<this.container.length; vectorIdx++) {
            x += this.container[vectorIdx][0] * vector2d.x + this.container[vectorIdx][0] * vector2d.y;
            y += this.container[vectorIdx][1] * vector2d.x + this.container[vectorIdx][1] * vector2d.y;
            console.log(this.container[vectorIdx][0],this.container[vectorIdx][1], vector2d);
        }

        return new Vector2d(x,y);
    }
}

export default Matrix2d;  