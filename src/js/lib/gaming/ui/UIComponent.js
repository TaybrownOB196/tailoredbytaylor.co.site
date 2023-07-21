class UIBase {
    constructor(settings) {
        this.settings = settings;
        this.isShowing = true;
    }
    
    toggle(isShowing) {
        this.isShowing = isShowing;
    }
}

class UIComponent extends UIBase {
    constructor(settings) {
        super(settings);
    }

    draw(context, position, width, height) {
        if (!this.isShowing) return;

        context.beginPath();
        context.lineWidth = this.settings.lineWidth;
        context.strokeStyle = this.settings.border;
        context.rect(
            position.x, 
            position.y, 
            width, 
            height);
        context.stroke();

        context.fillStyle = this.settings.background;
        context.fillRect(
            position.x, 
            position.y, 
            width, 
            height);
    }
}

class UIComponentSettings {
    constructor(type, bgHex, brdrHex, lineWidth) {
        this.type = type;
        this.background = bgHex;
        this.border = brdrHex;
        this.lineWidth = lineWidth;
    }
}

export {
    UIComponent,
    UIComponentSettings
};