import React from 'react';
import { Search, Book, MessageCircle, Settings } from 'lucide-react';

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">How can we help?</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for articles, guides..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/20 focus:outline-none focus:border-blue-500 dark:text-white"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 p-6 rounded-2xl hover:-translate-y-1 transition-transform cursor-pointer">
          <Book className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Getting Started</h3>
          <p className="text-sm text-slate-500 dark:text-[#8b93c0]">Learn the basics of SecureGuard.</p>
        </div>
        <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 p-6 rounded-2xl hover:-translate-y-1 transition-transform cursor-pointer">
          <Settings className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Account & Billing</h3>
          <p className="text-sm text-slate-500 dark:text-[#8b93c0]">Manage your subscription and team.</p>
        </div>
        <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 p-6 rounded-2xl hover:-translate-y-1 transition-transform cursor-pointer">
          <MessageCircle className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Troubleshooting</h3>
          <p className="text-sm text-slate-500 dark:text-[#8b93c0]">Fix common issues and errors.</p>
        </div>
      </div>
    </div>
  );
}