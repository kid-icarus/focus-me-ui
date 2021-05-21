// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [
  {
    mode: 'development',
    entry: './src/preload.ts',
    target: 'electron-main',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }],
        },
      ],
    },
    output: {
      path: __dirname + '/dist',
      filename: 'preload.js',
    },
  },
  // {
  //   mode: 'development',
  //   entry: './src/electron.ts',
  //   target: 'electron-main',
  //   module: {
  //     rules: [{
  //       test: /\.ts$/,
  //       include: /src/,
  //       use: [{ loader: 'ts-loader' }]
  //     }]
  //   },
  //   output: {
  //     path: __dirname + '/dist',
  //     filename: 'electron.js'
  //   }
  {
    mode: 'development',
    entry: './src/renderers/Main.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }],
        },
      ],
    },
    output: {
      path: __dirname + '/dist',
      filename: 'main.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
      }),
    ],
  },
  {
    mode: 'development',
    entry: './src/renderers/Preferences.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }],
        },
      ],
    },
    output: {
      path: __dirname + '/dist',
      filename: 'preferences.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/preferences.html',
        filename: 'preferences.html',
      }),
    ],
  },
]
