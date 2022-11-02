import { Text, Point2d } from '../common';

const PADDINGX = 4;
const PADDINGY = 4;

class Hud {
    constructor(position, width, height, initialDisplay={fps: ''}, colorHex='#00ff00') {
        this.position = position;
        this.colorHex = colorHex;
        this.width = width;
        this.height = height;
        this.textDict = initialDisplay;
        this.fontHeight = (height / Object.keys(initialDisplay).length - 1) - PADDINGY;
        this.font = `${this.fontHeight}px Arial`;
        for (let key in initialDisplay) {
            this.textDict[key] = new Text(initialDisplay[key], this.font, this.colorHex);
        }
    }

    update(updateDict) {
        for (let key in updateDict) {
            if (this.textDict.hasOwnProperty(key)) {
                this.textDict[key].value = updateDict[key];
            }
        }
    }

    draw(context) {
        let count = 0;
        for (let key in this.textDict) {
            this.textDict[key].draw(context, 
                new Point2d(
                    this.position.x + PADDINGX,
                    this.position.y + count * this.fontHeight
                    ));
                count++;
        }
    }
}

export default Hud;