const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3033,
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
    new ModuleFederationPlugin({
      name: 'shared',
      filename: 'remoteEntry.js',
      exposes: {
        // Components
        './components/Button': './src/components/Button',
        './components/Card': './src/components/Card',
        './components/TransactionBadge': './src/components/TransactionBadge',
        './components/ConfirmationModal': './src/components/ConfirmationModal',
        './components/EditTransactionModal': './src/components/EditTransactionModal',
        './components/Header': './src/components/Header',
        './components/Sidebar': './src/components/Sidebar',
        './components/TransactionForm': './src/components/TransactionForm',
        './components/StatementCard': './src/components/StatementCard',
        './components/BalanceCard': './src/components/BalanceCard',
        './components/Icon': './src/components/Icon',
        // Hooks
        './hooks/useTransactions': './src/hooks/useTransactions',
        './hooks/useAccount': './src/hooks/useAccount',
        './hooks/useGroupedTransactions': './src/hooks/useGroupedTransactions',
        './hooks/useModal': './src/hooks/useModal',
        // DTOs
        './dtos/Transaction.dto': './src/dtos/Transaction.dto',
        './dtos/Account.dto': './src/dtos/Account.dto',
        // Models
        './models/Account': './src/models/Account',
        './models/Transaction': './src/models/Transaction',
        // Services
        './services/AccountService': './src/services/AccountService',
        './services/TransactionService': './src/services/TransactionService',
        './services/api': './src/services/api',
        // Utils
        './utils/currencyUtils': './src/utils/currencyUtils',
        './utils/utils': './src/utils/utils',
        // Types
        './types/TransactionType': './src/types/TransactionType',
        // Styles
        './styles/tokens.css': './src/styles/tokens.css',
        // Index (caso queira importar tudo de shared)
        './index': './src/index.ts'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        axios: { singleton: true }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL || 'http://localhost:3034')
    })
  ]
};