import React from 'react';

const ColorShowcase = () => {
  const colors = {
    primary: [
      { name: 'primary-100', class: 'bg-primary-100', hex: '#E2F6FF' },
      { name: 'primary-200', class: 'bg-primary-200', hex: '#CDF1FF' },
      { name: 'primary-300', class: 'bg-primary-300', hex: '#B1E2F6' },
      { name: 'primary-700', class: 'bg-primary-700', hex: '#264653' },
    ],
    secondary: [
      { name: 'secondary-300', class: 'bg-secondary-300', hex: '#F4A261' },
    ],
    tertiary: [
      { name: 'tertiary-500', class: 'bg-tertiary-500', hex: '#2A9D8F' },
      { name: 'tertiary-700', class: 'bg-tertiary-700', hex: '#094B43' },
    ],
    status: [
      { name: 'success-700', class: 'bg-success-700', hex: '#388E3C' },
      { name: 'error-700', class: 'bg-error-700', hex: '#D32F2F' },
      { name: 'warning-700', class: 'bg-warning-700', hex: '#F57F17' },
      { name: 'info-700', class: 'bg-info-700', hex: '#1976D2' },
    ],
    neutral: [
      { name: 'white-700', class: 'bg-white-700', hex: '#B5B5B5' },
      { name: 'white-800', class: 'bg-white-800', hex: '#8C8C8C' },
      { name: 'black-400', class: 'bg-black-400', hex: '#333333' },
    ],
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-black-400">
          ByteBank Color System
        </h1>
        <p className="mb-8 text-white-800">
          Color tokens available via Tailwind classes
        </p>

        {/* Primary Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black-400">
            Primary Colors (Brand Teal)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.primary.map((color) => (
              <div key={color.name} className="group">
                <div
                  className={`w-full h-20 rounded-lg border border-white-700 mb-2 cursor-pointer transition-transform hover:scale-105 ${color.class}`}
                  title={`${color.name}: ${color.hex}`}
                />
                <div className="text-sm">
                  <div className="font-medium text-black-400">
                    {color.name}
                  </div>
                  <div className="font-mono text-xs text-white-800">
                    {color.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tertiary Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black-400">
            Tertiary Colors (Green)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.tertiary.map((color) => (
              <div key={color.name} className="group">
                <div
                  className={`w-full h-20 rounded-lg border border-white-700 mb-2 cursor-pointer transition-transform hover:scale-105 ${color.class}`}
                  title={`${color.name}: ${color.hex}`}
                />
                <div className="text-sm">
                  <div className="font-medium text-black-400">
                    {color.name}
                  </div>
                  <div className="font-mono text-xs text-white-800">
                    {color.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black-400">
            Status Colors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.status.map((color) => (
              <div key={color.name} className="group">
                <div
                  className={`w-full h-20 rounded-lg border border-white-700 mb-2 cursor-pointer transition-transform hover:scale-105 ${color.class}`}
                  title={`${color.name}: ${color.hex}`}
                />
                <div className="text-sm">
                  <div className="font-medium text-black-400">
                    {color.name}
                  </div>
                  <div className="font-mono text-xs text-white-800">
                    {color.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black-400">
            Secondary Colors (Orange)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.secondary.map((color) => (
              <div key={color.name} className="group">
                <div
                  className={`w-full h-20 rounded-lg border border-white-700 mb-2 cursor-pointer transition-transform hover:scale-105 ${color.class}`}
                  title={`${color.name}: ${color.hex}`}
                />
                <div className="text-sm">
                  <div className="font-medium text-black-400">
                    {color.name}
                  </div>
                  <div className="font-mono text-xs text-white-800">
                    {color.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black-400">
            Neutral Colors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.neutral.map((color) => (
              <div key={color.name} className="group">
                <div
                  className={`w-full h-20 rounded-lg border border-white-700 mb-2 cursor-pointer transition-transform hover:scale-105 ${color.class}`}
                  title={`${color.name}: ${color.hex}`}
                />
                <div className="text-sm">
                  <div className="font-medium text-black-400">
                    {color.name}
                  </div>
                  <div className="font-mono text-xs text-white-800">
                    {color.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Component Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black-400">
            Component Examples
          </h3>
          <div className="space-y-4">
            {/* Buttons using Tailwind classes */}
            <div>
              <h4 className="font-medium mb-2 text-black-400">Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-lg text-white-50 hover:opacity-90 bg-primary-700">
                  Primary
                </button>
                <button className="px-4 py-2 rounded-lg border border-white-700 bg-white-50 text-black-400 hover:opacity-90">
                  Secondary
                </button>
                <button className="px-4 py-2 rounded-lg text-white-50 hover:opacity-90 bg-tertiary-500">
                  Tertiary
                </button>
                <button className="px-4 py-2 rounded-lg text-white-50 hover:opacity-90 bg-error-700">
                  Error
                </button>
                <button className="px-4 py-2 rounded-lg text-white-50 hover:opacity-90 bg-success-700">
                  Success
                </button>
              </div>
            </div>

            {/* Cards using Tailwind classes */}
            <div>
              <h4 className="font-medium mb-2 text-black-400">Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary-700">
                  <h5 className="font-medium text-white-50">Primary Card</h5>
                  <p className="text-white-50">Card content goes here</p>
                </div>
                <div className="p-4 rounded-lg border border-white-700 bg-white-50">
                  <h5 className="font-medium text-black-400">Light Card</h5>
                  <p className="text-white-800">Card content goes here</p>
                </div>
                <div className="p-4 rounded-lg text-white-50 bg-tertiary-500">
                  <h5 className="font-medium">Tertiary Card</h5>
                  <p>Card content goes here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-black-400">
            Typography
          </h3>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black-400">
              Heading 1 - Rubik Bold
            </h1>
            <h2 className="text-2xl font-semibold text-black-400">
              Heading 2 - Rubik Semibold
            </h2>
            <p className="text-base text-black-400">
              Body text - Inter Regular
            </p>
            <p className="text-sm text-white-800">
              Small text - Inter Muted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorShowcase;
