import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import Dashboard from './Dashboard'
import './styles.css'

// For local development - mount to DOM
const App = () => (
  <div>
    <Dashboard />
    <Toaster />
  </div>
)

const container = document.getElementById('root')!
const root = ReactDOM.createRoot(container)
root.render(<App />)