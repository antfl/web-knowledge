
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return a / b;
};

module.exports = {
  add,
  subtract,
  multiply,
  divide
};
