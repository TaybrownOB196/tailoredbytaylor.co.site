import Transformation2d from "../Transformation2d";
import Vector2d from "../Vector2d";

class NeedleMeter {
    constructor(position, radius, maxValue=100,initValue=0, color=null, dotSize=null, needleColor=null) {
        this.position = position;
        this.radius = radius;
        this.minValue = 0;
        this.maxValue = maxValue;
        this.value = initValue;

        this.color = color || '#000';
        this.dotSize = dotSize || 2;
        this.needleColor = needleColor || '#ff0000';
    }

    updateValue(value) {
        if (value < this.minValue) {
            value = this.minValue;
        } else if (value > this.maxValue) {
            value = this.maxValue;
        }
        this.value = value;
    }

    draw(context) {
        let radians = (this.value/this.maxValue * Math.PI);

        let v0 = Vector2d.pointsToVector(
            {x:this.position.x, y:this.position.y}, 
            {x:this.position.x - this.radius, y:this.position.y});
        
        // draw arc
        context.strokeStyle = this.color;
        context.beginPath();
        context.arc(this.position.x,this.position.y, this.radius, Math.PI, 0);
        context.stroke();

        //draw needle
        context.strokeStyle = this.needleColor;
        context.beginPath();
        context.moveTo(this.position.x - context.lineWidth, this.position.y - context.lineWidth);
        let res = Transformation2d.rotateVector2dAroundPoint(v0, radians, {x:this.position.x,y:this.position.y});
        context.lineTo(
            res.x,
            res.y);
        context.stroke();

        //draw needle center
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.dotSize, Math.PI, 0);
        context.fill();
    }
}

export default NeedleMeter;