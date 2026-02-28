import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold text-zinc-900 mb-4">404 - Page Not Found</h1>
      <p className="text-zinc-500 mb-8">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <Link 
        href="/companies" 
        className="px-6 py-3 bg-zinc-900 text-white rounded-md font-medium hover:bg-zinc-800 transition-colors"
      >
        Go back to Companies
      </Link>
    </div>
  );
}
