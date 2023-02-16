import Grid from '../grid/Grid';

//TODO: Reform logic into a transform class for a vector2d 
//using an adapter style library or something
class Matrix2d {
    constructor(row, col) {
        this.grid = new Grid(0, row, col);
        this.RowCount = row;
        this.ColCount = col;
    }

    getRow(row) {
        return this.grid.Container[row];
    }

    getColumn(col) {
        let toReturn = [];
        for (let idx=0; idx<this.RowCount; idx++) {
            toReturn.push(this.grid.Container[idx][col]);
        }

        return toReturn;
    }

    set(row, col, value) {
        this.grid.SetR(col, row, value);
    }

    get(row, col) {
        return this.grid.GetR(col, row);
    }

    multiply(otherMatrix) {
        if (this.ColCount !== otherMatrix.RowCount) 
            throw new Exception(`unable to multiply due to dimensions ${this.ColCount} ${otherMatrix.RowCount}`);
        let toReturn = new Matrix2d(this.RowCount, otherMatrix.ColCount);
        for (let idx1=0; idx1<this.RowCount; idx1++) {
            for (let idx2=0; idx2<otherMatrix.ColCount; idx2++) {
                let row = this.getRow(idx1);
                let column = otherMatrix.getColumn(idx2);
                let value = 0;
                let str = '';
                for (let idx3=0; idx3<row.length; idx3++) {
                    if (idx3 != 0) str += '+'
                    str += `${row[idx3]} * ${column[idx3]} `;
                    value += row[idx3] * column[idx3];
                }

                toReturn.set(idx1, idx2, value);
            }
        }

        return toReturn;
    }

    _print() {
        let row = '';
        this.grid.ExecuteGrid((c,r) => {
            row += `${this.get(r,c)} `;
            if (c >= this.ColCount-1) {
                console.log(row);
                row = '';
            }
        });
    }
}

// let a = new Matrix2d(2,3);
// let b = new Matrix2d(3,2);

// a.set(0,0, 1);
// a.set(1,0, 1);
// a.set(0,1, 4);
// a.set(1,1, 2);
// a.set(0,2, 1);
// a.set(1,2, 1);

// b.set(0,0, 1);
// b.set(1,0, 4);
// b.set(2,0, 1);

// a._print()
// console.log(b.grid.Container)

// a.multiply(b).grid.Container;

export default Matrix2d;  