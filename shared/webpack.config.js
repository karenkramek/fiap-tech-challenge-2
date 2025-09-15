const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

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
        './components/ui/Button': './src/components/ui/Button',
        './components/ui/Card': './src/components/ui/Card',
        './components/ui/TransactionBadge': './src/components/ui/TransactionBadge',
        './components/layout/Header': './src/components/layout/Header',
        './components/layout/Sidebar': './src/components/layout/Sidebar',
        './hooks/useAccount': './src/hooks/useAccount',
        './hooks/useTransactions': './src/hooks/useTransactions',
        './models/Account': './src/models/Account',
        './models/Transaction': './src/models/Transaction',
        './services/AccountService': './src/services/AccountService',
        './services/TransactionService': './src/services/TransactionService',
        './services/api': './src/services/api',
        './utils/currencyUtils': './src/utils/currencyUtils',
        './utils/utils': './src/utils/utils',
        './styles/tokens.css': './src/styles/tokens.css'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        axios: { singleton: true }
      }
    })
  ]
};