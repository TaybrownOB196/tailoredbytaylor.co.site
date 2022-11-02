class Meter {
    constructor(colorHex, initial, max, width, height, borderColorHex='#ffffff') {
        this.borderColorHex = borderColorHex;
        this.colorHex = colorHex;
        this.previousColor = colorHex;
        this.value = initial;
        this.max = max;
        this.min = 0;
        this.width = width;
        this.height = height;
    }

    isEmpty() {
        return this.value <= this.min;
    }

    updateValue(value) {
        let temp = this.value + value;
        if (temp <= this.min) {
            this.value = this.min;
        } else if  (temp >= this.max) {
            this.value = this.max;
        } else {
            this.value += value;
        }
    }

    setColor(colorHex) {
        this.previousColor = this.colorHex;
        this.colorHex = colorHex;
    }

    resetColor() {
        this.setColor(this.previousColor);
    }

    draw(context, position) {

        context.beginPath();
        context.lineWidth = "2";
        context.strokeStyle = this.borderColorHex;
        context.rect(position.x, position.y, this.width, this.height);
        context.stroke();

        context.fillStyle = this.colorHex;
        context.fillRect(position.x, position.y, 
            this.width * (this.value/this.max), this.height);
    }
}

export default Meter;