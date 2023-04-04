import Matrix2d from "./Matrix";
import Vector2d from "./Vector2d";

class Transformation2d {

    static rotateVector2dAroundPointCCW(vector2d, degrees, point) {
        return Transformation2d.rotateVector2dAroundPoint(vector2d, -degrees, point);
    }

    static rotateVector2dAroundPoint(vector2d, degrees, point) {
        let xP = -point.x;
        let yP = -point.y;
        let res = Transformation2d.rotateVector2d(vector2d, degrees);
        return new Vector2d(res.x - xP, res.y - yP);
    }

    static rotateVector2dAroundPoint(vector2d, degrees, point) {
        let xP = -point.x;
        let yP = -point.y;
        const sin = Math.sin(degrees);
        const cos = Math.cos(degrees);
        let rotationMatrix = new Matrix2d();
        rotationMatrix.container[0][0] = cos;
        rotationMatrix.container[0][1] = -sin;
        rotationMatrix.container[1][0] = sin;
        rotationMatrix.container[1][1] = cos;

        let res = rotationMatrix.multiplyVector2d(vector2d);
        return new Vector2d(res.x - xP, res.y - yP);
    }

    static rotateVector2dCCW(vecctor2d, degrees) {
        return Transformation2d.rotateVector2d(vecctor2d, -degrees);
    }

    static rotateVector2d(vector2d, degrees) {
        let radians = degrees * Math.PI/180
        return _();

        function _() {
            const sin = Math.sin(radians);
            const cos = Math.cos(radians);
            let rotationMatrix = new Matrix2d();
            rotationMatrix.container[0][0] = cos;
            rotationMatrix.container[0][1] = -sin;
            rotationMatrix.container[1][0] = sin;
            rotationMatrix.container[1][1] = cos;

            return rotationMatrix.multiplyVector2d(vector2d);
        }
    }

    static rotateVector2dCCW(vecctor2d, degrees) {
        return Transformation2d.rotateVector2d(vecctor2d, -degrees);
    }
}

Transformation2d.rotateVector2d(new Vector2d(2,3), 90);//expect (3,-2)

export default Transformation2d;