# Webpack 详解

## 配置模板使用说明

本目录提供了多种 Webpack 配置模板，位于 `templates/` 目录下：

### 基础配置模板

- `webpack-basic.js` - 基础 Webpack 配置
- `webpack-dev.js` - 开发环境配置
- `webpack-prod.js` - 生产环境配置

### 框架配置模板

- `webpack-react.js` - React 项目配置
- `webpack-vue.js` - Vue 项目配置

### 高级配置模板

- `webpack-multi-page.js` - 多页面应用配置
- `webpack-optimized.js` - 优化配置（包含缓存、并行构建、图片优化等）

### 如何使用配置模板

1. **选择合适的配置模板**：
   - 根据项目类型（React、Vue、多页面等）选择对应的配置
   - 根据环境（开发、生产）选择对应的配置

2. **复制配置文件**：
   - 复制 `templates/` 目录下对应的配置文件到项目根目录
   - 重命名为 `webpack.config.js`

3. **安装必要的依赖**：
   ```bash
   # 基础依赖
   npm install webpack webpack-cli html-webpack-plugin webpack-dev-server --save-dev
   
   # 生产环境依赖
   npm install clean-webpack-plugin mini-css-extract-plugin css-minimizer-webpack-plugin terser-webpack-plugin --save-dev
   
   # React 项目依赖
   npm install babel-loader @babel/core @babel/preset-env @babel/preset-react --save-dev
   
   # Vue 项目依赖
   npm install babel-loader @babel/core @babel/preset-env vue-loader vue-template-compiler --save-dev
   
   # 图片优化依赖
   npm install image-webpack-loader --save-dev
   
   # 并行构建依赖
   npm install thread-loader --save-dev
   ```

4. **根据项目需求修改配置**：
   - 修改入口文件路径
   - 修改输出目录
   - 调整 loaders 和 plugins 配置
   - 根据项目需求调整优化选项

5. **配置 package.json 脚本**：
   ```json
   {
     "scripts": {
       "dev": "webpack serve",
       "build": "webpack",
       "build:analyze": "webpack --profile --json > stats.json && npx webpack-bundle-analyzer stats.json"
     }
   }
   ```

### 配置文件说明

所有配置模板都包含详细的注释说明，帮助你理解每个配置项的作用。配置文件中的路径和选项需要根据项目实际情况进行调整。

## 什么是 Webpack？

Webpack 是一个现代 JavaScript 应用的静态模块打包工具。它将应用程序中的各种资源（如 JavaScript、CSS、图片等）视为模块，通过加载器（loaders）处理这些模块，然后通过插件（plugins）进行进一步处理，最终生成优化后的静态资源。

## 为什么使用 Webpack？

1. **模块管理**：支持 CommonJS、ES Modules、AMD 等多种模块系统
2. **资源处理**：可以处理 JavaScript、CSS、图片、字体等多种资源
3. **代码优化**：自动进行代码分割、压缩、Tree Shaking 等优化
4. **开发体验**：提供热模块替换（HMR）、源码映射（Source Map）等功能
5. **生态丰富**：拥有大量的加载器和插件，社区活跃

## Webpack 核心概念

### 1. 入口（Entry）

入口是 Webpack 构建的起点，指定从哪个文件开始构建依赖图。

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js'
};
```

### 2. 输出（Output）

输出指定 Webpack 构建后的文件存放在哪里，以及如何命名这些文件。

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

### 3. 加载器（Loaders）

加载器用于处理非 JavaScript 文件，将它们转换为 Webpack 可以处理的模块。

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

### 4. 插件（Plugins）

插件用于执行更复杂的任务，如代码分割、环境变量注入、文件压缩等。

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};
```

### 5. 模式（Mode）

模式指定 Webpack 的构建环境，有 development、production 和 none 三种模式。

```javascript
// webpack.config.js
module.exports = {
  mode: 'production'
};
```

## Webpack 基本配置

### 1. 安装 Webpack

```bash
# 安装 Webpack 和 Webpack CLI
npm install webpack webpack-cli --save-dev

# 安装常用依赖
npm install html-webpack-plugin webpack-dev-server --save-dev
```

### 2. 基础配置文件

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};
```

### 3. 配置 package.json 脚本

```json
// package.json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack"
  }
}
```

## 常用 Loaders

### 1. 处理 CSS

- **css-loader**：解析 CSS 文件
- **style-loader**：将 CSS 注入到 DOM 中
- **sass-loader**：处理 Sass/SCSS 文件
- **postcss-loader**：使用 PostCSS 处理 CSS

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
```

### 2. 处理 JavaScript

- **babel-loader**：使用 Babel 转译 JavaScript

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

### 3. 处理图片和字体

- **asset/resource**：将文件输出为单独的文件
- **asset/inline**：将文件内联为 data URI
- **asset**：根据文件大小自动选择

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ]
  }
};
```

## 常用 Plugins

### 1. HtmlWebpackPlugin

自动生成 HTML 文件，并注入打包后的资源。

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Webpack App',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ]
};
```

### 2. MiniCssExtractPlugin

将 CSS 提取为单独的文件。

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash].css'
    })
  ]
};
```

### 3. CleanWebpackPlugin

在构建前清理输出目录。

```javascript
// webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin()
  ]
};
```

### 4. DefinePlugin

定义环境变量。

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
```

## 开发环境配置

### 1. 开发服务器

```javascript
// webpack.config.js
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    hot: true,
    open: true,
    compress: true
  }
};
```

### 2. 热模块替换（HMR）

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

## 生产环境配置

### 1. 基本配置

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js'
  }
};
```

### 2. 代码分割

#### 入口分割

```javascript
// webpack.config.js
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  output: {
    filename: 'js/[name].[contenthash].js'
  }
};
```

#### 动态导入

```javascript
// 代码中使用动态导入
import('./module').then(module => {
  // 使用模块
});
```

#### SplitChunks 配置

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

## Webpack 优化技巧

### 1. 提升构建速度

- **使用缓存**：开启持久化缓存
- **并行构建**：使用 thread-loader
- **减少解析**：合理配置 resolve
- **排除不需要的文件**：使用 exclude

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }
    ]
  }
};
```

### 2. 提升输出质量

- **Tree Shaking**：移除未使用的代码
- **代码压缩**：使用 TerserPlugin
- **CSS 优化**：使用 CSS Minimizer
- **图片优化**：使用 image-webpack-loader

```javascript
// webpack.config.js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              }
            }
          }
        ]
      }
    ]
  }
};
```

### 3. 性能分析

使用 webpack-bundle-analyzer 分析打包结果。

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

## 常见问题与解决方案

### 1. 构建失败

**问题**：模块解析失败
**解决方案**：检查模块路径，确保路径正确

**问题**：Loader 配置错误
**解决方案**：检查 Loader 配置，确保安装了相应的依赖

### 2. 性能问题

**问题**：构建速度慢
**解决方案**：使用缓存，并行构建，减少解析范围

**问题**：打包文件过大
**解决方案**：代码分割，Tree Shaking，图片优化

### 3. 开发体验

**问题**：热模块替换不工作
**解决方案**：检查 devServer 配置，确保开启了 hot: true

**问题**：源码映射不正确
**解决方案**：配置正确的 devtool 选项

## 实际项目案例

### 1. 基础 React 项目配置

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js'
  },
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

### 2. 多页面应用配置

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/home.html',
      filename: 'home.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      template: './src/about.html',
      filename: 'about.html',
      chunks: ['about']
    })
  ]
};
```

## 学习资源

- [Webpack 官方文档](https://webpack.js.org/)
- [Webpack 中文文档](https://webpack.docschina.org/)
- [Webpack 实战](https://webpack.wuhaolin.cn/)
- [Webpack 4 入门到精通](https://juejin.im/post/5b5d4b8c51882519790c7441)

## 总结

Webpack 是一个功能强大的静态模块打包工具，通过合理配置可以显著提升前端项目的开发效率和构建质量。对于初学者来说，建议从基础配置开始，逐步掌握核心概念和优化技巧。

在实际项目中，应根据项目特点选择合适的配置方案，平衡构建速度和输出质量。随着经验的积累，可以探索更高级的配置选项和插件，进一步优化构建流程。