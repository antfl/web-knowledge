
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return a / b;
};

const math = {
  add,
  subtract,
  multiply,
  divide
};

export default math;
