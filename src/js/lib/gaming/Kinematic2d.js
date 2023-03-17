import Vector2d from "./Vector2d";

class Kinematic2d {
    static getPositionOverTime(initPos, initVelocity, accleration, time) {
        return new Vector2d(
            initPos.x + initVelocity.x * time + (1/2) * accleration * Math.pow(time, 2),
            initPos.y + initVelocity.y * time + (1/2) * accleration * Math.pow(time, 2)
        );
    }

    static getAcceleration(initPos, finalPos, initVelocity, time) {
        return new Vector2d(
            2*(finalPos.x - initPos.x - initVelocity.x * time) / Math.pow(time, 2),
            2*(finalPos.y - initPos.y - initVelocity.y * time) / Math.pow(time, 2)
        );
    }

    static getAverageVelocity(initVelocity, finalVelocity) {
        return new Vector2d(
            (initVelocity.x + finalVelocity.x) / 2,
            (initVelocity.y + finalVelocity.y) / 2
        );
    }

    static getVelocityOverTime(initVelocity, accleration, time) {
        return new Vector2d(
            initVelocity.x + accleration * time,
            initVelocity.y + accleration * time);
    }
}

export default Kinematic2d;