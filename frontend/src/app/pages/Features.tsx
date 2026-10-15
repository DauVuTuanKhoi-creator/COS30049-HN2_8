import React from 'react';
import { Shield, Zap, Globe, Activity, ShieldAlert, Box, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; 
export default function Features() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] font-sans">
      
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-200 dark:border-[#6a7fff]/25 rounded-full px-4 py-1.5 mb-6 uppercase">
          <Shield className="w-3 h-3" />
          Trusted by 50,000+ teams worldwide
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl mb-5 text-slate-900 dark:text-white">
          Spam and malware detection <br />
          <span className="text-blue-600 dark:text-[#6a7fff]">built for modern threats</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-[#8b93c0] max-w-xl leading-relaxed mb-10">
          SecureGuard scans every message, link, and attachment in real-time — powered by AI trained on billions of threat signals.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-7 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-[#6a7fff] dark:hover:opacity-85 text-white text-sm font-semibold rounded-xl transition-all">
            Start free trial
          </button>
          <button className="px-7 py-3 bg-transparent border border-slate-300 dark:border-[#637aff]/35 text-slate-700 dark:text-[#8b93c0] hover:text-slate-900 dark:hover:text-white dark:hover:border-[#6a7fff] text-sm font-semibold rounded-xl transition-all">
            View demo
          </button>
        </div>
      </section>

      <section className="flex flex-wrap md:flex-nowrap justify-center border-y border-slate-200 dark:border-[#637aff]/15 bg-white dark:bg-[#10131f]">
        {[
          { num: "99.9", unit: "%", label: "Detection accuracy" },
          { num: "2", unit: "ms", label: "Average scan time" },
          { num: "4", unit: "B+", label: "Threats blocked monthly" },
          { num: "24", unit: "/7", label: "Real-time monitoring" }
        ].map((stat, i) => (
          <div key={i} className="flex-1 min-w-[150px] max-w-[220px] p-6 text-center border-r last:border-r-0 border-slate-200 dark:border-[#637aff]/15">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {stat.num}<span className="text-blue-600 dark:text-[#6a7fff]">{stat.unit}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-[#545b80] mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] uppercase mb-3">Features</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Everything you need to stay protected</h2>
          <p className="text-[15px] text-slate-600 dark:text-[#8b93c0] max-w-2xl leading-relaxed">
            From inbox scanning to deep malware analysis, SecureGuard covers every attack surface with intelligence that learns and adapts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-7 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-[#637aff]/35 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center mb-5">
              <Shield className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">AI Spam Detection</h3>
            <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed mb-4">Multilingual spam classification using transformer models trained on 10B+ samples. Near-zero false positives.</p>
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-[#3ecf8e]/10 border border-green-200 dark:border-[#3ecf8e]/20 text-green-600 dark:text-[#3ecf8e] text-[10px] font-bold uppercase tracking-wider rounded-full">AI-powered</span>
          </div>

          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-7 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-[#637aff]/35 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center mb-5">
              <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">Phishing Shield</h3>
            <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed mb-4">Real-time link scanning and domain reputation checks that catch phishing attacks before they reach your users.</p>
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-[#3ecf8e]/10 border border-green-200 dark:border-[#3ecf8e]/20 text-green-600 dark:text-[#3ecf8e] text-[10px] font-bold uppercase tracking-wider rounded-full">Real-time</span>
          </div>

          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-7 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-[#637aff]/35 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center mb-5">
              <Box className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">Attachment Sandbox</h3>
            <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed mb-4">Every attachment is detonated in an isolated cloud sandbox. Macros, scripts, and exploits are caught automatically.</p>
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-[#3ecf8e]/10 border border-green-200 dark:border-[#3ecf8e]/20 text-green-600 dark:text-[#3ecf8e] text-[10px] font-bold uppercase tracking-wider rounded-full">Sandboxed</span>
          </div>

          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-7 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-[#637aff]/35 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center mb-5">
              <Zap className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">Zero-Day Protection</h3>
            <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed mb-4">Behavioral heuristics and threat intelligence feeds detect novel malware variants that signature scanners miss.</p>
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-[#3ecf8e]/10 border border-green-200 dark:border-[#3ecf8e]/20 text-green-600 dark:text-[#3ecf8e] text-[10px] font-bold uppercase tracking-wider rounded-full">Proactive</span>
          </div>

          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-7 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-[#637aff]/35 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center mb-5">
              <Globe className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">Threat Intelligence</h3>
            <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed mb-4">Global threat intel sharing with 200+ security partners, updated every 60 seconds across all nodes.</p>
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-[#3ecf8e]/10 border border-green-200 dark:border-[#3ecf8e]/20 text-green-600 dark:text-[#3ecf8e] text-[10px] font-bold uppercase tracking-wider rounded-full">Global Network</span>
          </div>

          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-7 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-[#637aff]/35 transition-all">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center mb-5">
              <Activity className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">Incident Dashboard</h3>
            <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed mb-4">Unified console with threat timelines, severity scoring, and one-click remediation for your security team.</p>
            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-[#3ecf8e]/10 border border-green-200 dark:border-[#3ecf8e]/20 text-green-600 dark:text-[#3ecf8e] text-[10px] font-bold uppercase tracking-wider rounded-full">Analytics</span>
          </div>
        </div>
      </section>
    </div>
  );
}