# Investments Micro Frontend

This project is a micro frontend application that displays investment data and provides financial analysis through charts. It is built using React and TypeScript.

## Project Structure

```
investments-mfe
├── src
│   ├── pages
│   │   └── Investments.tsx        # Main component for displaying investments
│   ├── components
│   │   ├── InvestmentList.tsx      # Component for listing investments
│   │   └── FinancialCharts.tsx      # Component for displaying financial analysis charts
│   └── types
│       └── index.ts                # Type definitions for the project
├── public
│   └── index.html                  # Main HTML file for the application
├── package.json                     # NPM configuration file
├── tsconfig.json                   # TypeScript configuration file
├── webpack.config.js               # Webpack configuration file
└── README.md                       # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd investments-mfe
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

This will launch the application in your default web browser.

## Features

- Fetches and displays a list of investments.
- Provides financial analysis charts based on the investment data.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.