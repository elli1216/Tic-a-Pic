import React from 'react';

export default function Instructions() {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body py-3">
        <h3 className="font-bold text-sm">How it works:</h3>
        <ol className="text-xs space-y-1 text-base-content/70">
          <li>1. Click &quot;Start Session&quot; to begin</li>
          <li>2. Strike a pose during the 3-second countdown</li>
          <li>3. Photos will be captured automatically</li>
          <li>4. After 4 photos, save or retake your strip!</li>
        </ol>
      </div>
    </div>
  );
}
