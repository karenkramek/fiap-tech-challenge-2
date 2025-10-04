const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    port: 3036, 
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'react-redux': path.resolve('./node_modules/react-redux'),
      '@reduxjs/toolkit': path.resolve('./node_modules/@reduxjs/toolkit')
    }
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
              ['@babel/preset-react', {
                runtime: 'automatic'
              }],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { config: './postcss.config.js' } }
          }
        ]
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'investmentsMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './Investments': './src/pages/Investments'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '18.2.0',
          eager: true,
          strictVersion: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '18.2.0',
          eager: true,
          strictVersion: true
        },
        'react-redux': {
          singleton: true,
          requiredVersion: '8.1.3',
          eager: true,
          strictVersion: true
        },
        '@reduxjs/toolkit': {
          singleton: true,
          requiredVersion: '1.9.7',
          eager: true,
          strictVersion: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3001')
    })
  ]
};