class Utility {
    static shuffle(list) {
        let toReturn = [];
        
        function _shuffle(_list, toReturn) {
            if (_list.length === 1) {
                toReturn.push(_list[0]);
                return toReturn;
            }

            let index = GetRandomInt(_list.length);
            toReturn.push(_list[index]);
            _list[index] = null;

            let _ = _list.filter(item => {return item !== null;});
            return _shuffle(_, toReturn);
        }

        return _shuffle(list, toReturn);
    }

    static GetRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    
    static GetAlphabet() {
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    }

    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static RemoveAllInstances(list, target) {
        return list.filter((val) => {return val !== target && t.indexOf(target) !== -1});
    }

    static RemoveAll(list, lambda) {
        return list.filter(lambda);
    }

    static GetIndexesOf(charArray, expression) {
        return charArray
            .map((element, index) => {
                if (expression(element)) {
                // if (element === 't' || element === 'r') {
                    return index;
                }
            })
            .filter(element => element >= 0);
    }

    static GetDirectionModifiers(direction) {
        switch(direction) {
            case 'NORTH': return {c:-1, r:0};
            case 'EAST':  return {c:0, r:1};
            case 'WEST': return {c:0, r:-1};
            case 'SOUTH': return {c:1, r:0};
        }

        return { c: 0, r: 0 };
    }

    static FilterObject(obj, callback) {
        return Object.fromEntries(Object.entries(obj).
            filter(([key, val]) => { if (val) callback(val, key)}));
    }
}

export default Utility;