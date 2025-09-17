'use client'

import React from 'react'

export default function error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  console.error(error);
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4'>
      <div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center'>
        <div className='mb-6'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Oops! Something went wrong</h1>
          <p className='text-gray-600 mb-6'>
            We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working to fix it.
          </p>
        </div>
        <div className='space-y-3'>
          <button
            onClick={reset}
            className='w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}