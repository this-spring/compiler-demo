## 实现
计算器：
- 支持变量
- 支持多行
- 计算符号支持 + - * /

语法：
- 声明变量 declare
- 输出结果 print
```
case1: 

declare a = 1;
print(a)
结果输出：1

case 2:

declare a = 1;
declare b = 2;
declare c = a + b * a * b;
print(c)
结果输出：5
```

## ast node types 结构

### 变量（declare）
```
DeclareStatement = {
  type: 'declare',
  value: String
}
```
```
declare a 

{
  type: 'declare',
  value: a
}
```

### 数字（number）
```
NumberStatement = {
  type: 'number',  
  value: number
}
```

```
1  
{
  type: 'number',
  value: 1
}
```

### 表达式（binary）
```
BinaryStatement = {
  type: 'binary',
  op: '+' | '-' | '*' | '/',
  left: NumberStatement,
  right: NumberStatement,
}
```
```
1 + 2
{
  type: 'binary',
  op: '+',
  left: {
    type: 'number',
    value: 1
  },
  right: {
    type: 'number',
    value: 2
  }
}
```

### 赋值（assign）
```
AssignStatement = {
  type: 'assign',
  left: DeclareStatement,
  right: BinaryStatement | NumberStatement
}
```
```
declare a = 1;

=> 

{
  type: 'assign',
  left: {
    type: 'declare',
    value: 'a',
  },
  right: {
    type: 'number',
    value: '1'
  }
}
```

### 输出（print）
```
PrintStatement = {
  type: 'print',
  value: DeclareStatement | NumberStatement
}
```