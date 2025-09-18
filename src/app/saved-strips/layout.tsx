import React from 'react'
import Loading from './loading'

const SavedStripsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <div className="pt-0">
        {children}
      </div>
    </React.Suspense>
  )
}

export default SavedStripsLayout