'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error(error);
  return (
    // global-error must include html and body tags
    <html>
      <body className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Oops! Something went wrong</h2>
        <p className='text-gray-600 mb-6'>
          We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working to fix it.
        </p>
        <div className='space-y-3'>
          <button
            onClick={reset}
            className='w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}