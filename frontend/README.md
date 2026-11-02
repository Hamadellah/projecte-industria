# INDUSTRIA — Front-end cinématique

React + Vite, Three.js (machine de forage procédurale), GSAP ScrollTrigger, React Router, Lucide.
Tailwind CSS est chargé par CDN dans `index.html` (aucune configuration PostCSS).

## Lancer
    npm install
    npm run dev       # http://localhost:5173
    npm run build     # production -> dist/
    npm run preview

## Notes
- Machine 3D générée par code (`src/3d/drillScene.js`) : aucun modèle externe, donc aucune licence tierce.
- Produits, prix, stocks : données de démonstration (`src/data/products.js`). Aucun backend.
- Les visuels produits sont des illustrations techniques générées (aucune photo n'est fournie).
- Connexion internet requise pour Tailwind (CDN) et les polices Google Fonts.
