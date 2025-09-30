const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  entry: './src/app/index.tsx',
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
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: './postcss.config.js'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL || 'http://localhost:3034')
    }),
    new ModuleFederationPlugin({
      name: 'dashboardMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/App.tsx'
      },
      remotes: {
        shared: 'shared@http://localhost:3033/remoteEntry.js',
        dashboardMFE: 'dashboardMFE@http://localhost:3031/remoteEntry.js',
        transactionsMFE: 'transactionsMFE@http://localhost:3032/remoteEntry.js',
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
        },
        'react-hot-toast': {
          singleton: true,
          requiredVersion: '^2.5.0',
          eager: false
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
