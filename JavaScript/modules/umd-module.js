
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports);
  } else {
    root.umdMath = factory({});
  }
}(typeof self !== 'undefined' ? self : this, function(exports) {
  exports.add = (a, b) => a + b;
  exports.subtract = (a, b) => a - b;
  exports.multiply = (a, b) => a * b;
  exports.divide = (a, b) => {
    if (b === 0) {
      throw new Error('除数不能为零');
    }
    return a / b;
  };
  return exports;
}));
