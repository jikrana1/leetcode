import React from 'react'

function LoadingPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-lg font-semibold">Loading...</p>
    </div>
  );
}

export default LoadingPage