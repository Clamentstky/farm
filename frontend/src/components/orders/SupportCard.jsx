import React from 'react'
import { FaHeadset, FaCommentDots, FaEnvelope } from 'react-icons/fa'

export default function SupportCard() {
  return (
    <div className="bg-gradient-to-br from-soil-900 to-soil-800 rounded-3xl p-6 md:p-8 shadow-md text-white mt-6 relative overflow-hidden">
      
      {/* Decorative */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-leaf-500 opacity-20 rounded-full blur-xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <FaHeadset className="text-2xl text-leaf-400" />
          <h3 className="font-bold text-lg">Need Help?</h3>
        </div>
        <p className="text-soil-300 text-sm mb-6 max-w-[200px]">Our support team is available 24/7 for any issues with your order.</p>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-colors backdrop-blur-sm">
            <FaCommentDots /> Live Chat
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-sm font-bold transition-colors">
            <FaEnvelope /> Email Support
          </button>
        </div>
      </div>
    </div>
  )
}
