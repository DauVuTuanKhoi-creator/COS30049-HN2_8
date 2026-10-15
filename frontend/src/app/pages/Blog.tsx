import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Blog() {
  const posts = [
    { title: "The Rise of AI-Powered Phishing", date: "April 12, 2026", category: "Threat Intel" },
    { title: "Zero-Day Vulnerabilities Explained", date: "March 28, 2026", category: "Education" },
    { title: "SecureGuard 4.0 Release Notes", date: "March 15, 2026", category: "Product" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] uppercase mb-3">Blog</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights & News</h1>
          <p className="text-slate-600 dark:text-[#8b93c0]">Stay updated with the latest in cybersecurity.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div key={i} className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl overflow-hidden hover:border-blue-400 dark:hover:border-[#637aff]/40 transition-all cursor-pointer group">
              <div className="h-48 bg-slate-200 dark:bg-[#141825] w-full"></div>
              <div className="p-6">
                <div className="text-xs text-blue-600 dark:text-[#6a7fff] font-semibold mb-2">{post.category}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-[#6a7fff] transition-colors">{post.title}</h3>
                <div className="text-sm text-slate-500 dark:text-[#545b80] mb-4">{post.date}</div>
                <div className="flex items-center text-sm font-semibold text-slate-900 dark:text-white">
                  Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}