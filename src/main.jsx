import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PageNavigation from './components/PageNavigation.jsx'
import AtomBuilder from './components/AtomBuilder/AtomBuilder.jsx'
import TrendsExplorer from './components/Trends/TrendsExplorer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <PageNavigation />
    <AtomBuilder />
    <TrendsExplorer />
  </StrictMode>,
)
