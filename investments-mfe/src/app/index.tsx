import { createRoot } from 'react-dom/client';
import App from '../App';
import '../styles/investments-styles.css';

import('./bootstrap');

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
