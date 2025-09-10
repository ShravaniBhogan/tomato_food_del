import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'   // imported createRoot directly
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root')
const root = createRoot(container)  // Use createRoot directly
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
