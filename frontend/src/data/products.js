// DONNÉES DE DÉMONSTRATION — prix, stocks et références sont fictifs.
// Aucune connexion à un système commercial réel.

export const categories = [
  { slug: 'machines-de-forage', name: 'Machines de forage', icon: 'Drill', blurb: 'Foreuses sur chenilles ou sur camion, du puits villageois au forage profond.' },
  { slug: 'tiges-et-trepans', name: 'Tiges et trépans', icon: 'Pickaxe', blurb: 'Garnitures de forage, outils de coupe et marteaux fond de trou.' },
  { slug: 'tubages-et-accessoires', name: 'Tubages et accessoires de puits', icon: 'Cylinder', blurb: 'Tubes pleins, crépines, graviers filtrants et têtes de puits.' },
  { slug: 'pompes-immergees', name: 'Pompes immergées', icon: 'Waves', blurb: 'Pompes multicellulaires pour l’exhaure, l’eau potable et l’irrigation.' },
  { slug: 'moteurs-et-commandes', name: 'Moteurs et systèmes de commande', icon: 'Zap', blurb: 'Moteurs submersibles, variateurs et coffrets de protection.' },
  { slug: 'tuyaux-raccords-vannes', name: 'Tuyaux, raccords et vannes', icon: 'Cable', blurb: 'Colonnes d’exhaure, raccords, clapets et vannes de régulation.' },
  { slug: 'irrigation', name: 'Équipements d’irrigation', icon: 'Sprout', blurb: 'Goutte-à-goutte, pivots, rampes et filtration pour l’agriculture.' },
]

export const products = [
  {
    id: 'ind-fx-300', category: 'machines-de-forage', name: 'Foreuse FX-300 sur chenilles', ref: 'FX-300', price: 148000,
    summary: 'Foreuse rotary hydraulique pour forages d’eau jusqu’à 300 m.',
    description: 'Foreuse compacte à mât télescopique, conçue pour les terrains mixtes (sable, argile, roche tendre). Tête de rotation hydraulique à vitesse variable et treuil de service intégré.',
    specs: { 'Profondeur max.': '300 m', 'Diamètre de forage': '90 – 305 mm', 'Couple de rotation': '7 500 Nm', 'Poussée / traction': '90 / 120 kN', 'Motorisation': 'Diesel 129 kW' },
  },
  {
    id: 'ind-tx-600', category: 'machines-de-forage', name: 'Foreuse TX-600 sur camion', ref: 'TX-600', price: 312000,
    summary: 'Foreuse montée sur porteur 6x6 pour forages profonds et mobiles.',
    description: 'Ensemble porteur et foreuse pour chantiers dispersés. Compresseur d’air haute pression pour forage au marteau fond de trou, cabine de commande déportée.',
    specs: { 'Profondeur max.': '600 m', 'Diamètre de forage': '115 – 445 mm', 'Couple de rotation': '14 000 Nm', 'Compresseur': '25 bar / 24 m³/min', 'Porteur': '6x6, 380 ch' },
  },
  {
    id: 'ind-mx-80', category: 'machines-de-forage', name: 'Foreuse portable MX-80', ref: 'MX-80', price: 36500,
    summary: 'Foreuse légère démontable pour puits peu profonds et accès difficiles.',
    description: 'Démontable en modules de moins de 90 kg, elle se transporte à dos de véhicule léger. Adaptée aux forages d’eau domestiques et aux piézomètres.',
    specs: { 'Profondeur max.': '80 m', 'Diamètre de forage': '75 – 165 mm', 'Poids total': '480 kg', 'Motorisation': 'Diesel 22 kW', 'Module le plus lourd': '88 kg' },
  },
  {
    id: 'ind-rod-76', category: 'tiges-et-trepans', name: 'Tige de forage Ø76 mm, 3 m', ref: 'TG-76-3', price: 410,
    summary: 'Tige en acier allié, filetage API renforcé.',
    description: 'Tige à haute résistance à la torsion, traitée thermiquement. Compatible avec les foreuses de la gamme FX et MX.',
    specs: { 'Diamètre': '76 mm', 'Longueur': '3 m', 'Matière': 'Acier allié 34CrMo4', 'Filetage': 'API 2 3/8" REG', 'Poids': '27 kg' },
  },
  {
    id: 'ind-bit-tri-165', category: 'tiges-et-trepans', name: 'Trépan tricône Ø165 mm', ref: 'TC-165', price: 1280,
    summary: 'Trépan à molettes pour formations tendres à moyennes.',
    description: 'Trois cônes à dents en acier fraisées, roulements étanches graissés. Pour argiles, marnes et calcaires tendres.',
    specs: { 'Diamètre': '165 mm (6 1/2")', 'Type': 'Tricône à dents', 'Formations': 'Tendres à moyennes', 'Raccord': 'API 3 1/2" REG', 'Poids': '19 kg' },
  },
  {
    id: 'ind-dth-125', category: 'tiges-et-trepans', name: 'Marteau fond de trou Ø125 mm', ref: 'DTH-125', price: 2950,
    summary: 'Marteau pneumatique pour roche dure, avec taillant à boutons.',
    description: 'Marteau haute pression pour forage dans le granite et le basalte. Livré avec un taillant à boutons carbure.',
    specs: { 'Diamètre': '125 mm', 'Pression de service': '10 – 25 bar', 'Consommation d’air': 'jusqu’à 20 m³/min', 'Taillant': 'Boutons carbure', 'Poids': '41 kg' },
  },
  {
    id: 'ind-case-pvc-125', category: 'tubages-et-accessoires', name: 'Tubage PVC pression Ø125 mm, 3 m', ref: 'TB-PVC-125', price: 96,
    summary: 'Tube plein à emboîtement fileté pour eau potable.',
    description: 'PVC rigide de qualité alimentaire, filetage mâle-femelle sans colle. Adapté aux profondeurs jusqu’à 250 m.',
    specs: { 'Diamètre extérieur': '125 mm', 'Longueur': '3 m', 'Épaisseur': '7,5 mm', 'Pression d’éclatement': '40 bar', 'Matière': 'PVC-U alimentaire' },
  },
  {
    id: 'ind-screen-inox-150', category: 'tubages-et-accessoires', name: 'Crépine inox à fente continue Ø150 mm', ref: 'CR-INOX-150', price: 780,
    summary: 'Crépine fil enroulé pour capter l’eau en filtrant le sable.',
    description: 'Fil profilé en V soudé sur nervures, ouverture de fente au choix. Résiste à la corrosion et au colmatage.',
    specs: { 'Diamètre': '150 mm', 'Longueur': '3 m', 'Fente': '0,5 – 2 mm', 'Matière': 'Inox 304', 'Surface ouverte': '≈ 12 %' },
  },
  {
    id: 'ind-wellhead-6', category: 'tubages-et-accessoires', name: 'Tête de puits étanche 6"', ref: 'TP-6', price: 340,
    summary: 'Capot de protection avec passage de câble et évent.',
    description: 'Acier galvanisé, joint EPDM, passage de câble étanche et évent grillagé. Protège le forage des infiltrations.',
    specs: { 'Diamètre': '6"', 'Matière': 'Acier galvanisé', 'Joint': 'EPDM', 'Passages': 'Câble + sonde', 'Poids': '9 kg' },
  },
  {
    id: 'ind-sp-4-30', category: 'pompes-immergees', name: 'Pompe immergée SP-4/30 inox', ref: 'SP-4/30', price: 1450,
    summary: 'Pompe multicellulaire 4" pour puits domestiques et irrigation légère.',
    description: 'Corps et roues en inox, clapet de retenue intégré. Débit constant sur une large plage de hauteur manométrique.',
    specs: { 'Débit nominal': '4 m³/h', 'HMT max.': '210 m', 'Puissance': '2,2 kW', 'Tension': '230 V mono', 'Diamètre': '4"' },
  },
  {
    id: 'ind-sp-6-60', category: 'pompes-immergees', name: 'Pompe immergée SP-6/60 inox', ref: 'SP-6/60', price: 3980,
    summary: 'Pompe 6" pour forages d’exploitation agricole et collectifs.',
    description: 'Étages en inox moulé, paliers lisses lubrifiés par l’eau pompée. Conçue pour un fonctionnement continu.',
    specs: { 'Débit nominal': '30 m³/h', 'HMT max.': '120 m', 'Puissance': '11 kW', 'Tension': '400 V tri', 'Diamètre': '6"' },
  },
  {
    id: 'ind-sp-8-120', category: 'pompes-immergees', name: 'Pompe immergée SP-8/120', ref: 'SP-8/120', price: 9200,
    summary: 'Pompe haut débit pour adduction d’eau et grands périmètres.',
    description: 'Pompe 8" à étages en fonte et inox, refoulement à bride. Prévue pour un pilotage par variateur.',
    specs: { 'Débit nominal': '120 m³/h', 'HMT max.': '90 m', 'Puissance': '45 kW', 'Tension': '400 V tri', 'Diamètre': '8"' },
  },
  {
    id: 'ind-mot-6-11', category: 'moteurs-et-commandes', name: 'Moteur submersible 6" — 11 kW', ref: 'MS-6-11', price: 2650,
    summary: 'Moteur immergé rempli d’eau, rotor à cage.',
    description: 'Bobinage résistant à l’eau, butée à segments. Se couple à toutes les pompes de la gamme SP en 6".',
    specs: { 'Puissance': '11 kW', 'Tension': '400 V tri', 'Diamètre': '6"', 'Rendement': 'IE3', 'Refroidissement': 'Eau, vitesse ≥ 0,2 m/s' },
  },
  {
    id: 'ind-vfd-15', category: 'moteurs-et-commandes', name: 'Variateur de fréquence pompes 15 kW', ref: 'VF-15', price: 1890,
    summary: 'Variateur avec protection manque d’eau et régulation de pression.',
    description: 'Démarrage progressif, régulation PID à pression constante, détection de marche à sec. Affichage local et contact de défaut.',
    specs: { 'Puissance': '15 kW', 'Entrée': '400 V tri', 'Protection': 'IP54', 'Régulation': 'PID pression', 'Sécurités': 'Marche à sec, surcharge' },
  },
  {
    id: 'ind-panel-22', category: 'moteurs-et-commandes', name: 'Coffret de commande étoile-triangle 22 kW', ref: 'CC-22', price: 1240,
    summary: 'Coffret avec relais thermique, protection phases et sonde de niveau.',
    description: 'Coffret métallique IP55 prêt à raccorder. Entrées pour sonde de niveau et flotteur, voyants de marche et de défaut.',
    specs: { 'Puissance': '22 kW', 'Démarrage': 'Étoile-triangle', 'Protection': 'IP55', 'Entrées': 'Sonde + flotteur', 'Dimensions': '600 × 400 × 250 mm' },
  },
  {
    id: 'ind-riser-pe-63', category: 'tuyaux-raccords-vannes', name: 'Colonne d’exhaure PE Ø63 mm, couronne 50 m', ref: 'CX-PE-63', price: 285,
    summary: 'Tuyau polyéthylène haute densité pour pompes immergées.',
    description: 'PE100 PN16, souple et léger, sans soudure sur toute la longueur. Se raccorde par raccords à compression.',
    specs: { 'Diamètre': '63 mm', 'Longueur': '50 m', 'Pression': 'PN16', 'Matière': 'PE100', 'Certification': 'Contact alimentaire' },
  },
  {
    id: 'ind-valve-gate-3', category: 'tuyaux-raccords-vannes', name: 'Vanne à opercule 3" en fonte', ref: 'VO-3', price: 220,
    summary: 'Vanne d’isolement à brides, corps fonte ductile.',
    description: 'Opercule caoutchouté, tige inox à volant. Pour l’isolement en tête de forage ou de réseau.',
    specs: { 'Diamètre': 'DN80 (3")', 'Pression': 'PN16', 'Raccordement': 'Brides EN 1092', 'Corps': 'Fonte ductile', 'Revêtement': 'Époxy' },
  },
  {
    id: 'ind-check-valve-4', category: 'tuyaux-raccords-vannes', name: 'Clapet anti-retour 4" à battant', ref: 'CA-4', price: 190,
    summary: 'Évite le retour d’eau dans la colonne à l’arrêt de la pompe.',
    description: 'Clapet à battant à fermeture rapide, limitant les coups de bélier. Corps fonte, battant revêtu.',
    specs: { 'Diamètre': 'DN100 (4")', 'Pression': 'PN16', 'Raccordement': 'Brides', 'Corps': 'Fonte', 'Montage': 'Horizontal / vertical' },
  },
  {
    id: 'ind-drip-kit-1ha', category: 'irrigation', name: 'Kit goutte-à-goutte 1 hectare', ref: 'IR-GG-1HA', price: 1850,
    summary: 'Rampes, goutteurs autorégulants, filtre à disques et vannes.',
    description: 'Kit complet pour cultures en lignes. Goutteurs compensants de 2 l/h, filtre à disques 120 mesh et manomètre.',
    specs: { 'Surface couverte': '1 ha', 'Goutteur': '2 l/h autorégulant', 'Filtration': 'Disques 120 mesh', 'Écartement': '0,5 m', 'Pression de service': '1 – 2,5 bar' },
  },
  {
    id: 'ind-pivot-40', category: 'irrigation', name: 'Pivot d’irrigation 40 ha', ref: 'IR-PV-40', price: 54800,
    summary: 'Pivot central 6 travées, motorisation électrique par tour.',
    description: 'Structure galvanisée, arroseurs basse pression et armoire de commande avec programmation. Alimentation par pompe immergée via variateur.',
    specs: { 'Surface': '40 ha', 'Rayon': '360 m', 'Travées': '6', 'Débit': '110 m³/h', 'Motorisation': 'Électrique par tour' },
  },
  {
    id: 'ind-filter-sand-3', category: 'irrigation', name: 'Filtre à sable 3 cuves', ref: 'IR-FS-3', price: 4300,
    summary: 'Filtration primaire pour eaux de forage chargées en sable fin.',
    description: 'Trois cuves en acier époxy avec collecteurs et vannes de lavage à contre-courant. Protège les goutteurs du colmatage.',
    specs: { 'Débit': 'jusqu’à 60 m³/h', 'Cuves': '3 × Ø 800 mm', 'Média': 'Sable calibré', 'Lavage': 'Contre-courant', 'Pression max.': '8 bar' },
  },
]

export const formatPrice = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

export const getProduct = (id) => products.find((p) => p.id === id)
export const getCategory = (slug) => categories.find((c) => c.slug === slug)
