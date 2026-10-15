import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Shield, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { signUp } from '@/app/utils/auth';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="size-10 text-blue-500" />
            <span className="text-2xl text-slate-950 dark:text-white">SecureGuard</span>
          </Link>
          <h1 className="mb-2 text-3xl text-slate-950 dark:text-white">Create Account</h1>
          <p className="text-slate-600 dark:text-slate-400">Start protecting yourself from digital threats</p>
        </div>

        {/* Sign Up Form */}
        <div className="rounded-xl border border-slate-200 bg-white/85 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-11 text-slate-950 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-11 text-slate-950 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-11 text-slate-950 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-11 text-slate-950 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                aria-label="Agree to terms and privacy policy"
                className="mt-0.5 h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-offset-slate-800"
              />
              <label className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <a href="#" className="text-blue-500 hover:text-blue-400">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-500 hover:text-blue-400">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
