const sharedPreset = require('./tailwind.preset.js');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../dashboard-mfe/src/**/*.{js,ts,jsx,tsx}',
    '../transactions-mfe/src/**/*.{js,ts,jsx,tsx}',
    '../shell/src/**/*.{js,ts,jsx,tsx}',
    '../investments-mfe/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [sharedPreset],
};