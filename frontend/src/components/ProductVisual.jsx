
import { useState } from 'react'
import { getCategory } from '../data/products'
import { iconFor } from './icons'

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '')

function getImageUrl(product) {
  const images = product.product_images ?? product.productImages ?? []

  const mainImage = images.find((image) => image.is_main) ?? images[0]
  const path = mainImage?.image_path ?? mainImage?.imagePath

  if (!path) return null

  if (/^https?:\/\//i.test(path)) return path

  const cleanPath = path
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  return `${SERVER_BASE}/storage/${cleanPath}`
}

export default function ProductVisual({ product, size = 'card' }) {
  const [imageFailed, setImageFailed] = useState(false)

  const cat = getCategory(product.category)
  const Icon = iconFor(cat?.icon)
  const big = size === 'large'
  const imageUrl = getImageUrl(product)
  const showImage = imageUrl && !imageFailed

  return (
    <div
      className={`blueprint relative flex items-center justify-center overflow-hidden ${
        big ? 'aspect-[4/3] md:aspect-square' : 'aspect-[4/3]'
      }`}
      role="img"
      aria-label={`Illustration de ${product.name}`}
    >
      {showImage && (
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}

      {!showImage && (
        <Icon
          className="text-volt-400"
          size={big ? 160 : 84}
          strokeWidth={1}
          aria-hidden="true"
        />
      )}

      <span className="display absolute bottom-3 left-4 z-10 text-2xl font-bold text-steel-300/80">
        {product.ref ?? product.reference}
      </span>
    </div>
  )
}
