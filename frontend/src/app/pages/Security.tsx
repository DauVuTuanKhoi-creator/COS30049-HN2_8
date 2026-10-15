import React from 'react';
import { Lock, CheckCircle, Key, FileText } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] font-sans py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] uppercase mb-3">Security</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Defense in depth, not just a checkbox</h2>
          <p className="text-[15px] text-slate-600 dark:text-[#8b93c0] max-w-2xl leading-relaxed">
            SecureGuard is built on a multi-layered architecture engineered to stop threats at every stage — before, during, and after delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Visual Box (Live Threat Monitor) */}
          <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-2xl p-8 relative">
            <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-[#545b80] mb-5">Live threat monitor</div>
            
            <div className="space-y-3">
              {/* Threat 1 */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#141825] border border-slate-200 dark:border-[#637aff]/15 rounded-xl p-3.5">
                <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-[#ff5c6c] shadow-[0_0_6px_rgba(255,92,108,0.5)] shrink-0"></div>
                <div>
                  <div className="text-[13px] font-medium">Phishing campaign — finance@acme-secure.net</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#545b80] mt-0.5">3 seconds ago</div>
                </div>
                <div className="ml-auto text-[11px] font-bold text-red-500 dark:text-[#ff5c6c]">BLOCKED</div>
              </div>
              
              {/* Threat 2 */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#141825] border border-slate-200 dark:border-[#637aff]/15 rounded-xl p-3.5">
                <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-[#ff5c6c] shadow-[0_0_6px_rgba(255,92,108,0.5)] shrink-0"></div>
                <div>
                  <div className="text-[13px] font-medium">Malware: Trojan.GenericKD.74821</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#545b80] mt-0.5">18 seconds ago</div>
                </div>
                <div className="ml-auto text-[11px] font-bold text-red-500 dark:text-[#ff5c6c]">BLOCKED</div>
              </div>

              {/* Threat 3 */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#141825] border border-slate-200 dark:border-[#637aff]/15 rounded-xl p-3.5">
                <div className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-[#fbbf24] shadow-[0_0_6px_rgba(251,191,36,0.5)] shrink-0"></div>
                <div>
                  <div className="text-[13px] font-medium">Suspicious link in attachment</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#545b80] mt-0.5">1 minute ago</div>
                </div>
                <div className="ml-auto text-[11px] font-bold text-yellow-500 dark:text-[#fbbf24]">REVIEW</div>
              </div>

              {/* Threat 4 */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#141825] border border-slate-200 dark:border-[#637aff]/15 rounded-xl p-3.5">
                <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-[#3ecf8e] shadow-[0_0_6px_rgba(62,207,142,0.5)] shrink-0"></div>
                <div>
                  <div className="text-[13px] font-medium">Mass scan batch — 48,291 messages</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#545b80] mt-0.5">2 minutes ago</div>
                </div>
                <div className="ml-auto text-[11px] font-bold text-green-500 dark:text-[#3ecf8e]">CLEAN</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-[#637aff]/15">
              <div className="text-xs text-slate-500 dark:text-[#545b80]">Today's blocks</div>
              <div className="text-xs font-bold text-red-500 dark:text-[#ff5c6c]">12,847 threats</div>
            </div>
          </div>

          {/* Features List */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-blue-600 dark:text-[#6a7fff]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold mb-1">End-to-End Encryption</h4>
                <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed">All message content is encrypted in transit and at rest with AES-256. We never store the content of your messages.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-[#6a7fff]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold mb-1">SOC 2 Type II Certified</h4>
                <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed">Independently audited annually for security, availability, and confidentiality. Full reports available on request.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center shrink-0">
                <Key className="w-4 h-4 text-blue-600 dark:text-[#6a7fff]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold mb-1">Private Key Architecture</h4>
                <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed">Your encryption keys never leave your environment. Even SecureGuard cannot decrypt your data.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#6a7fff]/10 border border-blue-100 dark:border-[#6a7fff]/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue-600 dark:text-[#6a7fff]" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold mb-1">Full Audit Logging</h4>
                <p className="text-[13px] text-slate-600 dark:text-[#8b93c0] leading-relaxed">Every API call, admin action, and configuration change is logged immutably for compliance and forensics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}