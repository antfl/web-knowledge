
function demonstrateCommonJS() {
  console.log('=== CommonJS 示例 ===');
  
  const math = require('./commonjs-math.js');
  
  console.log('add(2, 3):', math.add(2, 3));
  console.log('subtract(5, 2):', math.subtract(5, 2));
  console.log('multiply(4, 5):', math.multiply(4, 5));
  try {
    console.log('divide(10, 2):', math.divide(10, 2));
  } catch (e) {
    console.log('divide error:', e.message);
  }
}

function demonstrateNamedExports() {
  console.log('\n=== 命名导出和导入 ===');
  
  const math = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
  };
  
  const { add, subtract } = math;
  console.log('add(2, 3):', add(2, 3));
  console.log('subtract(5, 2):', subtract(5, 2));
}

function demonstrateRenamingImports() {
  console.log('\n=== 重命名导入 ===');
  
  const math = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
  };
  
  const { add: sum, subtract: difference } = math;
  console.log('sum(2, 3):', sum(2, 3));
  console.log('difference(5, 2):', difference(5, 2));
}

function demonstrateNamespaceImport() {
  console.log('\n=== 命名空间导入 ===');
  
  const math = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b
  };
  
  console.log('math.add(2, 3):', math.add(2, 3));
  console.log('math.multiply(4, 5):', math.multiply(4, 5));
}

function demonstrateMixedImports() {
  console.log('\n=== 混合导入（命名 + 默认） ===');
  
  const mathModule = {
    default: {
      name: 'Math Module',
      version: '1.0.0'
    },
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
  };
  
  const defaultModule = mathModule.default;
  const { add, subtract } = mathModule;
  
  console.log('Module name:', defaultModule.name);
  console.log('add(2, 3):', add(2, 3));
}

function demonstrateModulePattern() {
  console.log('\n=== 模块模式（闭包封装） ===');
  
  const createCounter = (function() {
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
  })();
  
  console.log('increment():', createCounter.increment());
  console.log('increment():', createCounter.increment());
  console.log('decrement():', createCounter.decrement());
  console.log('getCount():', createCounter.getCount());
}

function demonstrateFactoryModule() {
  console.log('\n=== 工厂函数模块 ===');
  
  function createUserManager() {
    const users = [];
    
    return {
      addUser: function(user) {
        users.push(user);
      },
      removeUser: function(id) {
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
          users.splice(index, 1);
        }
      },
      getUsers: function() {
        return [...users];
      },
      getUserById: function(id) {
        return users.find(u => u.id === id);
      }
    };
  }
  
  const userManager = createUserManager();
  userManager.addUser({ id: 1, name: 'Alice' });
  userManager.addUser({ id: 2, name: 'Bob' });
  console.log('All users:', userManager.getUsers());
  console.log('User with id 1:', userManager.getUserById(1));
}

function demonstrateRevealingModulePattern() {
  console.log('\n=== 揭示模块模式 ===');
  
  const calculator = (function() {
    let result = 0;
    
    function add(a) {
      result += a;
      return this;
    }
    
    function subtract(a) {
      result -= a;
      return this;
    }
    
    function multiply(a) {
      result *= a;
      return this;
    }
    
    function getResult() {
      return result;
    }
    
    function reset() {
      result = 0;
      return this;
    }
    
    return {
      add,
      subtract,
      multiply,
      getResult,
      reset
    };
  })();
  
  console.log('Calculator chain:', calculator.add(10).subtract(3).multiply(2).getResult());
}

function demonstrateCircularDependencyAvoidance() {
  console.log('\n=== 避免循环依赖的方法 ===');
  
  function ModuleA() {
    this.name = 'Module A';
  }
  
  ModuleA.prototype.useModuleB = function(moduleB) {
    console.log(`${this.name} using ${moduleB.name}`);
  };
  
  function ModuleB() {
    this.name = 'Module B';
  }
  
  ModuleB.prototype.useModuleA = function(moduleA) {
    console.log(`${this.name} using ${moduleA.name}`);
  };
  
  const a = new ModuleA();
  const b = new ModuleB();
  a.useModuleB(b);
  b.useModuleA(a);
}

function demonstrateLazyLoading() {
  console.log('\n=== 懒加载/动态导入示例 ===');
  
  const moduleCache = {};
  
  function loadModule(moduleName) {
    if (moduleCache[moduleName]) {
      console.log(`Module ${moduleName} loaded from cache`);
      return moduleCache[moduleName];
    }
    
    console.log(`Loading module ${moduleName}...`);
    const module = {
      name: moduleName,
      loadedAt: new Date().toISOString(),
      doSomething: function() {
        console.log(`${moduleName} doing something`);
      }
    };
    
    moduleCache[moduleName] = module;
    return module;
  }
  
  const module1 = loadModule('utils');
  const module2 = loadModule('utils');
  module1.doSomething();
}

function demonstrateTreeShakingConcept() {
  console.log('\n=== Tree Shaking 概念 ===');
  
  const fullModule = {
    usedFunction1: () => 'Used',
    usedFunction2: () => 'Also used',
    unusedFunction: () => 'Not used',
    anotherUnused: () => 'Also not used'
  };
  
  const { usedFunction1, usedFunction2 } = fullModule;
  console.log('Tree shaking keeps only used functions:');
  console.log('usedFunction1():', usedFunction1());
  console.log('usedFunction2():', usedFunction2());
}

function demonstrateModuleBestPractices() {
  console.log('\n=== 模块化最佳实践 ===');
  
  console.log('1. 单一职责 - 每个模块只做一件事');
  console.log('2. 明确的接口 - 只导出必要的内容');
  console.log('3. 避免全局污染 - 使用模块封装');
  console.log('4. 依赖注入 - 减少硬编码依赖');
  console.log('5. 可测试性 - 模块化使测试更容易');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    demonstrateCommonJS,
    demonstrateNamedExports,
    demonstrateRenamingImports,
    demonstrateNamespaceImport,
    demonstrateMixedImports,
    demonstrateModulePattern,
    demonstrateFactoryModule,
    demonstrateRevealingModulePattern,
    demonstrateCircularDependencyAvoidance,
    demonstrateLazyLoading,
    demonstrateTreeShakingConcept,
    demonstrateModuleBestPractices
  };
  
  if (require.main === module) {
    demonstrateCommonJS();
    demonstrateNamedExports();
    demonstrateRenamingImports();
    demonstrateNamespaceImport();
    demonstrateMixedImports();
    demonstrateModulePattern();
    demonstrateFactoryModule();
    demonstrateRevealingModulePattern();
    demonstrateCircularDependencyAvoidance();
    demonstrateLazyLoading();
    demonstrateTreeShakingConcept();
    demonstrateModuleBestPractices();
  }
}
