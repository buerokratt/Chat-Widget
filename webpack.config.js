/* eslint-disable */
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    widget_bundle: path.resolve(__dirname, "src/index.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "widget_bundle.js",
    library: "$",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg/,
        type: "asset/resource",
        generator: {
          filename: "static/icons/[name].[contenthash:8][ext]",
        },
      },
      {
        test: /\.mp3$/,
        type: "asset/resource",
        generator: {
          filename: "static/[name].[contenthash:8][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/images/[name].[contenthash:8][ext]",
        },
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/fonts/[name].[contenthash:8][ext]",
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
};
