import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa'

// Mock Data for UI presentation
const MOCK_RECOMMENDATIONS = [
  { id: 101, name: 'Fresh Organic Tomatoes', price: '45.00', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80' },
  { id: 102, name: 'Farm Potatoes', price: '30.00', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80' },
  { id: 103, name: 'Green Cabbage', price: '25.00', image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=300&q=80' },
  { id: 104, name: 'Red Onions', price: '50.00', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80' },
]

export default function RecommendedProducts() {
  const scrollRef = useRef(null)

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-soil-900 text-lg">Frequently Bought Together</h3>
        <div className="flex gap-2 hidden sm:flex">
          <button onClick={() => scroll(-200)} className="w-8 h-8 rounded-full bg-white border border-soil-200 flex items-center justify-center text-soil-500 hover:bg-leaf-50 hover:text-leaf-600 transition-colors">
            <FaChevronLeft className="text-xs" />
          </button>
          <button onClick={() => scroll(200)} className="w-8 h-8 rounded-full bg-white border border-soil-200 flex items-center justify-center text-soil-500 hover:bg-leaf-50 hover:text-leaf-600 transition-colors">
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x"
      >
        {MOCK_RECOMMENDATIONS.map(product => (
          <div key={product.id} className="min-w-[160px] max-w-[160px] sm:min-w-[180px] bg-white rounded-2xl p-3 border border-soil-100 shadow-sm snap-start hover:shadow-md transition-shadow group">
            <div className="w-full h-32 rounded-xl bg-soil-50 mb-3 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 className="font-bold text-soil-900 text-sm truncate mb-1">{product.name}</h4>
            <div className="flex items-center justify-between mt-2">
              <p className="font-black text-soil-900 text-sm">₹{product.price}</p>
              <button className="w-7 h-7 rounded-full bg-leaf-50 text-leaf-600 flex items-center justify-center hover:bg-leaf-600 hover:text-white transition-colors">
                <FaPlus className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
