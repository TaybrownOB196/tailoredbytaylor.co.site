class GridTile {
    constructor(gridPosition, rect, clipRect) {
        this.position = gridPosition;
        this.rect = rect;
        this.clipRect = clipRect;
        this.occupant = null;
    }

    draw(context) {
        if (this.isOccupied()) {
            // spritesheet.draw(context, this.rect, this.clipRect);
            this.occupant.draw(context);
        }
        context.strokeRect(
            this.rect.position.x, 
            this.rect.position.y, 
            this.rect.width, 
            this.rect.height);
    }
    isOccupied() { return this.occupant !== null; }
    setOccupant(occupant) {
        if (this.isOccupied())
            return;

        this.occupant = occupant;
        occupant.gridTile = this;
    }
    unsetOccupant(occupant) {
        this.occupant = null;
        occupant.gridTile = null;
    }
}

export default GridTile;