const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

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
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        dashboardMFE: "dashboardMFE@http://localhost:3031/remoteEntry.js",
        transactionsMFE: "transactionsMFE@http://localhost:3032/remoteEntry.js",
        shared: "shared@http://localhost:3033/remoteEntry.js",
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
  ],
};
