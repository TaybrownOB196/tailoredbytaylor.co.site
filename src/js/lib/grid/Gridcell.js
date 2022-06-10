class Gridcell {
    constructor(column, row) {
        this.Column = column; 
        this.Row = row;
    }

    IsSame(gridCell) {
        return gridCell.Column == this.Column && gridCell.Row == this.Row;
    }
}

export default Gridcell;