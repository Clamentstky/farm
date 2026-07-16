import { Link } from 'react-router-dom'
import { categoryImage } from '../data/brand'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="group overflow-hidden rounded-lg border border-soil-100 bg-white shadow-sm shadow-soil-200/50 transition hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-md"
    >
      <div className="aspect-[5/3] overflow-hidden bg-soil-100">
        <img
          src={categoryImage(category)}
          alt={category.category_name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[36px] text-sm font-bold leading-snug text-soil-700">
          {category.category_name}
        </h3>
        <p className="mt-2 text-xs font-semibold text-leaf-600">
          {category.product_count} products
        </p>
      </div>
    </Link>
  )
}
