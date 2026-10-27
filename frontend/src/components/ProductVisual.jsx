import { getCategory } from '../data/products'
import { iconFor } from './icons'

// Visuel technique généré (aucune photo fournie) : fond quadrillé + pictogramme de la catégorie.
export default function ProductVisual({ product, size = 'card' }) {
  const cat = getCategory(product.category)
  const Icon = iconFor(cat?.icon)
  const big = size === 'large'
  return (
    <div className={`blueprint relative flex items-center justify-center overflow-hidden ${big ? 'aspect-[4/3] md:aspect-square' : 'aspect-[4/3]'}`} role="img" aria-label={`Illustration de ${product.name}`}>
      <Icon className="text-volt-400" size={big ? 160 : 84} strokeWidth={1} aria-hidden="true" />
      <span className="display absolute bottom-3 left-4 text-2xl font-bold text-steel-300/80">{product.ref}</span>
    </div>
  )
}
