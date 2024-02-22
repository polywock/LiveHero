
const { resolve } = require("path")
const { env } = require("process")
const webpack = require("webpack")

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
        test: /\.css$/,
        exclude: /node_modules/,
        resourceQuery: { not: [/raw/] },
        use: [
            "style-loader", 
            {
              loader: "css-loader",
              options: {
                import: true,
              }
            },
            "postcss-loader"
        ],
      },
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.tsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      gvar: [resolve(__dirname, "src", "globalVar.ts"), "gvar"]
    })
  ]
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