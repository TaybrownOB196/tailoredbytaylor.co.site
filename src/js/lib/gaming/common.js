import Vector2d from "./Vector2d";

const gravity = 9.8;
const dragValue = 0.47;
const fluidDensity = 1.29;
let index = 0;

class IDGenerator {
    static GetID() {
        return index++;
    }
}

class Rgb {
    constructor(r, g, b) {
        this.r = r % 256;
        this.g = g % 256;
        this.b = b % 256;
    }

    toRgbString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    toHexString() {
        return `#${this.r.toString(16).padStart(2, '0')}${this.g.toString(16).padStart(2, '0')}${this.b.toString(16).padStart(2, '0')}`;
    }

    mix(rgb) {
        let r = (this.r + rgb.r)/2;
        let g = (this.g + rgb.g)/2;
        let b = (this.b + rgb.b)/2;
        return new Rgb(r, g, b);
    }
}

class LayeredCanvas {
    constructor(containerElementID, layerCount=2, canvasWidth=300, canvasHeight=150, context='2d') {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.canvases = [];
        let container = document.getElementById(containerElementID);
        this.offsetTop = container.offsetTop;
        this.offsetLeft = container.offsetLeft;
        container.style.position = 'relative';
        for (let idx=0; idx<layerCount; idx++) {
            let canvas = document.createElement('canvas');
            canvas.id = `${containerElementID}|canvas|${idx}`;
            canvas.style.zIndex = idx + 1;
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.style.width = this.canvasWidth;
            canvas.style.height = this.canvasHeight;
            canvas.style.position = 'absolute';
            if (idx == 0) {
                canvas.style.background = 'white';
            } else {
                canvas.style.background = '#ffffff00';
            }
            container.append(canvas);
            this.canvases.push({
                canvas: canvas,
                context: canvas.getContext(context)
            });
        }
    }

    getOffsetTopLeft() {
        return { top: this.offsetTop, left: this.offsetLeft };
    }

    getWidthHeight() {
        return { width: this.canvases[0].canvas.clientWidth, height: this.canvases[0].canvas.clientHeight }
    }

    getContext(index) {
        if (index >= this.canvases.length || index < 0) throw 'index out of range'
        return this.canvases[index].context;
    }
}

class Point2d {
    constructor(x,y) {
        this.x = x;
        this.y = y;
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

    subtract(other) {
        return new Point2d(other.x - this.x, other.y - this.y);
    }

    static getQuadraticBezierVector(point0, point1, point2, fraction) {
        let v0p = Math.pow(1 - fraction, 2);
        let v0 = new Point2d(v0p * point0.x, v0p * point0.y);

        let v1p = 2 * (1 - fraction) * fraction;
        let v1 = new Point2d(v1p * point1.x, v1p * point1.y);

        let v2p = Math.pow(fraction, 2);
        let v2 = new Point2d(v2p * point2.x, v2p * point2.y);

        return new Point2d(
            v0.x + v1.x + v2.x,
            v0.y + v1.y + v2.y
        );
    }

    static getQuadraticBezierVectorEnd(point0, point1, fraction) {
        return new Point2d(
            (Math.pow(1-fraction, 2) * point0.x + 2 * fraction * (1-fraction) * fraction * point1.x)/Math.pow(-fraction, 2),
            (Math.pow(1-fraction, 2) * point0.y + 2 * fraction * (1-fraction) * fraction * point1.y)/Math.pow(-fraction, 2));
    }
}

class Circle {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
        this.diameter = radius * 2;
        this.area = (Math.PI * Math.pow(radius,2)) / 10000;
    }

    contains(point2d) {
        return false;
    }
}

class Gameobject {
    constructor() {
        this.ID = IDGenerator.GetID();
    }
}

class Spritesheet {
    constructor(sheet, imageElem = null) {
        this.sheet = new Image();
        if (imageElem) {
            this.sheet = imageElem;
        } else {
            this.sheet.src = sheet;
        }
        this.clipMap = {};
    }

    draw(context, rect, clipRect) {
        context.drawImage(
            this.sheet, 
            clipRect.position.x, clipRect.position.y, clipRect.width, clipRect.height,
            rect.position.x, rect.position.y, rect.width, rect.height);
    }
}

class Fill {
    constructor(colorHex) {
        this.color = colorHex;
    }

    draw(context, rect) {
        context.fillStyle = this.color;
        context.fillRect(rect.position.x, rect.position.y, rect.width, rect.height);
    }
}

class Text {
    constructor(value, font='16px Arial', colorHex='#ffffff') {
        this.value = value;
        this.font = font;
        this.fillStyle = colorHex;
    }

    getWidth(context) {
        // console.log(context.measureText(this.value));
        return context.measureText(this.value).width;
    }

    draw(context, position) {
        context.font = this.font;
        context.fillStyle = this.fillStyle;
        context.fillText(this.value, position.x, position.y);
    }
}

class Fillobject extends Gameobject {
    constructor(rect, colorHex) {
        super(rect);
        this.fill = new Fill(colorHex);
    }

    setPosition(position) {
        this.position = position;
        this.rect.position = position;
    }

    update(timeDelta, context) {
        this.position.x += this.velocity.x * timeDelta;        
        this.position.y += this.velocity.y * timeDelta; 
        this.fill.draw(context, this.rect);
    }
}

class PhysicsCircle2d extends Gameobject {
    constructor(circle, mass, e) {
        super(circle.position);
        this.circle = circle;
        this.mass = mass;
        this.e = -e;
    }

    circle2dCollision(circle2d) {
        if(this.position.x != circle2d.position.x-.01 && this.position.y != circle2d.position.y){
			//quick check for potential collisions using AABBs
			if(this.position.x + this.circle.radius + circle2d.circle.radius > circle2d.position.x
				&& this.position.x < circle2d.position.x + this.circle.radius + circle2d.circle.radius
				&& this.position.y + this.circle.radius + circle2d.circle.radius > circle2d.position.y
				&& this.position.y < circle2d.position.y + this.circle.radius + circle2d.circle.radius){
				
				//pythagoras 
				var distX = this.position.x - circle2d.position.x;
				var distY = this.position.y - circle2d.position.y;
				var d = Math.sqrt((distX) * (distX) + (distY) * (distY));
	
				//checking circle vs circle collision 
				if(d < this.circle.radius + circle2d.circle.radius){
					var nx = (circle2d.position.x - this.position.x) / d;
					var ny = (circle2d.position.y - this.position.y) / d;
					var p = 2 * (this.velocity.x * nx + this.velocity.y * ny - circle2d.velocity.x * nx - circle2d.velocity.y * ny) / (this.mass + circle2d.mass);

					// calulating the point of collision 
					var colPointX = ((this.position.x * circle2d.circle.radius) + (circle2d.position.x * this.circle.radius)) / (this.circle.radius + circle2d.circle.radius);
					var colPointY = ((this.position.y * circle2d.circle.radius) + (circle2d.position.y * this.circle.radius)) / (this.circle.radius + circle2d.circle.radius);
					
                    //stoping overlap 
                    this.setPosition(new Point2d(
                        colPointX + this.circle.radius * (this.position.x - circle2d.position.x) / d,
                        colPointY + this.circle.radius * (this.position.y - circle2d.position.y) / d));
                    circle2d.setPosition(new Point2d(
					    colPointX + circle2d.circle.radius * (circle2d.position.x - this.position.x) / d,
					    colPointY + circle2d.circle.radius * (circle2d.position.y - this.position.y) / d));

					//updating velocity to reflect collision 
					this.velocity.x -= p * this.mass * nx;
					this.velocity.y -= p * this.mass * ny;
					circle2d.velocity.x += p * circle2d.mass * nx;
					circle2d.velocity.y += p * circle2d.mass * ny;
				}
			}
		}
    }

    setPosition(position) {
        this.position = position;
        this.circle.position = position;
    }

    update(timeDelta, gameRect) {
        var fx = -0.5 * dragValue * fluidDensity * 
            this.circle.area * this.velocity.x * this.velocity.x * 
            (this.velocity.x / Math.abs(this.velocity.x));
        var fy = -0.5 * dragValue * fluidDensity * 
            this.circle.area * this.velocity.y * this.velocity.y * 
            (this.velocity.y / Math.abs(this.velocity.y));

        fx = (isNaN(fx)? 0 : fx);
        fy = (isNaN(fy)? 0 : fy);

        //Calculating the accleration
        //F = ma or a = F/m
        var ax = fx / this.mass;
        var ay = gravity + (fy / this.mass);

        //Calculating the velocity 
        this.velocity.x += ax * timeDelta;
        this.velocity.y += ay * timeDelta;

        //Calculating the position
        let newX = this.position.x + this.velocity.x * timeDelta;
        let newY = this.position.y += this.velocity.y * timeDelta;

        if(newX > gameRect.width - this.circle.radius){
            this.velocity.x *= this.e;
            this.setPosition(new Point2d(gameRect.width - this.circle.radius, this.position.y));
        } if(newY > gameRect.height - this.circle.radius){
            this.velocity.y *= this.e;
            this.setPosition(new Point2d(this.position.x, gameRect.height - this.circle.radius));
        } if(newX < this.circle.radius){
            this.velocity.x *= this.e;
            this.setPosition(new Point2d(this.circle.radius, this.position.y));
        } if(newY < this.circle.radius){
            this.velocity.y *= this.e;
            this.setPosition(new Point2d(this.position.x, this.circle.radius));
        }
    }
}

class PhysicsRect2d extends Gameobject {
    constructor(rect, mass=100) {
        super(rect.position);
        this.rect = rect;
        this.mass = mass;
    }
    
    setPosition(position) {
        this.position = position;
        this.rect.position = position;
    }

    areColliding(otherRect) {
        return this.areCollidingX(otherRect) && this.areCollidingY(otherRect);
    }

    areCollidingX(otherRect) {
        return this.rect.position.x < otherRect.position.x + otherRect.width &&
        this.rect.position.x + this.rect.width > otherRect.position.x;
    }
    
    areCollidingY(otherRect) {
        return this.rect.position.y < otherRect.position.y + otherRect.height &&
            this.rect.height + this.rect.position.y > otherRect.position.y;
    }
    
    rect2dCollision(rect) {
        // console.log(rect);
        if(this.position.x + this.rect.width + rect.rect.width > rect.position.x
            && this.position.x < rect.position.x + this.rect.width + rect.rect.width
            && this.position.y + this.rect.height + rect.rect.height > rect.position.y
            && this.position.y < rect.position.y + this.rect.height + rect.rect.height){
            
            //pythagoras 
            var distX = this.position.x - rect.position.x;
            var distY = this.position.y - rect.position.y;
            var d = Math.sqrt((distX) * (distX) + (distY) * (distY));

            var nx = (rect.position.x - this.position.x) / d;
            var ny = (rect.position.y - this.position.y) / d;
            var p = 2 * (this.velocity.x * nx + this.velocity.y * ny - rect.velocity.x * nx - rect.velocity.y * ny) / (this.mass + rect.mass);

            // calulating the point of collision 
            var colPointX = ((this.position.x * rect.rect.width) + (rect.position.x * this.rect.width)) / (this.rect.width + rect.rect.width);
            var colPointY = ((this.position.y * rect.rect.height) + (rect.position.y * this.rect.height)) / (this.rect.height + rect.rect.height);
            
            //stoping overlap 
            this.setPosition(new Point2d(
                (colPointX + this.rect.width * (this.position.x - rect.position.x) / d),
                (colPointY + this.rect.height * (this.position.y - rect.position.y) / d)));
            rect.setPosition(new Point2d(
                (colPointX + rect.rect.width * (rect.position.x - this.position.x) / d),
                (colPointY + rect.rect.height * (rect.position.y - this.position.y) / d)));

            //updating velocity to reflect collision 
            this.velocity.x -= p * this.mass * nx;
            this.velocity.y -= p * this.mass * ny;

            rect.velocity.x += p * rect.mass * nx;
            rect.velocity.y += p * rect.mass * ny;
        }
    }

    update(timeDelta, gameRect) {
        let e = -.07;
        var fx = -0.5 * dragValue * fluidDensity * 
            this.rect.area * this.velocity.x * this.velocity.x * 
            (this.velocity.x / Math.abs(this.velocity.x));
        var fy = -0.5 * dragValue * fluidDensity * 
            this.rect.area * this.velocity.y * this.velocity.y * 
            (this.velocity.y / Math.abs(this.velocity.y));
        
        fx = (isNaN(fx)? 0 : fx);
        fy = (isNaN(fy)? 0 : fy);
        
        //Calculating the accleration
        //F = ma or a = F/m
        var ax = fx / this.mass;
        var ay = gravity + (fy / this.mass);
        this.velocity.x += ax * timeDelta;
        this.velocity.y += ay * timeDelta;
        
        this.setPosition(new Point2d(
            this.rect.position.x + this.velocity.x,
            this.rect.position.y + this.velocity.y));
        
        if(this.rect.position.x > gameRect.width - this.rect.width){
            this.velocity.x *= e;
            this.setPosition(new Point2d(gameRect.width - this.rect.width, this.rect.position.y));
        } if(this.rect.position.y > gameRect.height - this.rect.height){
            this.velocity.y *= e;
            this.setPosition(new Point2d(this.rect.position.x, gameRect.height - this.rect.height));
        } if(this.rect.position.x < this.rect.width){
            this.velocity.x *= e;
            this.setPosition(new Point2d(0, this.rect.position.y));
        } if(this.rect.position.y < this.rect.height){
            this.velocity.y *= e;
            this.setPosition(new Point2d(this.rect.position.x, this.rect.height));
        }
    }
}

class FillPhysicsCircle extends PhysicsCircle2d {
    constructor(circle, mass, e, color) {
        super(circle, mass, e);
        this.color = color;
    }

    _draw(context) {
        let cPath = new Path2D();
        cPath.arc(this.position.x, this.position.y, this.circle.radius, 0, 2 * Math.PI, true);
        context.fillStyle = this.color;
        context.fill(cPath);
    }

    update(timeDelta, context, gameRect) {
        super.update(timeDelta, gameRect); 
        this._draw(context);
    }
}

class FillPhysicsRect extends PhysicsRect2d {
    constructor(rect, fill) {
        super(rect);
        this.fill = fill;
    }

    update(timeDelta, context, gameRect) {
        super.update(timeDelta, gameRect); 
        this.fill.draw(context, this.rect);
    }
}

export {
    LayeredCanvas,
    Rgb,
    Gameobject,
    PhysicsRect2d,
    PhysicsCircle2d,
    Circle,
    Fillobject,
    Fill,
    Text,
    FillPhysicsCircle,
    FillPhysicsRect,
    Spritesheet,
    Point2d,
}