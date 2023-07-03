import Utility from '../../lib/Utility';

export const MathOperators = {
    'addition': '+',
    'subtraction': '-',
    'multiplication': 'x',
    'division': '\\'
}

export class MathProblemOptions {
    constructor(options) {
        let { min, max, allowNegative, allowFraction } = options;
        this.min = min || 0;
        this.max = max || 10;
        if (this.min > this.max) {
            throw new Error('min must be lesser than max')
        }
        this.allowNegative = allowNegative || false;
        this.allowFraction = allowFraction || false;
    }
}

export class MathProblem {
    constructor(value1, operator, value2) {
        this.value1 = value1;
        this.operator = operator;
        this.value2 = value2;
        this.answer = this.getAnswer();
    }

    getAnswer() {
        switch(this.operator) {
            case MathOperators.addition: return this.value1 + this.value2;
            case MathOperators.subtraction: return this.value1 - this.value2;
            case MathOperators.multiplication: return this.value1 * this.value2;
            case MathOperators.division: return this.value1 / this.value2;
        }
    }
}

export class Worksheet {
    constructor(problemCount) {
        this.problemCount = problemCount;
    }
    
    generate() {}
}

export class MathProblemWorksheet extends Worksheet {
    constructor(options = {}, problemCount=10) {
        super(problemCount);
        this.problemOptions = new MathProblemOptions(options);
    }

    generate(operators) {
        let problems = [];
        for (let idx=0; idx<this.problemCount; idx++) {
            let operator = getOperator(operators);
            let values = [
                Utility.getRandomIntInclusive(this.problemOptions.min, this.problemOptions.max),
                Utility.getRandomIntInclusive(this.problemOptions.min, this.problemOptions.max)
            ];

            if (!this.problemOptions.allowNegative && 
                operator === MathOperators.subtraction) {
                values.sort((a,b) => a-b);
            }
            if (operator === MathOperators.division) {
                if (!this.problemOptions.allowFraction && 
                    values[values.length-1] % values[0] !== 0) 
                {
                    values[values.length-1] = values[values.length-1] * values[0];
                }

                if (values[0] === 0) {
                    values[0]++;
                }
            } 

            problems.push(new MathProblem(
                values[values.length-1],
                operator,
                values[0]
            ));
        }

        function getOperator(operators) {
            return operators[Utility.GetRandomInt(operators.length)];
        }

        return problems;
    }
}