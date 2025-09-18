import React from 'react'

const Loading = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-base-content/70">Loading your saved strips...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading