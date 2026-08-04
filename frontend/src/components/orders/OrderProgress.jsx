import React from 'react'
import { motion } from 'framer-motion'

export default function OrderProgress({ status }) {
  const steps = [
    { id: 'Pending', label: 'Placed' },
    { id: 'Confirmed', label: 'Confirmed' },
    { id: 'Preparing', label: 'Preparing' },
    { id: 'Out for Delivery', label: 'Out for Delivery' },
    { id: 'Delivered', label: 'Delivered' }
  ]

  const activeIndex = steps.findIndex(s => s.id === status) >= 0 ? steps.findIndex(s => s.id === status) : 0

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold text-sm border border-red-100 flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          Order Cancelled
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-6">
      {/* Background Track */}
      <div className="absolute top-1/2 left-8 right-8 h-1 bg-soil-100 rounded-full -translate-y-1/2 overflow-hidden">
        {/* Animated Progress Fill */}
        <motion.div 
          className="h-full bg-gradient-to-r from-leaf-400 to-leaf-600"
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      <div className="relative flex justify-between z-10">
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive = index === activeIndex
          const isFuture = index > activeIndex

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className="relative flex items-center justify-center">
                {/* Outer Glow for Active Step */}
                {isActive && (
                  <motion.div
                    className="absolute w-8 h-8 rounded-full bg-leaf-400/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
                
                {/* Node */}
                <motion.div 
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? '#15803D' : '#FFFFFF',
                    borderColor: isCompleted || isActive ? '#15803D' : '#E5E7EB',
                    scale: isActive ? 1.2 : 1
                  }}
                  className={`w-4 h-4 rounded-full border-2 relative z-10 transition-colors duration-500`}
                />
              </div>
              
              <span className={`text-[10px] sm:text-xs font-bold absolute -bottom-6 whitespace-nowrap transition-colors duration-300 ${
                isActive ? 'text-leaf-700' : isCompleted ? 'text-soil-900' : 'text-soil-400'
              }`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
