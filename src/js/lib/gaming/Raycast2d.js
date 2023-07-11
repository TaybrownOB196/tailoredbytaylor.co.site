export default class Raycast2d {
    constructor(vector2d0, vector2d1, lineWidth=2, lineStyle='red') {
        this.v0 = vector2d0;
        this.v1 = vector2d1;
        this.lineWidth = lineWidth;
        this.lineStyle = lineStyle;
    }

    update(v0, v1) {
        this.v0 = v0;
        this.v1 = v1;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.lineStyle;
        context.lineWidth = this.lineWidth;
        context.moveTo(this.v0.x, this.v0.y);
        context.lineTo(this.v1.x, this.v1.y);
        context.stroke();
    }
}