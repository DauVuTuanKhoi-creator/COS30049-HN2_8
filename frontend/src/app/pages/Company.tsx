import { Link } from 'react-router-dom';
import { Building2, Newspaper, Briefcase } from 'lucide-react';

const companyLinks = [
  {
    title: 'About',
    to: '/about',
    desc: 'Learn about mission, values, and the team behind SecureGuard.',
    icon: Building2,
  },
  {
    title: 'Blog',
    to: '/blog',
    desc: 'Read cybersecurity insights, release notes, and platform updates.',
    icon: Newspaper,
  },
  {
    title: 'Careers',
    to: '/careers',
    desc: 'See open roles and join the team building next-gen security tools.',
    icon: Briefcase,
  },
] as const;

export default function Company() {
  return (
    <section className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-blue-600 dark:text-[#6a7fff]">Company</div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Company Overview</h1>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-[#8b93c0]">
            Everything in Company, grouped in one place: About, Blog, and Careers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card links keep company discovery scannable while preserving direct deep-link access. */}
          {companyLinks.map((item) => {
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