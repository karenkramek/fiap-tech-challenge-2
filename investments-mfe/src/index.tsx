import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import Investments from './pages/Investments';
import './investments-styles.css';

const App = () => (
  <div className="min-h-screen bg-gray-50">
    <Toaster position="top-right" />
    <main className="container mx-auto px-4 py-8 flex-1">
      <Investments />
    </main>
  </div>
);

const root = document.getElementById('root');
ReactDOM.render(<App />, root);