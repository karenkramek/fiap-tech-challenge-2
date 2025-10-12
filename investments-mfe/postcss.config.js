const path = require('path');

module.exports = {
  plugins: {
    '@tailwindcss/postcss': { config: path.resolve(__dirname, '../../shared/tailwind.config.js') },
    autoprefixer: {},
  },
}
