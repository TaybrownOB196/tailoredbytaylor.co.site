import Utility from './../Utility';
import Gridcell from './Gridcell';

//Store grid in 2D array, but implement traversal at a directional level

class Grid {
    constructor(_default, colCount, rowCount) {
        
        if (colCount < 1 || rowCount < 1)
        throw 'columns/rows must be greater than 1';
        
        this.Default = _default;
        this.RowCount = rowCount;
        this.ColCount = colCount;
        this.Container = [];
        for(let col=0; col<this.ColCount; col++) {
            let row = [];
            for (var r=0; r<this.RowCount; r++) {
                row.push(this.Default);
            }

            this.Container.push(row);
        }
    }

    ///Returning false from the action will short cirtuit the rest of the loop
    ExecuteGrid(action) {
        let _continue = true; 
        for(let c = 0; c<this.ColCount && _continue; c++) {
            for(let r = 0; r<this.RowCount && _continue; r++) {
                let res = action(r, c);
                if (res === true)
                    _continue = false;
            }
        }
    }
    Set(col, row, obj) { this.Container[col][row] = obj; }
    Get(col, row) { return this.Container[col][row]; }
    IsInBounds(col, row) { return col >= 0 && col < this.ColCount && row >= 0 && row < this.RowCount; }
    IsPlaceAvailable(col, row) { return this.Container[col][row] === this.Default; }   
    IsPlaceAvailableAndInbouns(col, row) { return this.IsInBounds(col, row) && (this.Container[col][row] === this.Default); }
    GetAdjacent(col, row, range=1) {
        let toReturn = [];
        for(let idx=1; idx<=range; idx++) {
            if (this.IsInBounds(col-idx,row)) {
                toReturn.push(new Gridcell(col-idx, row));
            }
            if (this.IsInBounds(col-idx,row+idx)) {
                toReturn.push(new Gridcell(col-idx, row+idx));
            }
            if (this.IsInBounds(col,row+idx)) {
                toReturn.push(new Gridcell(col, row+idx));
            }
            if (this.IsInBounds(col+idx,row+idx)) {
                toReturn.push(new Gridcell(col+idx, row+idx));
            }
            if (this.IsInBounds(col+idx,row)) {
                toReturn.push(new Gridcell(col+idx, row));
            }
            if (this.IsInBounds(col+idx,row-idx)) {
                toReturn.push(new Gridcell(col+idx, row-idx));
            }
            if (this.IsInBounds(col,row-idx)) {
                toReturn.push(new Gridcell(col, row-idx));
            }
            if (this.IsInBounds(col-idx,row-idx)) {
                toReturn.push(new Gridcell(col-idx, row-idx));
            }
        }

        return toReturn;
    }

    IsInRange(col1, row1, col2, row2, range=1) {
        for(let idx=1; idx<=range; idx++) {
            if (this.IsInBounds(col1-idx,row1) && (col2 == col1-idx && row1 == row2)) {
                return true;
            }
            if (this.IsInBounds(col1-idx,row1+idx) && (col2 == col1-idx && row1+idx == row2)) {
                return true;
            }
            if (this.IsInBounds(col1,row1+idx) && (col2 == col1 && row1+idx == row2)) {
                return true;
            }
            if (this.IsInBounds(col1+idx,row1+idx) && (col2 == col1+idx && row1+idx == row2)) {
                return true;
            }
            if (this.IsInBounds(col1+idx,row1) && (col2 == col1+idx && row1 == row2)) {
                return true;
            }
            if (this.IsInBounds(col1+idx,row1-idx) && (col2 == col1+idx && row1-idx == row2)) {
                return true;
            }
            if (this.IsInBounds(col1,row1-idx) && (col2 == col1 && row1-idx == row2)) {
                return true;
            }
            if (this.IsInBounds(col1-idx,row1-idx) && (col2 == col1-idx && row1-idx == row2)) {
                return true;
            }
        }

        return false;
    }
    TryGetRandom(maxCol, maxRow, minCol = 0, minRow = 0) {
        if (maxCol > this.ColCount || maxRow > this.RowCount) 
            throw `maxCol: ${maxCol} and maxRow: ${maxRow} cannot exceed ColumnCount: ${this.ColCount} and RowCount: ${this.RowCount} respectively`;
        if (minCol < 0 || minRow < 0) 
            throw `minCol: ${minCol} and minRow: ${minRow} cannot be less than 0`;

        let potentialColumns = [];
        let potentialRows = [];

        for (let index=minCol; index<=maxCol; index++) {
            for (let rowIndex=minRow; rowIndex<=maxRow; rowIndex++) {
                if (this.IsPlaceAvailableAndInbouns(index, rowIndex)) {
                    potentialColumns.push(index);
                }
            }
        }
        if (potentialColumns.Count == 0)
            return null;
        let column = potentialColumns[Utility.GetRandomInt(potentialColumns.Count)];

        for (let index=minRow; index<=maxRow; index++) {
            if (this.IsPlaceAvailableAndInbouns(column, index)) {
                potentialRows.push(index);
            }
        }
        if (potentialRows.Count == 0)
            return null;
        let row = potentialRows[Utility.GetRandomInt(potentialRows.Count)];

        return new Gridcell(column, row);
    }
}

export default Grid;