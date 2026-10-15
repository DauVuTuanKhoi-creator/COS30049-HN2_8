import React from 'react';

export default function Careers() {
  const jobs = [
    { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote" },
    { title: "Malware Researcher", dept: "Threat Intel", location: "New York / Remote" },
    { title: "Product Designer", dept: "Design", location: "Remote" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] uppercase mb-3">Careers</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join the Frontline</h1>
          <p className="text-slate-600 dark:text-[#8b93c0]">Help us build the next generation of security tools.</p>
        </div>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl hover:border-blue-400 dark:hover:border-[#6a7fff] transition-all">
              <div>
                <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                <div className="text-sm text-slate-500 dark:text-[#8b93c0]">{job.dept} • {job.location}</div>
              </div>
              <button className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#6a7fff] dark:hover:opacity-85 text-white rounded-lg font-medium transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}