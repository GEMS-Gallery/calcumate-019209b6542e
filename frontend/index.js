import { backend } from "declarations/backend";

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');
const loadingIndicator = document.getElementById('loading');

let currentValue = '';
let operator = '';
let previousValue = '';

function setLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.style.display = 'flex';
        buttons.forEach(button => button.disabled = true);
    } else {
        loadingIndicator.style.display = 'none';
        buttons.forEach(button => button.disabled = false);
    }
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (button.classList.contains('num')) {
            currentValue += value;
            display.value = currentValue;
        } else if (button.classList.contains('op')) {
            operator = value;
            previousValue = currentValue;
            currentValue = '';
        }
    });
});

clearBtn.addEventListener('click', () => {
    currentValue = '';
    operator = '';
    previousValue = '';
    display.value = '';
});

equalsBtn.addEventListener('click', async () => {
    if (previousValue && currentValue && operator) {
        const x = parseFloat(previousValue);
        const y = parseFloat(currentValue);
        let result;

        setLoading(true);

        try {
            switch (operator) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    const divisionResult = await backend.divide(x, y);
                    result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
                    break;
            }

            display.value = result;
            currentValue = result.toString();
            previousValue = '';
            operator = '';
        } catch (error) {
            console.error('Calculation error:', error);
            display.value = 'Error';
        } finally {
            setLoading(false);
        }
    }
});
