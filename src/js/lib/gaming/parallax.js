import { Spritesheet, Vector2d, Rect } from './common';

class ParallaxBase {
    constructor(sheet, rect, clipRect, speed) {
        this.sheet = sheet;
        this.rect = rect;
        this.clipRect = clipRect;
        this.speed = speed;
    }

    update(timeDelta) {}

    // update(delta) {
    //     let speedDelta = Math.round(delta * this.speed);
    //     let _height = this.rects[0].height;
    //     let otherIndex = this.index == 0 ? 1 : 0;
    //     if (this.rects[this.index].position.y >= _height) {
    //         this.rects[this.index].position.y = this.rects[otherIndex].position.y - _height;
    //         this.index = otherIndex;
    //         this.rects[otherIndex].position.y += speedDelta;
    //     } else {
    //         this.rects[this.index].position.y += speedDelta;
    //         this.rects[otherIndex].position.y = this.rects[this.index].position.y - this.rects[otherIndex].height;
    //     }
    // }

    draw(context) {
        this.sheet.draw(context, this.rect, this.clipRect);
    }
}

class ParallaxX extends ParallaxBase {
    constructor(sheet, rect, clipRect, speed) {
        super(sheet, rect, clipRect, speed);
    }

    update(timeDelta) {
        if (this.rect.position.x <= -this.clipRect.width) {
            this.rect.position.x = 0;
        }
        this.rect.position.x = this.rect.position.x - this.speed * timeDelta;
    }

    draw(context) {
        super.draw(context);
        this.sheet.draw(
            context, 
            new Rect(new Vector2d(this.rect.position.x + this.clipRect.width, this.rect.position.y), this.rect.width, this.rect.height),
            new Rect(new Vector2d(this.clipRect.position.x , this.clipRect.position.y), this.clipRect.width, this.clipRect.height));
    }
}

class ParallaxY extends ParallaxBase {
    constructor(sheet, rect, clipRect, speed) {
        super(sheet, rect, clipRect, speed);
    }

    update(timeDelta) {
        if (this.rect.position.y <= -this.clipRect.height) {
            this.rect.position.y = 0;
        }
        this.rect.position.y = this.rect.position.y - this.speed * timeDelta;
    }

    draw(context) {
        super.draw(context);
        context.drawImage(this.sheet, this.clipRect.position.x, this.clipRect.position.y, this.clipRect.width, this.clipRect.height,
            this.rect.position.x, this.rect.position.y + this.clipRect.height, this.rect.width, this.rect.height);
    }
}

export {
    ParallaxX,
    ParallaxY,
}