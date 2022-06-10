import GridCell from './Gridcell';
import Utility from './../Utility';

class PathGridCell extends GridCell {
    constructor(column, row, start, end) {
        super(column, row);

        this.GCost = null;
        if (start) {
            this.GCost = Pathfinder.DistanceBetween(column, row, start);
            // console.log(this.GCost);
        }

        this.HCost = null;
        if (end) {
            this.HCost = Pathfinder.DistanceBetween(column, row, end);
            // console.log(this.HCost);
        }
        
        this.FCost = this.GetFCost();
        console.log(this.GetFCost());
        this.ParentIndex = Number.MIN_SAFE_INTEGER;
    }
    
    SetParentNode(parentIndex) { this.ParentIndex = parentIndex; }
    SetGCost(gCost) { this.GCost = gCost; }
    GetFCost() { return this.GCost + this.HCost; }
    CalculateGCost(gridCell) { this.GCost = Pathfinder.DistanceBetween(this.Column, this.Row, gridCell); }
    CalculateHCost(gridCell) { this.HCost = Pathfinder.DistanceBetween(Column, Row, gridCell); }
}

class Pathfinder {

    static DistanceBetween(x, y, gridCell) {
        return Math.sqrt(
            Math.pow(gridCell.Column - x, 2) + 
            Math.pow(gridCell.Row - y, 2));
    }

    static GetLowestFCostNode(gridCells) {
        let min = Number.MAX_SAFE_INTEGER;
        let toReturn = null;
        for(let index=0; index< gridCells.length; index++) {
            if (gridCells[index].GetFCost() < min) {
                toReturn = gridCells[index];
                min = gridCells[index].GetFCost();
            }
        }

        return toReturn;
    }

    static CalculatePath(endCell, closed) {
        let ColumnRows = [ endCell ];
        let currentNode = endCell;
        // let iteration = 0;
        while(currentNode.ParentIndex != Number.MIN_SAFE_INTEGER) {
            iteration++;
            ColumnRows.push(closed[currentNode.ParentIndex]);
            currentNode = closed[currentNode.ParentIndex];
            // if (iteration > 100)
            //     throw 'failure to calculate path'; 
        }

        return ColumnRows.reverse();
    }
    
    static GetSurroundingNodes(grid, gridCell, start, end) {
        let surroundingCells = [];
        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column - 1, gridCell.Row)) {
            surroundingCells.push(new PathGridCell(gridCell.Column - 1, gridCell.Row, start, end));
        }

        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column - 1, gridCell.Row + 1)) {
            surroundingCells.push(new PathGridCell(gridCell.Column - 1, gridCell.Row + 1, start, end));
        }

        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column, gridCell.Row + 1)) {
            surroundingCells.push(new PathGridCell(gridCell.Column, gridCell.Row + 1, start, end));
        }

        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column + 1, gridCell.Row + 1)) {
            surroundingCells.push(new PathGridCell(gridCell.Column + 1, gridCell.Row + 1, start, end));
        }

        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column + 1, gridCell.Row)) {
            surroundingCells.push(new PathGridCell(gridCell.Column + 1, gridCell.Row, start, end));
        }

        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column + 1, gridCell.Row - 1)) {
            surroundingCells.push(new PathGridCell(gridCell.Column + 1, gridCell.Row - 1, start, end));
        }

        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column, gridCell.Row - 1)) {
            surroundingCells.push(new PathGridCell(gridCell.Column, gridCell.Row - 1, start, end));
        }

        if (grid.IsPlaceAvailableAndInbouns(gridCell.Column - 1, gridCell.Row - 1)) {
            surroundingCells.push(new PathGridCell(gridCell.Column - 1, gridCell.Row - 1, start, end));
        }

        return surroundingCells;
    }

    static GetPath(grid, start, end) {
        let open = [ new PathGridCell(start.Column, start.Row, start, end) ];
        let closed = [];
        let nodeList = [];
        let iteration = 0;
        while(open.length > 0) {
            iteration++;
            let currentNode = Pathfinder.GetLowestFCostNode(open);
            // console.log(currentNode);
            if (currentNode.IsSame(end)) {
                // console.log('issame')
                return Pathfinder.CalculatePath(currentNode, nodeList);
            }
            // console.log(nodeList);
            Utility.RemoveAll(open, (o) => { console.log(o.IsSame(currentNode)); });
            closed.push(currentNode);

            let surroundingNodes = Pathfinder.GetSurroundingNodes(grid, currentNode, start, end);
            nodeList.push(currentNode);
            for(let index=0; index<surroundingNodes.Count; index++) {
                if (closed.some((c) => c.IsSame(surroundingNodes[index])))
                    continue;

                let tempGCost = currentNode.GCost + Pathfinder.DistanceBetween(currentNode.Column, currentNode.Row, surroundingNodes[index]);
                
                if (tempGCost < surroundingNodes[index].GCost || !open.some((c) => c.IsSame(surroundingNodes[index]))) {
                    let columnRow = new PathGridCell(surroundingNodes[index].Column, surroundingNodes[index].Row);
                    columnRow.SetParentNode(nodeList.findIndex((nl) => nl.IsSame(currentNode)));
                    columnRow.SetGCost(tempGCost);
                    columnRow.CalculateHCost(end);
                    nodeList.push(columnRow);

                    if (!open.some((cr) => cr.IsSame(columnRow))) {
                        open.push(columnRow);
                    }
                }
            }

            if (iteration > 1000)
                throw 'failure to get path';
        }

        return null;
    }
}

export default Pathfinder;