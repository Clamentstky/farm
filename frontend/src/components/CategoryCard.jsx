import { Link } from 'react-router-dom'
import { FALLBACK_IMAGE, categoryImage } from '../data/brand'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="group overflow-hidden rounded-[1.4rem] border border-white/80 bg-white/90 p-3 shadow-[0_20px_48px_-34px_rgba(10,40,18,0.45)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-34px_rgba(10,40,18,0.55)]"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-[#e8efe5]">
        <img
          src={categoryImage(category)}
          alt={category.category_name}
          className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE
          }}
        />
      </div>
      <div className="px-1 pb-1 pt-4">
        <div className="min-w-0">
          <h3 className="min-h-[2.5rem] text-base font-bold leading-snug text-soil-700">
            {category.category_name}
          </h3>
          <p className="mt-2 text-sm font-semibold text-soil-500">
            {category.product_count} products
          </p>
        </div>
      </div>
    </Link>
  )
}
