import { Clock3, PlayCircle, Workflow } from 'lucide-react';

const tutorials = [
  {
    title: 'Building your first detection workflow',
    duration: '12 min',
    level: 'Beginner',
  },
  {
    title: 'Investigating suspicious attachments',
    duration: '18 min',
    level: 'Intermediate',
  },
  {
    title: 'Automating scans with webhooks and jobs',
    duration: '24 min',
    level: 'Advanced',
  },
] as const;

export default function Tutorials() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-blue-600 dark:text-[#6a7fff]">Resources</div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Tutorials</h1>
          <p className="max-w-2xl text-slate-600 dark:text-[#8b93c0]">
            Learn practical SecureGuard workflows from quick-start fundamentals to advanced automation patterns.
          </p>
        </div>

        <div className="space-y-4">
          {tutorials.map((tutorial) => (
            <article key={tutorial.title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#637aff]/15 dark:bg-[#10131f]">
              <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-[#6a7fff]">
                <PlayCircle className="h-5 w-5" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{tutorial.title}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-[#8b93c0]">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  {tutorial.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Workflow className="h-4 w-4" />
                  {tutorial.level}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}