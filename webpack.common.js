
const { resolve } = require("path")

module.exports = {
  entry: {
    gameCS: "./src/gameCS.ts",
    frameCS: "./src/frameCS.ts",
    background: "./src/background.ts",
    popup: "./src/popup/index.tsx"
  },
  output: {
    path: resolve(__dirname, "build", "unpacked")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.tsx']
  },
  // devtool: 'inline-source-map'
  devtool: false
}