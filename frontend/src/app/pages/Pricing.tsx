import React from 'react';
import { Check, X } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] font-sans py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] uppercase mb-3">Pricing</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">Simple, transparent pricing</h2>
          <p className="text-[15px] text-slate-600 dark:text-[#8b93c0] max-w-xl mx-auto">
            No hidden fees. No contracts. Cancel anytime. Start free and scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-8 transition-all hover:border-blue-300 dark:hover:border-[#637aff]/35">
            <h3 className="text-[13px] font-semibold text-slate-600 dark:text-[#8b93c0] mb-2">Starter</h3>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              $0 <span className="text-[14px] font-normal text-slate-500 dark:text-[#545b80]">/ month</span>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-[#545b80] mb-6">For individuals and small projects</p>
            <hr className="border-slate-200 dark:border-[#637aff]/15 mb-6" />
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> 5,000 scans / month</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Spam & phishing detection</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Email support</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-400 dark:text-[#545b80]"><X className="w-4 h-4 text-slate-400 dark:text-[#545b80] shrink-0" /> Attachment sandbox</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-400 dark:text-[#545b80]"><X className="w-4 h-4 text-slate-400 dark:text-[#545b80] shrink-0" /> Threat intelligence feed</div>
            </div>
            <button className="w-full py-3 rounded-xl border border-slate-300 dark:border-[#637aff]/35 text-slate-700 dark:text-[#8b93c0] hover:text-slate-900 dark:hover:text-white hover:border-blue-600 dark:hover:border-[#6a7fff] text-sm font-semibold transition-all">
              Get started free
            </button>
          </div>

          {/* Pro Plan (Popular) */}
          <div className="relative bg-blue-50/50 dark:bg-[#141825] border-2 border-blue-600 dark:border-[#6a7fff] rounded-2xl p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-[#6a7fff] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </div>
            <h3 className="text-[13px] font-semibold text-slate-600 dark:text-[#8b93c0] mb-2">Pro</h3>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              $49 <span className="text-[14px] font-normal text-slate-500 dark:text-[#545b80]">/ month</span>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-[#545b80] mb-6">For growing teams and businesses</p>
            <hr className="border-slate-200 dark:border-[#637aff]/15 mb-6" />
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> 500,000 scans / month</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> All Starter features</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Attachment sandbox</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Zero-day protection</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Priority support</div>
            </div>
            <button className="w-full py-3 rounded-xl bg-blue-600 dark:bg-[#6a7fff] text-white hover:opacity-85 text-sm font-semibold transition-all">
              Start 14-day trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-8 transition-all hover:border-blue-300 dark:hover:border-[#637aff]/35">
            <h3 className="text-[13px] font-semibold text-slate-600 dark:text-[#8b93c0] mb-2">Enterprise</h3>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Custom</div>
            <p className="text-[13px] text-slate-500 dark:text-[#545b80] mb-6">For large organizations with complex needs</p>
            <hr className="border-slate-200 dark:border-[#637aff]/15 mb-6" />
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Unlimited scans</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> All Pro features</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> SSO & SAML</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Custom SLA</div>
              <div className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-[#8b93c0]"><Check className="w-4 h-4 text-green-500 dark:text-[#3ecf8e] shrink-0" /> Dedicated account manager</div>
            </div>
            <button className="w-full py-3 rounded-xl border border-slate-300 dark:border-[#637aff]/35 text-slate-700 dark:text-[#8b93c0] hover:text-slate-900 dark:hover:text-white hover:border-blue-600 dark:hover:border-[#6a7fff] text-sm font-semibold transition-all">
              Contact sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}