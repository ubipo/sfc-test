const path = require('path')

const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  output: {
    publicPath: '/'
  },
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.ts'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(ts|js)$/,
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                "targets": {
                  'esmodules': true
                }
              }],
              "@babel/typescript"
            ],
            plugins: [
              "@babel/proposal-object-rest-spread",
              "@babel/plugin-transform-typescript",
              "@babel/plugin-syntax-dynamic-import",
              ["@babel/plugin-transform-runtime", {
                "corejs": 3
              }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      filename: 'index.html',
      inject: 'body',
      scriptLoading: 'blocking'
    })
  ]
}
