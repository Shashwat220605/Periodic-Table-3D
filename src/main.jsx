import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './atomLayoutFix.css'
import './atomicExplorerTheme.css'
import App from './App.jsx'
import PageNavigation from './components/PageNavigation.jsx'
import AtomBuilder from './components/AtomBuilder/AtomBuilder.jsx'
import TrendsExplorer from './components/Trends/TrendsExplorer.jsx'
import CombinationLab from './components/ChemistryLab/CombinationLab.jsx'
import OrbitalVisualizer from './components/OrbitalLab/OrbitalVisualizer.jsx'
import TransitionLab from './components/TransitionLab/TransitionLab.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <PageNavigation />
    <AtomBuilder />
    <TrendsExplorer />
    <CombinationLab />
    <OrbitalVisualizer />
    <TransitionLab />
  </StrictMode>,
)
