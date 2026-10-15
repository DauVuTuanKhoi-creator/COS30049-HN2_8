import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, TerminalSquare } from 'lucide-react';

export default function Docs() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-blue-600 dark:text-[#6a7fff]">Resources</div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Documentation</h1>
          <p className="max-w-2xl text-slate-600 dark:text-[#8b93c0]">
            Explore product guides, architecture notes, and operational playbooks for SecureGuard deployments.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link to="/getting-started" className="block rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-400 dark:border-[#637aff]/15 dark:bg-[#10131f] dark:hover:border-[#637aff]/40">
            <BookOpen className="mb-4 h-6 w-6 text-blue-600 dark:text-[#6a7fff]" />
            <h2 className="mb-2 text-lg font-semibold">Getting Started</h2>
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Setup instructions, environment configuration, and first scan walkthrough.</p>
          </Link>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <ShieldCheck className="mb-4 h-6 w-6 text-blue-600 dark:text-[#6a7fff]" />
            <h2 className="mb-2 text-lg font-semibold">Security Handbook</h2>
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Policies, hardening recommendations, and compliance controls.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#637aff]/15 dark:bg-[#10131f]">
            <TerminalSquare className="mb-4 h-6 w-6 text-blue-600 dark:text-[#6a7fff]" />
            <h2 className="mb-2 text-lg font-semibold">CLI and Tooling</h2>
            <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Commands and scripts for local workflows, CI, and release pipelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}