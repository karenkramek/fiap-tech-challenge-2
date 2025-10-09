const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = {
  entry: "./src/app/index.tsx",
  mode: "development",
  devServer: {
    port: 3030,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-react", {
                runtime: 'automatic'
              }],
              "@babel/preset-typescript"
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: { postcssOptions: { config: "./postcss.config.js" } },
          },
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL || 'http://localhost:3034'),
      'REACT_APP_UPLOAD_URL': JSON.stringify(process.env.REACT_APP_UPLOAD_URL || 'http://localhost:3035')
    }),
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        dashboardMFE: `dashboardMFE@${process.env.REACT_APP_DASHBOARD_URL || 'http://localhost:3031'}/remoteEntry.js`,
        transactionsMFE: `transactionsMFE@${process.env.REACT_APP_TRANSACTIONS_URL || 'http://localhost:3032'}/remoteEntry.js`,
        shared: `shared@${process.env.REACT_APP_SHARED_URL || 'http://localhost:3033'}/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
          eager: true,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
          eager: true,
        },
        "react-redux": {
          singleton: true,
          requiredVersion: "^8.1.3",
          eager: true,
        },
        "@reduxjs/toolkit": {
          singleton: true,
          requiredVersion: "^1.9.7",
          eager: true,
        },
        "react-hot-toast": {
          singleton: true,
          requiredVersion: "^2.5.0",
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
};
