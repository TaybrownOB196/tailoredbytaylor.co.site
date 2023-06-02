import { Point2d } from './common';
import Vector2d from './Vector2d';

//TODO: Move SAT logic to own class
class Rect {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.area = width * height;
    }

    contains(point2d) {
        return this.position.x <= point2d.x && point2d.x <= this.position.x + this.width &&
               this.position.y <= point2d.y && point2d.y <= this.position.y + this.height;
    }

    getVertices() {
        return [
            new Point2d(this.position.x, this.position.y),
            new Point2d(this.position.x + this.width, this.position.y),
            new Point2d(this.position.x + this.width, this.position.y + this.height),
            new Point2d(this.position.x, this.position.y + this.height)
        ];
    }

    getEdges() {
        let toReturn = [];
        let vertices = this.getVertices();
        for(let idx=0; idx<vertices.length; idx++) {
            let idxB = idx + 1 < vertices.length ? idx + 1 : 0;

            toReturn.push(
                new Vector2d(
                    vertices[idxB].x - vertices[idx].x,
                    vertices[idxB].y - vertices[idx].y));
        }

        return toReturn;
    }

    bottomRight() {
        return new Point2d(
            this.position.x + this.width, 
            this.position.y + this.height);
    }

    center() {
        return new Point2d(
            this.position.x + this.width/2,
            this.position.y + this.height/2);
    }

    projectInAxis(axisVector) {
        let vertices = this.getVertices();
        let min = Math.min();
        let max = Math.max();
        for(let idx=0; idx< vertices.length; idx++) {
            let xB = vertices[idx].x;
            let yB = vertices[idx].y;
            let proj = Vector2d.getDotProduct(axisVector, new Vector2d(xB, yB));
            max = Math.max(proj, max)
            min = Math.min(proj, min);
        }

        return { min, max };
    }

    lineIntersects(p0x, p0y, p1x, p1y) {
        let left =   lineLine(p0x,p0y,p1x,p1y, this.position.x,this.position.y,this.position.x, this.position.y+this.height);
        let right =  lineLine(p0x,p0y,p1x,p1y, this.position.x + this.width,this.position.y, this.position.x+this.width,this.position.y+this.height);
        let top =    lineLine(p0x,p0y,p1x,p1y, this.position.x,this.position.y, this.position.x+this.width,this.position.y);
        let bottom = lineLine(p0x,p0y,p1x,p1y, this.position.x,this.position.y+this.height, this.position.x+this.width,this.position.y+this.height);
  
        return (left || right || top || bottom);
        
        function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
            let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
            let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        
            return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
        }
    }
  
  
  // LINE/LINE

    checkCollision(other) {
        let depth = Math.min();
        let normal = null;

        let aEdges = this.getEdges();
        let bEdges = other.getEdges();
        let edges = aEdges.concat(bEdges);
        for (let idx=0; idx<edges.length; idx++) {
            let perp = edges[idx].getPerpendicular();
            let minMaxA = this.projectInAxis(perp);
            let minMaxB = other.projectInAxis(perp);

            if (minMaxA.min >= minMaxB.max || minMaxB.min >= minMaxA.max) {
                return null;
            }

            let axisDepth = Math.min(minMaxB.max - minMaxA.min, minMaxA.max - minMaxB.min);
            if (axisDepth < depth) {
                depth = axisDepth;
                normal = perp;
            }
        }

        let _depth = depth / normal.getLength();
        let _normal = normal.getNormalize();
        
        let center = this.center();
        let bCenter = other.center();
        
        if (Vector2d.getDotProduct(bCenter.subtract(center), normal) < 0) {
            _normal = new Vector2d(-normal.x, -normal.y);
        }
        
        return { depth: _depth, normal: _normal };
    }
}

export default Rect;