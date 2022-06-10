import Grid from './../../../lib/grid/Grid';
import Utility from './../../../lib/Utility';

class Warshipgrid extends Grid {
    constructor(defaultValue, colCount, rowCount, availableValues) {
        super(defaultValue, colCount, rowCount)
        this.AvailableValues = availableValues; 
    }

    GetInRadius(position, radius) {
        let toReturn = null;
        for(let index=0; index<radius; index++) {
            //NORTH
            toReturn.push(new Gridcell(position.Column - index, position.Row));
            //NORTHEAST
            toReturn.push(new Gridcell(position.Column - index, position.Row + index));
            //EAST
            toReturn.push(new Gridcell(position.Column, position.Row + index));
            //SOUTHEAST
            toReturn.push(new Gridcell(position.Column + index, position.Row + index));
            //SOUTH
            toReturn.push(new ColumnRow(position.Column + index, position.Row));
            //SOUTHWEST
            toReturn.push(new ColumnRow(position.Column + index, position.Row - index));
            //WEST
            toReturn.push(new ColumnRow(position.Column, position.Row - index));
            //NORTHWEST
            toReturn.push(new Gridcell(position.Column - index, position.Row - index));
        }

        return toReturn.filter(function(cr) { return this.IsPlaceAvailable(cr); });
    }

    GetCountInDirection(position, count, direction) {
        let toReturn = null;
        let mods = Utility.GetDirectionModifiers(direction);
        for(let index=0; index<count; index++) {
            toReturn.push(new Gridcell(position.Column + (mods.c * index), position.Row + (mods.r * index)));
        }

        return toReturn.filter(function(cr) { return this.IsPlaceAvailable(cr); });
    }

    GetRandomInRadius(position, radius) {
        letpositions = GetInRadius(position, radius);

        return positions
            .filter(function(p) { return Utility.GetRandomInt(2) == 1; } );
    }
}

class Shipgrid extends Warshipgrid {
    constructor(defaultValue, colCount, rowCount, availableValues) {
        super(defaultValue, colCount, rowCount, availableValues);
    }

    TryGetShipPlacement(startPosition, direction, length) {
        if (!this.IsPlaceAvailable(startPosition)) return { valid: null, invalid: null};

        let mods = Utility.GetDirectionModifiers(direction);
        var shipPosition = null;
        var invalidPositions = null;
        shipPosition[0] = startPosition;
        for (let index=1; index<length; index++) {
            var pos = new Gridcell(
                startPosition.Column + index * mods.c,
                startPosition.Row + index * mods.r);
            if (this.IsPlaceAvailable(pos)) {
                shipPosition[index] = pos;
            } else {
                invalidPositions.push(pos);
            }
        }

        return (shipPosition, invalidPositions);
    }
}

class Shotgrid extends Warshipgrid {
    constructor(defaultValue, colCount, rowCount, availableValues) {
        super(defaultValue, colCount, rowCount, availableValues);
    }

    IsPlaceAvailable(col, row) { 
        return !this.AvailableValues.Contains(Container[col][row]) || super.IsPlaceAvailable(col, row); 
    }
}

export {
    Shipgrid, 
    Shotgrid
}