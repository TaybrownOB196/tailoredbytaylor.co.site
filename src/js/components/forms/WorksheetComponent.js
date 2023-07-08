import React, { useState, useRef } from 'react';

import { MathProblemWorksheet, MathOperators } from './Worksheet';

import '../../../sass/forms.scss';

export default function WorksheetComponent({...props}) {
    const worksheet = new MathProblemWorksheet({});
    const [problems, setProblems] = useState([]);
    const [showAnswers, setShowAnswers] = useState(false);
    const [isVertical, setIsVertical] = useState(false);
    const [countCorrect, setCountCorrect] = useState(0);
    const results = useRef({});
    const selectedOperators = useRef({});

    function handleOnToggleOperator(ev) {
        let newSelectedOperators = {
            ...selectedOperators.current
        };
        newSelectedOperators[MathOperators[ev.target.name]] = ev.target.checked;
        selectedOperators.current = newSelectedOperators;
    }

    function handleOnToggleVertical(ev) {
        setIsVertical(ev.target.checked);
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
            <div className={`problem ${isVertical ? "vertical" : "horizontal"}`}>
                <span>{props.value1}</span>
                <span className='operator'>{props.operator}</span>
                <span style={{clear: "none"}}>{props.value2}</span>
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
                    checked={props.isChecked}
                    onChange={props.onChange} />
                <label>{props.name}</label><br />
            </>
        );
    }

    function MathOperatorsComponent({...props}) {
        return (
            <>
                <h5>Operators</h5>
                {props.operators.map(function(operName, idx) {
                // {Object.keys(MathOperators).map(function(operName, idx) {
                    // return <OperatorCheckboxComponent
                    //     id={operName}
                    //     key={idx}
                    //     name={operName}
                    //     value={MathOperators[operName]}
                    //     isChecked={selectedOperators.current[MathOperators[operName]]}
                    //     onChange={handleOnToggleOperator} />
                    return <OperatorCheckboxComponent
                        id={operName}
                        key={idx}
                        name={operName}
                        value={MathOperators[operName]}
                        isChecked={props.selectedOperators[MathOperators[operName]]}
                        onChange={handleOnToggleOperator} />
                })}
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
                    <input
                        name={props.name}
                        type='checkbox'
                        value={props.value}
                        checked={isVertical}
                        onChange={handleOnToggleVertical} />
                    <label>Toggle Vertical</label>
                    <MathOperatorsComponent
                        selectedOperators={selectedOperators.current}
                        operators={Object.keys(MathOperators)} />
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