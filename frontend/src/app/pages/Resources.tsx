import { Link } from 'react-router-dom';
import { BookOpenText, GraduationCap, Braces } from 'lucide-react';

const resourceLinks = [
  {
    title: 'Docs',
    to: '/docs',
    desc: 'Read full platform documentation, architecture, and setup guides.',
    icon: BookOpenText,
  },
  {
    title: 'Tutorials',
    to: '/tutorials',
    desc: 'Follow practical walkthroughs for setup, scanning, and automation.',
    icon: GraduationCap,
  },
  {
    title: 'API Reference',
    to: '/api-reference',
    desc: 'Integrate SecureGuard using endpoint-level API contracts and examples.',
    icon: Braces,
  },
] as const;

export default function Resources() {
  return (
    <section className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-blue-600 dark:text-[#6a7fff]">Resources</div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Resource Center</h1>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-[#8b93c0]">
            Everything in Resources, grouped in one place: Docs, Tutorials, and API Reference.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Resource cards act as clear entry points into docs, tutorials, and API materials. */}
          {resourceLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-blue-400 dark:border-[#637aff]/15 dark:bg-[#10131f] dark:hover:border-[#637aff]/40"
              >
                <Icon className="mb-4 h-6 w-6 text-blue-600 dark:text-[#6a7fff]" />
                <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-[#8b93c0]">{item.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}