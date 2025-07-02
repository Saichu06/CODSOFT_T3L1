let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForNewOperand = false;

const currentInputElement = document.getElementById('currentInput');
const previousInputElement = document.getElementById('previousInput');

function updateDisplay() {
    currentInputElement.textContent = currentInput;
    previousInputElement.textContent = previousInput;
    
    // Remove error class after displaying
    currentInputElement.classList.remove('error');
}

function inputNumber(num) {
    if (waitingForNewOperand) {
        currentInput = num;
        waitingForNewOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForNewOperand) {
        currentInput = '0.';
        waitingForNewOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === '') {
        previousInput = currentInput + ' ' + getOperatorSymbol(nextOperator);
    } else if (operator) {
        const result = calculate();
        if (result === null) return;
        
        currentInput = String(result);
        previousInput = currentInput + ' ' + getOperatorSymbol(nextOperator);
    }

    waitingForNewOperand = true;
    operator = nextOperator;
    updateDisplay();
}

function getOperatorSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return null;

    let result;
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError('Cannot divide by zero');
                return null;
            }
            result = prev / current;
            break;
        default:
            return null;
    }

    // Round to avoid floating point precision issues
    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    
    currentInput = String(result);
    previousInput = '';
    operator = null;
    waitingForNewOperand = true;
    updateDisplay();
    
    return result;
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForNewOperand = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function showError(message) {
    currentInput = message;
    currentInputElement.classList.add('error');
    updateDisplay();
    
    setTimeout(() => {
        clearAll();
    }, 2000);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.=Enter Escape'.includes(key)) {
        event.preventDefault();
    }

    // Add visual feedback for key press
    const button = document.querySelector(`[data-key="${key}"]`) || 
                  document.querySelector(`[data-key="${key === 'Enter' ? 'Enter' : key}"]`);
    
    if (button) {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 100);
    }

    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('*');
    } else if (key === '/') {
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

// Initialize display
updateDisplay();