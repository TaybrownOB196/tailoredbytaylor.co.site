import Vector2d from "../Vector2d";
import { UIComponent, UIComponentSettings } from "./UIComponent";
import { UIComponentFactory } from "./UIComponentFactory";

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
                console.log(c);
                c.toggle(isShowing);
            });
    }

    addComponent(key, componentSettings) {
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


export {
    UIContainerSettings,
    UIContainerFactory
};