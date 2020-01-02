$(document).ready(function() {
    "use strict";

    let number1 = null,
        number2 = null,
        sign = null,
        result = null,
        updateInputValue = false,
        fromFunEqually = false,
        action = ["plus", "minus", "divide", "mult"],
        actionSign = ["+", "-", "/", "x"];

    // clear all
    $(".btn_ac").click(() => {
        clearAll();
    });

    // numbers: 1, 2, ... , 9
    for (let num=0; num < 10; num++) {
        $(".num" + num).click(() => addNumber("" + num));
    }

    // percentage
    $(".percentage").click(() => {
        let currentNumber = $(".calculator__output");
        currentNumber.val(+(+currentNumber.val() / 100).toFixed(8));
    });

    // plus, munis, mult, divide
    for (let i = 0; i < action.length; i++) {
        let history = $(".history");
        $(".action" + action[i]).click(() => {
            let currentNumber = $(".calculator__output");
            if (updateInputValue && history.val()[history.val().length - 1] !== "=" && sign !== actionSign[i]) {
                sign = actionSign[i];
                history.val(history.val().substr(0, history.val().length - 1) + sign);
                return;
            }
            if (number1 !== null) {
                if (!fromFunEqually) {
                    total(sign);
                    sign = actionSign[i];
                } else {
                    sign = actionSign[i];
                    historySum(number1, sign);
                    fromFunEqually = false;
                }            
                return;
            }   
            if (number2 === null && number1 === null) {
                sign = actionSign[i];
                number1 = +(currentNumber.val());
                historySum();
                currentNumber.val("");
                updateInputValue = true;
                return;
            }
        });
    }

    // dot
    $(".dot").click(() => {
        let inputValue = $(".calculator__output");
        if (updateInputValue) {
            historySum();
            inputValue.val(0 + ".");
            updateInputValue = false;
            return; 
        }
        if (sign === "=") {
            clearAll();
            inputValue.val(0 + ".");
            return; 
        }
        if (inputValue.val() === "") {
            inputValue.val(0 + ".");
            updateInputValue = false;
            return;
        }
        if (inputValue.val().indexOf(".") === -1) {
            inputValue.val(inputValue.val() + ".");
        };
    });

    // plusminus
    $(".plusminus").click(() => $(".calculator__output").val(-(+($(".calculator__output").val()))));

    // equally
    $(".equally").click(() => {
        if (number1 === null) {
            let currentNumber = $(".calculator__output");
            $(".history").val(+currentNumber.val() + " =");
            currentNumber.val(+(+currentNumber.val()).toFixed(8));  
            return;
        }
        if (sign !== "=") {
            total();
            fromFunEqually = true;
        }
    });

    function total() {
        result, number2 = +$(".calculator__output").val();
        if (sign === "+") {result = number1 + number2};
        if (sign === "-") {result = number1 - number2};
        if (sign === "x") {result = number1 * number2};
        if (sign === "/") {
            if (number2 === 0) {
                historyEqually(number1, 0);
                $(".calculator__output").val("Error");
                updateInputValue = true;
                number1 = null;
                number2 = null;
                result = null;
                sign = "=";
                return;
            }
            result = number1 / number2;
        };
        historyEqually(number1, number2);
        $(".calculator__output").val(+result.toFixed(8));

        number1 = result;
        number2 = null; 
        result = null;
        sign = "=";
        updateInputValue = true;
    }

    function historyEqually(num1, num2) {
        if (number2 >= 0) {
            $(".history").val(+num1 + " " + sign + " " + +num2 + " =");
        } else {
            $(".history").val(+num1 + " " + sign + " (" + +num2 + ") =");
        }
    }

    function historySum() {
        $(".history").val(number1 + " " + sign);
    } 

    function addNumber(num) {
        if (sign === "=") {
            clearAll();
            $(".calculator__output").val(num);
            return; 
        }
        if (updateInputValue) {
            historySum(); 
            $(".calculator__output").val("");
            updateInputValue = false;
        }
        let inputValue = $(".calculator__output");
        if (inputValue.val().length < 9) {
            if (inputValue.val() === "0") {
                inputValue.val(num);
            } else {
                inputValue.val(inputValue.val() + num);
            }
        }
    }

    function clearAll() {
        $(".calculator__output").val("0");
        $(".history").val("");

        updateInputValue = false;
        fromFunEqually = false;
        number1 = null;
        number2 = null; 
        sign= null;
        result = null;
    }
});