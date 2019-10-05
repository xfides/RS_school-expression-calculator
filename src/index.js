function eval() {
  // Do not use eval!!!
  return;
}

const ERR_MSGS = {
  'divZero': 'TypeError: Division by zero.',
  'nonPairBrackets': 'ExpressionError: Brackets must be paired'
};
const OPS = ['(', ')', '+', '-', '*', '/'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function lex(str) {

  let strLength = str.length;
  let tokens = [];
  let bufferDigits = [];

  for (let iSymbol = 0; iSymbol < strLength; iSymbol++) {
    if (OPS.indexOf(str[iSymbol]) !== -1) {
      if (bufferDigits.length !== 0) {
        tokens.push(['number', bufferDigits.join('')]);
        bufferDigits = [];
      }
      tokens.push(['operator', str[iSymbol]]);
      continue;
    }

    if (DIGITS.indexOf(str[iSymbol]) !== -1) {
      bufferDigits.push(str[iSymbol]);
    }
  }

  if (bufferDigits.length !== 0) {
    tokens.push(['number', bufferDigits.join('')]);
  }

  return tokens;
}

function getRPN(arrTokens) {

  let prior = {
    "-": 0,
    "+": 0,
    "/": 1,
    "*": 1
  };
  let output = [];
  let opStack = [];
  let arrTokensLength = arrTokens.length;

  for (let iToken = 0; iToken < arrTokensLength; iToken++) {

    // если число - добавить в выходную очередь
    if (arrTokens[iToken][0] == "number") {
      output.push(arrTokens[iToken][1]);
    }

    // если встретили оператор
    if (
        arrTokens[iToken][0] == "operator"
        &&
        arrTokens[iToken][1] !== '('
        &&
        arrTokens[iToken][1] !== ')'
    ) {

      while (
      prior[opStack[opStack.length - 1]] >= prior[arrTokens[iToken][1]]
      &&
      opStack[opStack.length - 1] !== "("
          ) {
        output.push(opStack.pop());
      }

      opStack.push(arrTokens[iToken][1]);
    }

    // левую скобку сразу пихаем в стек операторов
    if (arrTokens[iToken][1] == "(") {
      opStack.push(arrTokens[iToken][1]);
    }

    // обработка правой скобки
    if (arrTokens[iToken][1] == ")") {

      // выгружаем все между скобками из стека операторов в выходную очередь
      while (opStack[opStack.length - 1] !== "(") {

        if (opStack.length === 0) {
          throw new Error(ERR_MSGS.nonPairBrackets);
        }

        output.push(opStack.pop());
      }

      // входную левую скобку и текщую правую скобку уничтожаем
      if (opStack[opStack.length - 1] == "(") {
        opStack.pop();
      }

    }

  }

  if (
      opStack.indexOf('(') !== -1
      ||
      opStack.indexOf(')') !== -1
  ) {
    throw new Error(ERR_MSGS.nonPairBrackets);
  }

  // если стек операторов не пуст, выгрузить все из него в выходную очередь
  if (opStack.length !== 0) {
    output = output.concat(opStack.reverse());
  }

  return output;
}

function countExpr(op1, op2, operator) {

  let res = 0;

  op1 = parseFloat(op1);
  op2 = parseFloat(op2);

  if (operator == "/" && op2 == 0) {
    throw new Error(ERR_MSGS.divZero);
  }

  switch (operator) {
    case "/":
      res = op1 / op2;
      break;
    case "*":
      res = op1 * op2;
      break;
    case "-":
      res = op1 - op2;
      break;
    case "+":
      res = op1 + op2;
      break;
  }
  return res;

}

function calc(tokensRPN) {

  for (let iSym = 0; iSym < tokensRPN.length; iSym++) {
    if (OPS.indexOf(tokensRPN[iSym]) !== -1) {
      let indexOperator = iSym;
      let operandFirst = tokensRPN[iSym - 2];
      let operandSecond = tokensRPN[iSym - 1];

      let partRes = countExpr(operandFirst, operandSecond, tokensRPN[iSym]);

      tokensRPN.splice(indexOperator - 2, 3, partRes);
      iSym = 0;
    }
  }

  return Number(tokensRPN[0]);

}

function expressionCalculator(expr) {
  let tokens = lex(expr);
  let tokensRPN = getRPN(tokens);
  return calc(tokensRPN);
}

let expr = '(1 + 2) * 3';

console.log(expressionCalculator(expr));

module.exports = {
  expressionCalculator
};







