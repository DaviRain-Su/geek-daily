import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex justify-center space-x-4 py-4">
      <Link href="/" className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
        Home
      </Link>
      <Link href="/latest" className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
        Latest
      </Link>
    </nav>
  );
}