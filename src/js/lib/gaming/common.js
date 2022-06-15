const gravity = 1;
let index = 0;

class IDGenerator {
    static GetID() {
        return index++;
    }
}

class Vector2d {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    static getLinearBezierVector(vector0, vector1, fraction) {
        return new Vector2d(
            vector0.x + (fraction * (vector1.x - vector0.x)),
            vector0.y + (fraction * (vector1.y - vector0.y)));
    }

    static getQuadraticBezierVector(vector0, vector1, vector2, fraction) {
        let v0p = Math.pow(1 - fraction, 2);
        let v0 = new Vector2d(v0p * vector0.x, v0p * vector0.y);

        let v1p = 2 * (1 - fraction) * fraction;
        let v1 = new Vector2d(v1p * vector1.x, v1p * vector1.y);

        let v2p = Math.pow(fraction, 2);
        let v2 = new Vector2d(v2p * vector2.x, v2p * vector2.y);

        return new Vector2d(
            v0.x + v1.x + v2.x,
            v0.y + v1.y + v2.y
        );
    }

    static getQuadraticBezierVectorEnd(vector0, vector1, vector2, fraction) {
        let v0p = Math.pow(1 - fraction, 2);
        let v0 = new Vector2d(v0p * vector0.x, v0p * vector0.y);

        let v1p = 2 * (1 - fraction) * fraction;
        let v1 = new Vector2d(v1p * vector1.x, v1p * vector1.y);

        let v2p = Math.pow(fraction, 2);
        let v2 = new Vector2d(v2p * vector2.x, v2p * vector2.y);
        
        return new Vector2d(
            v0.x + v1.x + v2.x,
            v0.y + v1.y + v2.y
        );
    }
}

class Rect {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    contains(vector2d) {
        return this.position.x <= vector2d.x && vector2d.x <= this.position.x + this.width &&
               this.position.y <= vector2d.y && vector2d.y <= this.position.y + this.height;
    }

    bottomRight() {
        return new Vector2d(this.position.x + this.width, this.position.y + this.height);
    }
}

class Gameobject {
    constructor(position) {
        this.ID = IDGenerator.GetID();
        this.position = position;
        this.velocity = new Vector2d(0,0);
    }
    
    update(timeDelta) {
        this.position.x += this.velocity.x * timeDelta;        
        this.position.y += this.velocity.y * timeDelta; 
    }

    setPosition(position) {
        this.position = position;
    }
}

class Spritesheet {
    constructor(sheet) {
        this.sheet = new Image();
        this.sheet.src = sheet;
        this.clipMap = {};
    }

    draw(context, rect, clipRect) {
        context.drawImage(
            this.sheet, 
            clipRect.position.x, clipRect.position.y, clipRect.width, clipRect.height,
            rect.position.x, rect.position.y, rect.width, rect.height);
    }
}

class Sprite {
    constructor(colorHex) {
        this.color = colorHex;
    }

    draw(context, rect) {
        context.fillStyle = this.color;
        context.fillRect(rect.position.x, rect.position.y, rect.width, rect.height);
    }
}

class Spriteobject extends Gameobject {
    constructor(rect, sprite) {
        super(rect);
        this.sprite = sprite;
    }

    setPosition(position) {
        super.setPosition(position);
        this.rect.position = position;
    }

    update(timeDelta, context, gameRect) {
        this.sprite.draw(context, this.rect);
        super.update(timeDelta, gameRect); 
    }
}

class Physics2d extends Gameobject {
    constructor(rect, isGrounded=false, isAffectedByGravity=true) {
        super(rect.position);
        this.rect = rect;

        this.isGrounded = isGrounded;
        this.isAffectedByGravity = isAffectedByGravity;
    }

    setPosition(position) {
        super.setPosition(position);
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

    update(timeDelta, gameRect) {
        super.update(timeDelta);
        if (!this.isGrounded && this.rect.position.y <= 0) {
            this.rect.position.y = 0;
        }

        if (this.isAffectedByGravity && !this.isGrounded) {
            this.velocity.y += gravity;
        }

        if (this.rect.position.x <= 0 || this.rect.bottomRight().x > gameRect.bottomRight().x) {
            this.velocity.x = 0;
        }

        if (this.rect.bottomRight().y >= gameRect.bottomRight().y) {
            this.rect.position.y = gameRect.bottomRight().y - this.rect.height;
        }
    }
}

class Spritephysicsobject extends Physics2d {
    constructor(rect, sprite) {
        super(rect);
        this.sprite = sprite;
    }

    update(timeDelta, context, gameRect) {
        this.sprite.draw(context, this.rect);
        super.update(timeDelta, gameRect); 
    }
}

export {
    Gameobject,
    Physics2d,
    Rect,
    Sprite,
    Spriteobject,
    Spritephysicsobject,
    Spritesheet,
    Vector2d,
}