
const { resolve } = require("path")
const { env } = require("process")

const common = {
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
          "style-loader", 
          {
            loader: "css-loader",
            options: {
              url: false,
              importLoaders: 1
            }
          },
          "postcss-loader"
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

if (env.NODE_ENV === "production") {
  module.exports = {
    ...common,
    mode: "production"
  }
} else {
  module.exports = {
    ...common,
    mode: "development",
    devtool: false
  }
}