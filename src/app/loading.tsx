import React from 'react'

const Loading = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">📸</span>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-primary">Tic-a-Pic</h1>
          <p className="text-lg text-base-content/70">Loading your photo booth experience...</p>
          <div className="flex items-center justify-center space-x-1 text-sm text-base-content/50">
            <span>Preparing camera</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="w-64 mx-auto">
          <div className="flex justify-between text-xs text-base-content/60 mb-2">
            <span>Initializing</span>
            <span>Almost ready</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Fun Loading Messages */}
        <div className="text-xs text-base-content/50 max-w-xs mx-auto">
          <p className="animate-pulse">✨ Getting everything ready for your perfect shots!</p>
        </div>
      </div>
    </div>
  )
}

export default Loading