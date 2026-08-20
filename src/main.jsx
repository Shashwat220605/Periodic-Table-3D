import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PageNavigation from './components/PageNavigation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <PageNavigation />
  </StrictMode>,
)
