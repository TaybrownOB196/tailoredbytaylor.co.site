import Vector2d from "../Vector2d";
import Rect from "../Rect";
import { UIComponent, UIComponentSettings } from "./UIComponent";

const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';

class UIContainerSettings extends UIComponentSettings {
    constructor(type, width, height, bgHex, brdrHex, lineWidth, orientation, componentGap=0, insetX=0, insetY=0) {
        super(type, bgHex, brdrHex, lineWidth);
        this.width = width;
        this.height = height;
        this.orientation = orientation;
        this.componentGap = componentGap;
        this.insetX = insetX;
        this.insetY = insetY;
    }
}

class UIContainer extends UIComponent {
    constructor(position, settings) {
        super(position, settings);
        this.componentSettingsMap = {};
        this.componentMap = {};
        this.componentWidth = 0;
        this.componentHeight = 0;
        this.isBuilt = false;
    }

    toggle(isShowing) {
        if (!this.isBuilt) throw new Error('uicontainer never built');
        super.toggle(isShowing);
        Object
            .values(this.componentMap)
            .forEach(c => {
                c.toggle(isShowing);
            });
    }

    addComponent(key, componentSettings) {
        if (this.isBuilt) throw new Error('uicontainer already built');
        this.componentSettingsMap[key] = componentSettings;
    }

    getComponent(key) {
        return this.componentMap[key];
    }

    build() {
        let componentCount = Object.keys(this.componentSettingsMap).length;
        let horiMod = (this.settings.orientation == HORIZONTAL ? 1 : 0);
        let vertMod = (this.settings.orientation == VERTICAL ? 1 : 0);
        this.componentWidth = (this.settings.width
            - (this.settings.insetX * 2)
            - ((componentCount-1) * this.settings.componentGap * horiMod)
                ) / (this.settings.orientation == HORIZONTAL ? componentCount : 1);
        this.componentHeight = (this.settings.height
            - (this.settings.insetY * 2)
            - ((componentCount-1) * this.settings.componentGap * vertMod)
                ) / (this.settings.orientation == VERTICAL ? componentCount : 1);
        for (let key in this.componentSettingsMap) {
            this.componentMap[key] =
                UIComponentFactory.createComponent(this.componentSettingsMap[key]);
        }

        this.isBuilt = true;
    }

    draw(context, position) {
        if (!this.isBuilt) throw new Error('uicontainer never built');
        if (!this.isShowing) return;

        super.draw(context, position, this.settings.width, this.settings.height);
        let idx = 0;
        for (let key in this.componentMap) {
            let horiMod = (this.settings.orientation == HORIZONTAL ? 1 : 0);
            let vertMod = (this.settings.orientation == VERTICAL ? 1 : 0);

            let componentOffsetX = (idx * this.componentWidth * horiMod) + 
                (idx * this.settings.componentGap * horiMod) +
                (this.settings.insetX);
            let componentOffsetY = (idx * this.componentHeight * vertMod) + 
                (idx * this.settings.componentGap * vertMod) +
                (this.settings.insetY);
            let componentPosition = new Vector2d(
                position.x + componentOffsetX,
                position.y + componentOffsetY);
            let component = this.componentMap[key];
            component.draw(context, componentPosition, this.componentWidth, this.componentHeight);
            idx++;
        }
    }
}

class Modal extends UIContainer {
    constructor(position, modalSettings) {
        super(position, modalSettings);
    }

    contains(position) {
        for (let key in this.componentMap) {
            let component = this.componentMap[key];
            if (component.isShowing && component instanceof Button)
            component.draw(context, componentPosition, this.componentWidth, this.componentHeight);
            idx++;
        }
        return this.isShowing && new Rect(this.position, this.componentWidth, this.componentHeight)
            .contains(position);
    }

    handleClick(position) {
        for (let key in this.componentMap) {
            let component = this.componentMap[key];
            if (component.isShowing && 
                component instanceof Button &&
                component.contains(position)) {
                component.handleClick();
            }
        }
    }
}

class UIContainerFactory {
    static createContainer(containerSettings) {
        switch(containerSettings.type) {
            case 'modal':
                return new Modal(containerSettings);

            default:
                throw new Error(`no such ${containerSettings.type} container exists`);
        }
    }
}

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
    UIContainerSettings,
    UIContainerFactory
};