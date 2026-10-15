import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 p-8 md:p-12 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-[#8b93c0] mb-8">Last updated: April 6, 2026</p>
        
        <div className="space-y-6 text-slate-700 dark:text-[#8b93c0] leading-relaxed text-sm md:text-base">
          <p>At SecureGuard, we take your privacy as seriously as your security. This Privacy Policy outlines how we collect, use, and protect your information.</p>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h3>
          <p>We only collect information necessary to provide our services. This includes account details (email, name) and anonymized telemetry data for threat analysis.</p>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. How We Use Your Data</h3>
          <p>Your data is strictly used for improving our malware detection algorithms and maintaining your account. <strong>We never sell your personal data to third parties.</strong></p>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Data Security</h3>
          <p>All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Access to production databases is strictly audited and limited to core engineering staff.</p>
        </div>
      </div>
    </div>
  );
}