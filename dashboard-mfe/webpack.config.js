const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    port: 3031,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify('http://localhost:3034'),
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new ModuleFederationPlugin({
      name: 'dashboardMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/Dashboard'
      },
      remotes: {
        shared: 'shared@http://localhost:3033/remoteEntry.js'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: false
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: false
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};