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
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shared',
      filename: 'remoteEntry.js',
      exposes: {
        // Components (UI)
        './components/ui/Button': './src/components/ui/Button',
        './components/ui/Card': './src/components/ui/Card',
        './components/ui/Icon': './src/components/ui/Icon',
        './components/ui/ConfirmationModal': './src/components/ui/ConfirmationModal',
        './components/ui/ModalWrapper': './src/components/ui/ModalWrapper',
        './components/ui/ModalCloseButton': './src/components/ui/ModalCloseButton',
        './components/ui/FeedbackProvider': './src/components/ui/FeedbackProvider',
        './components/ui/ErrorBoundary': './src/components/ui/ErrorBoundary',
        './components/ui/LoadingSpinner': './src/components/ui/LoadingSpinner',
        './components/ui/BadgeSuggestions': './src/components/ui/BadgeSuggestions',
        // Components (Domain - Transaction)
        './components/domain/transaction/TransactionAdd': './src/components/domain/transaction/TransactionAdd',
        './components/domain/transaction/TransactionTypeBadge': './src/components/domain/transaction/TransactionTypeBadge',
        './components/domain/transaction/TransactionList': './src/components/domain/transaction/TransactionList',
        './components/domain/transaction/TransactionEdit': './src/components/domain/transaction/TransactionEdit',
        // Components (Domain - File)
        './components/domain/file/AttachmentDisplay': './src/components/domain/file/AttachmentDisplay',
        './components/domain/file/FilePreviewModal': './src/components/domain/file/FilePreviewModal',
        './components/domain/file/FileUpload': './src/components/domain/file/FileUpload',
        // Components (Domain - Login)
        './components/domain/login/LoginModal': './src/components/domain/login/LoginModal',
        './components/domain/login/RegisterModal': './src/components/domain/login/RegisterModal',
        // Components (Domain - Outros)
        './components/domain/BalanceCard': './src/components/domain/BalanceCard',
        // Redux Store
        './store': './src/store/index.ts',
        // Hooks
        './hooks/useTransactions': './src/hooks/useTransactions',
        './hooks/useAccount': './src/hooks/useAccount',
        './hooks/useGroupedTransactions': './src/hooks/useGroupedTransactions',
        './hooks/useModal': './src/hooks/useModal',
        // DTOs
        './dtos/Transaction.dto': './src/dtos/Transaction.dto',
        './dtos/Account.dto': './src/dtos/Account.dto',
        './dtos/Investment.dto': './src/dtos/Investment.dto',
        // Models
        './models/Account': './src/models/Account',
        './models/Transaction': './src/models/Transaction',
        './models/Investment': './src/models/Investment',
        // Services
        './services/AccountService': './src/services/AccountService',
        './services/TransactionService': './src/services/TransactionService',
        './services/InvestmentService': './src/services/InvestmentService',
        './services/FileUploadService': './src/services/FileUploadService',
        './services/GoalService': './src/services/GoalService',
        './services/api': './src/services/api',
        // Utils
        './utils/currency': './src/utils/currency',
        './utils/date': './src/utils/date',
        './utils/test-utils': './src/utils/test-utils.tsx',
        // Types
        './types/TransactionType': './src/types/TransactionType',
        './types/InvestmentType': './src/types/InvestmentType',
        // Constants
        './constants/toast': './src/constants/toast',
        './constants/routes': './src/constants/routes',
        // Hooks (Auth)
        './hooks/useAuthProtection': './src/hooks/useAuthProtection'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
        'react-redux': { singleton: true, requiredVersion: '^8.1.3' },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: '^1.9.7' },
        axios: { singleton: true },
        'react-hot-toast': { singleton: true, requiredVersion: '^2.5.0' }
      }
    }),
    new webpack.DefinePlugin({
      'REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3034'),
      'REACT_APP_UPLOAD_URL': JSON.stringify(process.env.REACT_APP_UPLOAD_URL ?? 'http://localhost:3035')
    })
  ],
  entry: './src/app/index.ts',
};