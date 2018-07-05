const webpack = require("webpack");
const path = require('path');

module.exports = {
  mode: 'none',
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  plugins: []
};
