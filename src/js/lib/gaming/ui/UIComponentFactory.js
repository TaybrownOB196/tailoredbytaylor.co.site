import Rect from "../Rect";
import { UIComponent, UIComponentSettings } from "./UIComponent";

class TextboxComponentSettings extends UIComponentSettings {
    constructor(bgHex, brdrHex, lineWidth, text, font, fontHex) {
        super('textbox', bgHex, brdrHex, lineWidth);
        this.text = text;
        this.font = font;
        this.fontHex = fontHex;
    }
}

class ButtonComponentSettings extends UIComponentSettings {
    constructor(bgHex, brdrHex, lineWidth, text, font, fontHex, onClick, altBgHex, altBrdrHex) {
        super('button', bgHex, brdrHex, lineWidth, text, font);
        this.text = text;
        this.font = font;
        this.fontHex = fontHex;
        this.onClick = onClick;
        this.altBgHex = altBgHex;
        this.altBrdrHex = altBrdrHex;
    }
}

class Textbox extends UIComponent {
    constructor(textSettings) {
        super(textSettings);
    }

    draw(context, position, width, height) {
        if (!this.isShowing) return;
        super.draw(context, position, width, height);

        context.font = this.settings.font;
        context.fillStyle = this.settings.fontHex;
        let dims = this.getTextDimensions(context);
        context.fillText(this.settings.text, 
            position.x + ((width - dims.w) / 2), 
            position.y + ((height - dims.h) / 2));
    }

    getTextDimensions(context) {
        let metrics = context.measureText(this.settings.text);
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        return {w: metrics.width, h: actualHeight};
    }
}

class Button extends Textbox {
    constructor(buttonSettings) {
        super(buttonSettings);
        this.position = null;
        this.width = 0;
        this.height = 0;
        this.isHover = false;
    }

    draw(context, position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
        if (!this.isShowing) return;

        context.beginPath();
        context.lineWidth = this.settings.lineWidth;
        context.strokeStyle = !this.isHover ? this.settings.border : this.settings.altBrdrHex;
        context.rect(
            position.x, 
            position.y, 
            width, 
            height);
        context.stroke();

        context.fillStyle = !this.isHover ? this.settings.background : this.settings.altBgHex;
        context.fillRect(
            position.x, 
            position.y, 
            width, 
            height);

        context.font = this.settings.font;
        context.fillStyle = this.settings.fontHex;
        let dims = this.getTextDimensions(context);
        context.fillText(this.settings.text, 
            position.x + ((width - dims.w) / 2), 
            position.y + ((height - dims.h) / 2));
    }

    contains(position) {
        return this.isShowing && new Rect(this.position, this.width, this.height)
            .contains(position);
    }

    handleClick() {
        if (this.settings.onClick) {
            this.settings.onClick();
        }
    }
}

class UIComponentFactory {
    static createComponent(componentSettings) {
        switch(componentSettings.type) {
            case 'textbox':
                return new Textbox(componentSettings);

            case 'button':
                return new Button(componentSettings);

            default:
                throw new Error(`no such ${componentSettings.type} component exists`);
        }
    }
}

export {
    TextboxComponentSettings,
    ButtonComponentSettings,
    UIComponentFactory,
} 