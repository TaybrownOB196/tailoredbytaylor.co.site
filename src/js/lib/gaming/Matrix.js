import Grid from '../grid/Grid';

class Grid {
    constructor(_default, colCount, rowCount) {
        
        if (colCount < 1 || rowCount < 1)
        throw 'columns/rows must be greater than 1';
        
        this.Default = _default;
        this.ColCount = colCount;
        this.RowCount = rowCount;
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
    ExecuteGridR(action) {
        let _continue = true; 
        for(let r = 0; r<this.RowCount && _continue; r++) {
            for(let c = 0; c<this.ColCount && _continue; c++) {
                let res = action(r, c);
                if (res === true)
                    _continue = false;
            }
        }
    }
    Set(col, row, obj) { this.Container[col][row] = obj; }
    SetR(col, row, obj) { this.Container[row][col] = obj; }
    Get(col, row) { return this.Container[col][row]; }
    GetR(col, row) { return this.Container[row][col]; }
}

//TODO: Reform logic into a transform class for a vector2d using an adapter style library or something
class Matrix2d {
    constructor(col, row) {
        this.grid = new Grid(0, col, row);
    }

    set(col, row, value) {
        this.grid.Set(col, row, value);
    }

    get(col, row) {
        return this.grid.Get(col, row);
    }

    multiply(otherMatrix) {
        if (this.grid.ColCount !== otherMatrix.grid.RowCount) 
            throw new Exception(`unable to multiply due to dimensions ${this.grid.ColCount} ${otherMatrix.grid.RowCount}`);
        let matrixIdx = 0;
        let cellSum = 0;
        let toReturn = new Matrix2d(this.grid.RowCount, otherMatrix.grid.ColCount);
        console.log(this.grid.RowCount)
        for (let idx1=0; idx1<toReturn.grid.ColCount; idx1++) {
            for (let idx2=0; idx2<toReturn.grid.RowCount; idx2++) {
                while (matrixIdx < otherMatrix.grid.RowCount) {
                    try {
                        cellSum += this.get(idx1, matrixIdx) * otherMatrix.get(idx2, matrixIdx);
                        console.log(matrixIdx, idx1, idx2);
                        console.log(`${this.get(idx1, matrixIdx)} * ${otherMatrix.get(idx2, matrixIdx)}`);
                        matrixIdx++;
                    } catch(err) {
                        console.log(err);
                        throw err;
                    }
                }
                matrixIdx = 0;
                toReturn.set(idx1, idx2, cellSum);
            }
        }

        return toReturn;
    }

    print() {
        let toReturn = "";
        this.gri
        return toReturn;
    }
}

export default Matrix2d;  