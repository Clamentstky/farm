import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaShoppingCart, FaStar } from 'react-icons/fa'
import { getProducts } from '../../services/productService'
import { productImage } from '../../data/brand'

export default function RecommendationSlider() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await getProducts({ page: 1, limit: 4 })
        setProducts(data.items || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchRecs()
  }, [])

  if (products.length === 0) return null

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-soil-100 mt-8">
      <h3 className="text-xl font-bold text-soil-900 mb-6">Frequently Bought Together</h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map(product => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="w-48 shrink-0 bg-white border border-soil-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div className="w-full h-32 bg-soil-50 rounded-xl mb-4 overflow-hidden">
              <img src={productImage(product)} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-soil-400 uppercase mb-1">{product.category_name}</p>
              <h4 className="text-sm font-bold text-soil-900 leading-tight mb-2 line-clamp-2">{product.name}</h4>
              <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-leaf-700">₹{parseFloat(product.price).toFixed(2)}</p>
                <button className="w-8 h-8 rounded-full bg-soil-100 flex items-center justify-center text-soil-700 hover:bg-leaf-600 hover:text-white transition-colors">
                  <FaShoppingCart className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
