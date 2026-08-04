import React from 'react'

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-soil-100 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        
        {/* Left */}
        <div className="w-full lg:w-[35%] flex flex-col gap-4">
          <div className="w-16 h-3 bg-soil-100 rounded mb-2"></div>
          <div className="w-48 h-8 bg-soil-200 rounded mb-2"></div>
          <div className="w-32 h-4 bg-soil-100 rounded"></div>
          <div className="flex -space-x-3 mt-2">
            <div className="w-14 h-14 rounded-2xl border-4 border-white bg-soil-100"></div>
            <div className="w-14 h-14 rounded-2xl border-4 border-white bg-soil-100"></div>
          </div>
        </div>

        {/* Center */}
        <div className="w-full lg:w-[40%] px-4 border-y lg:border-y-0 lg:border-x border-soil-100 py-6 lg:py-0">
          <div className="h-2 bg-soil-100 rounded-full w-full mb-8"></div>
          <div className="flex justify-between">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-4 h-4 rounded-full bg-soil-200"></div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-[25%] flex flex-col items-start lg:items-end gap-4">
          <div className="w-24 h-6 bg-soil-100 rounded-full"></div>
          <div className="w-32 h-10 bg-soil-200 rounded mt-2"></div>
          <div className="w-24 h-4 bg-soil-100 rounded mt-2"></div>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-soil-100">
        <div className="flex gap-3">
          <div className="w-32 h-10 bg-soil-200 rounded-xl"></div>
          <div className="w-32 h-10 bg-soil-100 rounded-xl"></div>
        </div>
        <div className="w-24 h-10 bg-soil-100 rounded-xl"></div>
      </div>
    </div>
  )
}
