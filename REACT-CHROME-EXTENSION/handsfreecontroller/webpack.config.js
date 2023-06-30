const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  output: {
    path: path.join(__dirname, './../ extension'), // the bundle output path
    filename: "content.js", // the name of the bundle
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    })
  ],
  devServer: {
    port: 3030, // you can change the port
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      }
    ],

  },
  resolve: {
    fallback: {
      "fs": false
    },
  }

};