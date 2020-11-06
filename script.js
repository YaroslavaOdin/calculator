class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, errorText) {
      this.previousOperandTextElement = previousOperandTextElement; 
      this.currentOperandTextElement = currentOperandTextElement; 
      this.readyToReset = false; 
      this.errorTextElement = errorTextElement;
      this.clear();
    }
  
    clear() {
      this.currentOperand = '';
      this.previousOperand = '';
      this.operation = undefined;
      this.minus = false;
    }
  
    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  
    chooseOperation(operation) {
      if (this.currentOperand === '') return;
      if (this.previousOperand !== '') {
        this.compute(); 
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = '';
    }
  
    compute() {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      if (isNaN(prev) || isNaN(current)) return;
      switch (this.operation) {
        case '+':
          computation = (prev * 1000 + current * 1000) / 1000;
          break
        case '-':
          computation = (prev * 1000 - current * 1000) / 1000;
          break
        case '*':
          computation = ((prev * 1000) * (current * 1000)) / 1000000;
          break
        case '÷':
          computation = ((prev * 1000) / (current * 1000));
          if (computation === Infinity) {
            this.errorOutput('Error: cannot be divided by zero');
            return;
          }
          break
        case '∧':
          computation = Math.pow(prev, current);
          break
        default:
          return;
      }
      this.readyToReset = true;
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = '';
    }

    squareRoot() {
      if (this.currentOperand === '') return;
      this.operation = '√';
      const current = parseFloat(this.currentOperand);
      let computation = Math.sqrt(current);
      if (isNaN(computation)) {
        this.errorOutput("Error: negative number under the root");
        return;
      }
      this.previousOperand = current;
      this.currentOperand = computation;
    }

    signChangeButtons() {
      let computation;
      if (this.currentOperand === '') return;

        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        computation = -current;
        this.currentOperand = computation.toString();
    }
  
    getDisplayNumber(number) {
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0]) 
      const decimalDigits = stringNumber.split('.')[1] 
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }

    errorOutput(errorText) {
      this.errorTextElement.textContent = errorText;
      setTimeout(() => {
          this.errorTextElement.textContent = '';
      }, 3000)
  }
  }
  
  
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.querySelector('[data-equals]');
  const deleteButton = document.querySelector('[data-delete]');
  const allClearButton = document.querySelector('[data-all-clear]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]');
  const currentOperandTextElement = document.querySelector('[data-current-operand]');
  const squareRootButtons = document.querySelector('[data-square-root]');
  const signChangeButtons = document.querySelector('[data-sign-change]');
  const errorTextElement = document.querySelector('[data-error]')
  
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  numberButtons.forEach(button => {
    button.addEventListener("click", () => {
  
        if(calculator.previousOperand === "" &&
        calculator.currentOperand !== "" &&
    calculator.readyToReset) {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay();
    })
  })
  
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText);
      calculator.updateDisplay();
    })
  })

  signChangeButtons.addEventListener('click', button => {
        calculator.signChangeButtons();
        calculator.updateDisplay();
    })

  equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
  })

  squareRootButtons.addEventListener('click', button => {
    calculator.squareRoot(button.innerText);
    calculator.updateDisplay();
  })
  
  allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
  })
  
  deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
  })