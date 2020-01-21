const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.join(__dirname, '..', "/dist"),
    filename: "./index.js",
    chunkFilename: "[name].bundle.js",
  },
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  },
  devServer: {
    contentBase: path.join(__dirname, '..', "/dist"),
    compress: true,
    host: "0.0.0.0",
    port: 3000,
    sockHost: "localhost",
    sockPath: "/sockjs-node",
    sockPort: 80,
    watchContentBase: true,
    // progress: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: "/(node_modules|bower_components)/",
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          "file-loader"
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};
