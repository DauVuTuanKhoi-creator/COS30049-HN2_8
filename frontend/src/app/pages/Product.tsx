import { Link } from 'react-router-dom';
import { Shield, Tags, Lock } from 'lucide-react';

const productLinks = [
  {
    title: 'Features',
    to: '/features',
    desc: 'Explore SecureGuard capabilities for detection, analysis, and automation.',
    icon: Shield,
  },
  {
    title: 'Pricing',
    to: '/pricing',
    desc: 'Compare plans for individual users, teams, and enterprise deployments.',
    icon: Tags,
  },
  {
    title: 'Security',
    to: '/security',
    desc: 'Review platform architecture, controls, and defense-in-depth design.',
    icon: Lock,
  },
] as const;

export default function Product() {
  return (
    <section className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-blue-600 dark:text-[#6a7fff]">Product</div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Product Overview</h1>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-[#8b93c0]">
            Everything in Product, grouped in one place: Features, Pricing, and Security.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Each card is a route-level navigation surface to the related Product subpage. */}
          {productLinks.map((item) => {
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