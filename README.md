# ⚛️ Periodic Explorer 3D

An interactive 3D periodic table built with React, Three.js and GSAP. Explore elements, inspect atomic structure, visualize orbitals and electron transitions, and open a live element dossier without leaving the experience.

## 🌐 Live Demo

**[Open Periodic Explorer 3D](https://periodic-table-3-d.vercel.app/)**

## ✨ Features

- 🧪 Interactive 3D periodic table with all 118 elements
- 🔎 Search by element name, symbol or atomic number
- ⚛️ Animated atom explorer with protons, neutrons and electrons
- 🌀 Electron configuration and shell visualization
- ☁️ Orbital Clouds visualizer
- 🧬 Combination Lab for chemistry exploration
- ↕️ Transition Lab for electron energy transitions and photon events
- 📚 **Element Dossier** with atomic data, classification, electron configuration and a live knowledge brief
- 🎞️ GSAP-powered camera and interface transitions
- 📱 Responsive UI for smaller screens

## 🧰 Tech Stack

- React + Vite
- React Three Fiber
- Three.js
- Drei
- React Three Postprocessing
- GSAP
- CSS

## 🚀 Run Locally

```bash
git clone https://github.com/Shashwat220605/Periodic-Table-3D.git
cd Periodic-Table-3D
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## 🧭 How to Explore

1. Browse the 3D periodic table.
2. Search for an element or select one directly.
3. Use **EXPLORE** to enter the atomic explorer.
4. Open **ELEMENT DOSSIER** for a deeper profile.
5. Try Orbital Clouds, Combination Lab and Transition Lab for interactive chemistry tools.

## 📖 Element Dossier

The dossier combines the project's local atomic dataset with a live public knowledge brief from Wikipedia's summary API. Local atomic information remains available even if the external knowledge request fails.

## 🗂️ Project Structure

```text
src/
├── components/
│   ├── Atom/
│   ├── ChemistryLab/
│   ├── ElementDossier/
│   ├── OrbitalLab/
│   ├── TransitionLab/
│   └── PeriodicTable/
├── data/
├── App.jsx
└── main.jsx
```

## 🔮 Roadmap

- Element comparison laboratory
- Interactive isotope explorer
- Periodic trend visualization upgrades
- Chemistry quiz mode
- Electron configuration builder
- Expanded element facts and historical data

## 📄 License

This project is intended as an educational and portfolio project.
