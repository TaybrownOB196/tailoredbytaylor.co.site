import Gamegrid from './Gamegrid';
import './../../../sass/tictactoe.scss';

class TBSGrid extends Gamegrid {
    constructor(props) {
        super(props);
    }

    handleClick(e) {
        console.log(e);
        console.log(e.target);
        console.log(e.target.id);
        let coord = e.target.id.split('|');
        this.state.Grid.Container[coord[0]][coord[1]] = 1337;

        console.log(this.state.Grid.Container);
    }

    
}

export default TBSGrid;