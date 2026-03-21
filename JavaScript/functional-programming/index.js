
function isPureFunction(fn, inputs, expectedOutput) {
  try {
    const result = fn(...inputs);
    return JSON.stringify(result) === JSON.stringify(expectedOutput);
  } catch (e) {
    return false;
  }
}

const pureAdd = (a, b) => a + b;

let externalState = 0;
const impureAdd = (a, b) => {
  externalState++;
  return a + b + externalState;
};

function immutablePush(arr, item) {
  return [...arr, item];
}

function immutableUpdate(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function immutableDelete(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function immutableObjectUpdate(obj, key, value) {
  return { ...obj, [key]: value };
}

function immutableObjectMerge(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

const greet = function(name) {
  return 'Hello, ' + name;
};

const applyFn = function(fn, value) {
  return fn(value);
};

const createMultiplier = function(multiplier) {
  return function(x) {
    return x * multiplier;
  };
};

const map = function(fn, arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i]));
  }
  return result;
};

const filter = function(fn, arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
};

const reduce = function(fn, initial, arr) {
  let result = initial;
  for (let i = 0; i < arr.length; i++) {
    result = fn(result, arr[i]);
  }
  return result;
};

function createCounter() {
  let count = 0;
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

function createCalculator(initialValue) {
  let value = initialValue;
  return {
    add: function(n) {
      value += n;
      return this;
    },
    subtract: function(n) {
      value -= n;
      return this;
    },
    multiply: function(n) {
      value *= n;
      return this;
    },
    getValue: function() {
      return value;
    }
  };
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

const partial = function(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn.apply(this, presetArgs.concat(laterArgs));
  };
};

function compose(...fns) {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

function pipe(...fns) {
  return function(x) {
    return fns.reduce(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

const double = x => x * 2;
const increment = x => x + 1;
const square = x => x * x;

const doubleThenIncrement = compose(increment, double);
const incrementThenDouble = pipe(increment, double);

function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const slowFunction = memoize(function(n) {
  console.log('计算中...');
  return n * 2;
});

function identity(x) {
  return x;
}

function always(value) {
  return function() {
    return value;
  };
}

function tap(fn) {
  return function(x) {
    fn(x);
    return x;
  };
}

function maybe(fn) {
  return function(x) {
    return x == null ? x : fn(x);
  };
}

function either(left, right, value) {
  return value != null ? right(value) : left();
}

class Maybe {
  constructor(value) {
    this._value = value;
  }

  static just(value) {
    return new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  isNothing() {
    return this._value == null;
  }

  map(fn) {
    return this.isNothing() ? Maybe.nothing() : Maybe.just(fn(this._value));
  }

  chain(fn) {
    return this.isNothing() ? Maybe.nothing() : fn(this._value);
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this._value;
  }
}

class Either {
  constructor(left, right) {
    this._left = left;
    this._right = right;
  }

  static left(value) {
    return new Either(value, null);
  }

  static right(value) {
    return new Either(null, value);
  }

  isLeft() {
    return this._left != null;
  }

  isRight() {
    return this._right != null;
  }

  fold(leftFn, rightFn) {
    return this.isLeft() ? leftFn(this._left) : rightFn(this._right);
  }

  map(fn) {
    return this.isLeft() ? Either.left(this._left) : Either.right(fn(this._right));
  }
}

const safeDivide = (a, b) => {
  return b === 0 ? Maybe.nothing() : Maybe.just(a / b);
};

function divide(a, b) {
  return b === 0 ? Either.left('除数不能为零') : Either.right(a / b);
}

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function* generateNumbers(start) {
  let current = start;
  while (true) {
    yield current++;
  }
}

function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function take(n, generator) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const next = generator.next();
    if (next.done) break;
    result.push(next.value);
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const users = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
  { id: 3, name: 'Charlie', age: 35, active: true },
  { id: 4, name: 'David', age: 28, active: true }
];

const trace = tap(x => console.log('Trace:', x));

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isPureFunction,
    pureAdd,
    impureAdd,
    immutablePush,
    immutableUpdate,
    immutableDelete,
    immutableObjectUpdate,
    immutableObjectMerge,
    greet,
    applyFn,
    createMultiplier,
    map,
    filter,
    reduce,
    createCounter,
    createCalculator,
    curry,
    curriedAdd,
    partial,
    compose,
    pipe,
    double,
    increment,
    square,
    doubleThenIncrement,
    incrementThenDouble,
    memoize,
    slowFunction,
    identity,
    always,
    tap,
    maybe,
    either,
    Maybe,
    Either,
    safeDivide,
    divide,
    range,
    generateNumbers,
    fibonacci,
    take,
    numbers,
    users,
    trace
  };
}
