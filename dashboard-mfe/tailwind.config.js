const sharedPreset = require('../shared/tailwind.preset.js');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [sharedPreset],
};
