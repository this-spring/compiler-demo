const str = `
  declare a = 10;
  declare b = 20;
  declare c = a + b * a * b;
  print(c);
`;

function token(str) {
  let start = 0;
  const tokens = [];
  const getStr = () => {
    let ch = '';
    let s = '';
    while(ch = getChar()) {
      if (isStr(ch)) {
        s += ch;
        next();
      } else {
        break;
      }
    }
    return s;
  }
  const getNum = () => {
    let ch = '';
    let s = '';
    while(ch = getChar()) {
      if (isDigit(ch)) {
        s += ch;
        next();
      } else {
        break;
      }
    }
    return Number(s);
  }
  const getChar = () => {
    return str[start];
  }
  const getOperation = () => {
    const res = getChar();
    next();
    return res;
  }
  const next = (step) => {
    step ? start += step : start += 1;
  }
  const isDigit = (ch) => {
    return /[0-9]/i.test(ch);
  }
  const isStr = (ch) => {
    return /[a-z]/i.test(ch);
  }
  const isSkip = (ch) => {
    return [';', '(', ')'].includes(ch);
  }
  const isOperation = (ch) => {
    return ['+', '-', '*', '/', '='].includes(ch);
  }
  const skipWhiteSpace = () => {
    let s = '';
    while(s = getChar()) {
      if (s == ' ' || s == '\n') {
        next();
      } else {
        break;
      }
    }
  }

  while(start < str.length) {
    skipWhiteSpace();
    const char = getChar();
    if (isDigit(char)) {
      tokens.push(getNum());
    } else if (isStr(char)) {
      tokens.push(getStr());
    } else if (isOperation(char)) {
      tokens.push(getOperation());
    } else if (isSkip(char)) {
      next();
    }
    skipWhiteSpace();
  }
  return tokens;
}

function parse(tokens) {
  const newDeclare = () => {
    return {
      type: 'declare',
      value: 1
    }
  }
}

function interpreter(ast) {

}

const tokens = token(str);
console.log(' tokens ', JSON.stringify(tokens));
const ast = parse(tokens);
interpreter(ast);

