import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Constants for input limits and display constraints
const MAX_DIGITS_BEFORE_OPERATOR = 10;
const MAX_DIGITS_AFTER_OPERATOR = 11;
const MAX_RESULT_LENGTH = 22;

// Main component for the calculator app
const App = () => {
  // State variables
  const [input, setInput] = useState(''); // Holds the current input expression
  const [lastOperator, setLastOperator] = useState(false); // Tracks the last operator used
  const [isResultDisplayed, setIsResultDisplayed] = useState(false); // Indicates if the result is currently displayed

  // Function to handle button presses
  const handlePress = (value) => {
    if (['+', '-', '*', '/'].includes(value)) {  // Checks if the value is one of the operators (+, -, *, /)
      // Handling for operators (+, -, *, /)
      if (input.length > 0 && !lastOperator) {   // Checks if (+, -, *, /) is the first element in the string and also that there is no multiplication of operators
        setInput(input + value);                 // add the operator to the string
        setLastOperator(true);
        setIsResultDisplayed(false);
      }
    } else if (value === '+-' && !lastOperator) {
      // Handling for plus/minus toggle
      const lastOperatorIndex = Math.max(input.lastIndexOf('+'), input.lastIndexOf('-'), input.lastIndexOf('*'), input.lastIndexOf('/'));
      let lastSegment = input.slice(lastOperatorIndex + 1);
      let lastOperator = input[lastOperatorIndex];

      // Checks each case individually to know what to change
      if (lastOperator === '+') {
        const updatedInput = input.slice(0, lastOperatorIndex) + '-' + lastSegment;
        setInput(updatedInput);
      } else if (lastOperator === '-') {
        const updatedInput = input.slice(0, lastOperatorIndex) + '+' + lastSegment;
        setInput(updatedInput);
      } else {
        if (lastSegment.startsWith('-')) {
          const updatedInput = input.slice(0, lastOperatorIndex + 1) + lastSegment.slice(1);
          setInput(updatedInput);
        } else {
          const updatedInput = input.slice(0, lastOperatorIndex + 1) + '-' + lastSegment;
          setInput(updatedInput);
        }
      }
    } else {
      // Handling for digits and decimal point
      const currentDigitCount = input.replace(/[^0-9]/g, '').length;
      const hasOperator = /[+\-*/]/.test(input);

      // Logic to update input based on current state
      if (isResultDisplayed && !['+', '-', '*', '/'].includes(value)) {
        setInput(value);
        setIsResultDisplayed(false);
      } else if (hasOperator) {
        if (currentDigitCount < MAX_DIGITS_AFTER_OPERATOR) {
          setInput(input + value);
          setLastOperator(false);
        }
      } else {
        if (input.length < MAX_DIGITS_BEFORE_OPERATOR || (input.length < MAX_DIGITS_BEFORE_OPERATOR + MAX_DIGITS_AFTER_OPERATOR)) {
          setInput(input + value);
          setLastOperator(value === '+' || value === '-' || value === '*' || value === '/');
        }
      }
    }
  };

  // Function to clear all state variables and reset the display
  const handleClear = () => {
    setInput('');
    setLastOperator(false);
    setIsResultDisplayed(false);
  };

  // Function to evaluate the expression and update the display with the result
  const calculate = (expression) => {
    try {
      // Handling percentage calculations within the expression
      const percentageExpression = expression
        .replace(/(\d+)\s*([+\-/])\s*(\d+)%/g, (match, p1, operator, p2) => {
          const percentageValue = p2 / 100 * parseFloat(p1);
          return `${p1} ${operator} ${percentageValue}`;
        })
        .replace(/(\d+)%/g, (match, p1) => `* (${p1} / 100)`);

      // Evaluating the expression using JavaScript's Function constructor
      if (percentageExpression.trim() === '') {
        return 'Error';
      }

      const result = new Function('return ' + percentageExpression)();
      const resultString = result.toString();
      // Limiting the result length for display
      return resultString.length > MAX_RESULT_LENGTH
        ? resultString.slice(0, MAX_RESULT_LENGTH)
        : resultString;
    } catch (e) {
      return 'Error';
    }
  };

  // Function to handle the equal button press, triggering the calculation
  const handleEqual = () => {
    setInput(calculate(input).toString());
    setLastOperator(false);
    setIsResultDisplayed(true);
  };

  // JSX for rendering the calculator UI
  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{input}</Text>
      </View>
      {/* Rows of calculator buttons */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={handleClear}>
          <Text style={styles.buttonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('+-')}>
          <Text style={styles.buttonText}>+/-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('%')}>
          <Text style={styles.buttonText}>%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('/')}>
          <Text style={styles.buttonText}>/</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('7')}>
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('8')}>
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('9')}>
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('*')}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('4')}>
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('5')}>
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('6')}>
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('-')}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('1')}>
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('2')}>
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('3')}>
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('+')}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('0')}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('.')}>
          <Text style={styles.buttonText}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.equalButton} onPress={handleEqual}>
          <Text style={styles.buttonText}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Stylesheet for the calculator app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderColor: '#0000ff',
    borderWidth: 5,
    borderRadius: 10,
  },
  displayContainer: {
    backgroundColor: '#00a000',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 48,
    color: 'white',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff00ff',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 5,
  },
  equalButton: {
    backgroundColor: '#ff0000',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3.5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default App;
