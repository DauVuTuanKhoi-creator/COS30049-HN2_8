import { Link } from 'react-router';
import { Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <Shield className="size-20 text-blue-500 mx-auto mb-6 opacity-50" />
        <h1 className="text-6xl text-white mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8">Page not found</p>
        <Link to="/">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}
