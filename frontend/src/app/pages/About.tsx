import React from 'react';
import { Shield, Target, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] uppercase mb-3">About Us</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Securing the Digital Future</h1>
        <p className="text-lg text-slate-600 dark:text-[#8b93c0] leading-relaxed">
          SecureGuard was founded with a single mission: to provide enterprise-grade security for everyone. We believe that a safe internet is a fundamental right.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-[#6a7fff]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600 dark:text-[#6a7fff]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our Mission</h3>
          <p className="text-sm text-slate-600 dark:text-[#8b93c0]">To build the world's most intelligent threat detection network.</p>
        </div>
        <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-green-50 dark:bg-[#3ecf8e]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-600 dark:text-[#3ecf8e]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our Values</h3>
          <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Privacy first, transparency always, and relentless innovation.</p>
        </div>
        <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-purple-50 dark:bg-[#a855f7]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-purple-600 dark:text-[#a855f7]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our Team</h3>
          <p className="text-sm text-slate-600 dark:text-[#8b93c0]">Made of elite security researchers and passionate engineers.</p>
        </div>
      </div>
    </div>
  );
}