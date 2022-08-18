const str = `
  declare a = 10;
  declare b = 20;
  declare c = a + b;
  print(c);
`;

const isDigit = (ch) => {
  return /[0-9]/i.test(ch);
}
const isStr = (ch) => {
  return /[a-z]/i.test(ch);
}
const isSkip = (ch) => {
  return ['(', ')'].includes(ch);
}
const isOperation = (ch) => {
  return ['+', '-', '*', '/', '='].includes(ch);
}
const isSemicolon = (ch) => {
  return ';' === ch;
}

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
  const getSemicolon = () => {
    const res = getChar();
    next();
    return res;
  }
  const next = (step) => {
    step ? start += step : start += 1;
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

  skipWhiteSpace();

  while(start < str.length) {
    const char = getChar();
    if (isDigit(char)) {
      tokens.push(getNum());
    } else if (isStr(char)) {
      tokens.push(getStr());
    } else if (isOperation(char)) {
      tokens.push(getOperation());
    } else if (isSemicolon(char)) {
      tokens.push(getSemicolon());
    } else if (isSkip(char)) {
      next();
    }
    skipWhiteSpace();
  }
  return tokens;
}

function parse(tokens) {
  let start = 0;
  const prog = [];
  const peek = () => {
    return tokens[start];
  }
  const next = (step) => {
    step ? start += step : start += 1;
  }
  const newDeclare = (v) => {
    return {
      type: 'declare',
      value: v
    }
  }
  const newVar = (v) => {
    return {
      type: 'var',
      value: v,
    }
  }
  const newNumber = (v) => {
    return {
      type: 'number',
      value: v
    }
  }
  const newPrint = (str) => {
    return {
      type: 'print',
      value: str,
    }
  }
  const newBinary = (op, left, right) => {
    return {
      type: 'binary',
      op,
      left,
      right
    }
  }
  const newAssign = (left, right) => {
    return {
      type: 'assign',
      left,
      right
    }
  }
  const isKeyWord = (kw) => {
    const tok = peek();
    return kw === tok;
  }
  const parseDeclare = () => {
    next();
    return newDeclare(peek())
  }
  const parseAssign = (astNode) => {
    const res = newAssign(astNode.pop(), parseRight());
    return res;
  }
  const parseRight = () => {
    next();
    const token1 = peek();
    next();
    const token2 = peek();
    if (token2 == ';') {
      next(-1)
      return newNumber(token1)
    }
    next();
    const token3 = peek();
    return newBinary(token2, newVar(token1), newVar(token3))
  }
  const parsePrint = () => {
    next();
    return newPrint(peek());
  }
  const parseAtom = () => {
    const astNode = [];
    while(1) {
      const token = peek();
      if (token === ';') break;
      if (isKeyWord('declare')) {
        astNode.push(parseDeclare());
      } else if (isKeyWord('=')) {
        astNode.push(parseAssign(astNode))
      } else if (isKeyWord('print')) {
        astNode.push(parsePrint());
      }
      next();
    }
    return astNode[0];
  }
  while(start < tokens.length) {
    prog.push(parseAtom());
    next();
  }
  return prog;
}

function interpreter(ast) {
  globalThis.env = {};
  const exeAst = (node) => {
    const type = node.type;
    if (type === 'print') {
      console.log(globalThis.env[node.value]);
    } else if (type === 'assign') {
      globalThis.env[node.left.value] = exeAst(node.right);
    } else if (type === 'number') {
      return node.value;
    } else if (type === 'binary') {
      const left = node.left.type === 'var' ? globalThis.env[node.left.value] : Number(node.left);
      const right = node.right.type === 'var' ? globalThis.env[node.right.value] : Number(node.right);
      if (node.op === '+') {
        return left + right;
      } else if(node.op === '-') {
        return left - right;
      } else if(node.op === '*') {
        return left * right;
      } else {
        return left / right;
      }
    }
  }
  for (let i = 0; i < ast.length; i += 1) {
    exeAst(ast[i]);
  }
}

const tokens = token(str);
console.log(' tokens ', tokens);
const ast = parse(tokens);
console.log(' ast ', ast);
interpreter(ast);

