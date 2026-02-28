'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h2 className="text-2xl font-bold text-zinc-900 mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-zinc-900 text-white rounded-md font-medium hover:bg-zinc-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
