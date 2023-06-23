import React, { useState, useRef } from 'react';

import Utility from '../../lib/Utility';

import '../../../sass/forms.scss';

const MathOperators = {
    'addition': '+',
    'subtraction': '-',
    'multiplication': 'x',
    'division': '\\'
}

class MathProblemOptions {
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

class MathProblem {
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

class Worksheet {
    constructor(problemCount) {
        this.problemCount = problemCount;
    }
    
    generate() {}
}

class MathProblemWorksheet extends Worksheet {
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

export default function WorksheetComponent({...props}) {
    const worksheet = new MathProblemWorksheet({});
    const [problems, setProblems] = useState([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [countCorrect, setCountCorrect] = useState(0);
    const results = useRef({});
    const selectedOperators = useRef({});

    function handleOnToggleOperator(ev) {
        selectedOperators.current[ev.target.value] = ev.target.checked;
        console.log(selectedOperators.current);
    }

    function handleOnAnswerProblem(ev) {
        let problemIdx = Number.parseInt(ev.target.id.split('-')[1]);
        let newResults = {
            ...results.current
        };
        if (problems[problemIdx].answer === Number.parseInt(ev.target.value)) {
            newResults[problemIdx] = true;
        } else {
            newResults[problemIdx] = false;
        }

        results.current = newResults;
    }

    function handleOnSubmit(ev) {
        let idx = 0;
        let _countCorrect = 0;
        for (let problem of problems) {
            let inputId = `${props.formID}-${idx}-input`;
            let input = document.getElementById(inputId);
            if (problem.answer == input.value) {
                _countCorrect++;
            }

            idx++;
        }

        setCountCorrect(_countCorrect);
        ev.preventDefault();
    }
    
    function handleOnShowAnswer(ev) {
        setShowAnswers(true);
        ev.preventDefault();
    }

    function handleOnGenerate(ev) {
        setShowAnswers(false);
        let operators = [];
        for (let oper of Object.keys(selectedOperators.current)) {
            if (selectedOperators.current[oper]) {
                operators.push(oper);
            }
        }

        setProblems(worksheet.generate(operators));
        results.current = {};
        ev.preventDefault();
    }

    function ProblemsComponent({...props}) {
        function handleOnChange(ev) {
            props.handleOnChange(ev);
        }

        return (
            <div className='problems'>
                {props.problems.map(function(prob, idx) {
                    return <ProblemComponent
                        handleOnChange={handleOnChange}
                        inputId={`${props.formID}-${idx}`}
                        problemIdx={idx}
                        key={idx}
                        value1={prob.value1}
                        value2={prob.value2}
                        operator={prob.operator}
                        answer={prob.answer}
                        showAnswers={props.showAnswers} />
                })}
            </div>
        );
    }

    function ProblemComponent({...props}) {
        function handleOnChange(ev) {
            props.handleOnChange(ev);
        }

        return (
            <div className='problem horizonal'>
                <span>{props.value1}</span>
                <span className='operator'>{props.operator}</span>
                <span>{props.value2}</span>
                <span className='equalSign'>=</span>
                <span className='equalBar'></span>
                <input 
                    id={`${props.inputId}-input`}
                    onChange={handleOnChange}
                    className={`${props.showAnswers ? 'showAnswer' : '' } ${results.current[props.problemIdx] ? 'valid' : 'invalid'}`}
                    defaultValue={props.showAnswers ? props.answer : ''} />
            </div>
        );
    }
    
    function OperatorCheckboxComponent({...props}) {
        return (
            <>
                <input
                    id={props.id}
                    name={props.name}
                    type='checkbox'
                    value={props.value}
                    checked={props.checked}
                    onChange={props.onChange} />
                <label>{props.name}</label><br />
            </>
        );
    }

    function ResultComponent({...props}) {
        return (
            <div className='results'>
                Results: {props.countCorrect} / {props.count}
            </div>
        );
    }

    return (
        <div className='worksheetContainer opaque-bg-container'>
            <div className='opaque-bg'></div>
            
            <form className='worksheet' id={props.formID}>
                <div>
                    <h5>Operators</h5>
                    <OperatorCheckboxComponent
                        id={MathOperators.addition}
                        name='Addition'
                        value={MathOperators.addition}
                        checked={selectedOperators[MathOperators.addition]}
                        onChange={handleOnToggleOperator} />
                    
                    <input
                        id={MathOperators.subtraction}
                        name='subtraction'
                        type='checkbox'
                        value={MathOperators.subtraction}
                        checked={selectedOperators[MathOperators.subtraction]}
                        onChange={handleOnToggleOperator} />
                    <label>Subtraction</label><br />

                    <input
                        id={MathOperators.multiplication}
                        name='multiplication'
                        type='checkbox'
                        value={MathOperators.multiplication}
                        checked={selectedOperators[MathOperators.multiplication]}
                        onChange={handleOnToggleOperator} />
                    <label>Multiplication</label><br />

                    <input
                        id={MathOperators.division}
                        name='division'
                        type='checkbox'
                        value={MathOperators.division}
                        checked={selectedOperators[MathOperators.division]}
                        onChange={handleOnToggleOperator} />
                    <label>Division</label><br />
                </div>
                <ProblemsComponent
                    formID={props.formID} 
                    handleOnChange={handleOnAnswerProblem}
                    showAnswers={showAnswers}
                    problems={problems} />
                <br />
                <input id={`${props.formID}-Submit`} type='submit' value='Submit' onClick={handleOnSubmit} />
                <button onClick={handleOnGenerate}>Generate</button>
                <button onClick={handleOnShowAnswer}>Show Answers</button>
                <ResultComponent count={problems.length} countCorrect={countCorrect} />
            </form>
        </div>
    );
}