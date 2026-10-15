import React from 'react';
import { Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c14] text-slate-900 dark:text-[#e8eaf6] py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <div className="text-[11px] font-medium tracking-widest text-blue-600 dark:text-[#6a7fff] uppercase mb-3">Contact Us</div>
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-slate-600 dark:text-[#8b93c0] mb-8">Have questions about our enterprise plans or need technical support? Our team is here to help.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-slate-500 dark:text-[#8b93c0]">support@secureguard.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-[#6a7fff]" />
              </div>
              <div>
                <div className="font-semibold">Headquarters</div>
                <div className="text-sm text-slate-500 dark:text-[#8b93c0]">123 Security Blvd, San Francisco, CA</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#10131f] border border-slate-200 dark:border-[#637aff]/15 p-8 rounded-2xl">
          <form className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-1">Name</label>
              <input id="contact-name" type="text" className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#141825] border border-slate-200 dark:border-[#637aff]/20 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium mb-1">Email</label>
              <input id="contact-email" type="email" className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#141825] border border-slate-200 dark:border-[#637aff]/20 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium mb-1">Message</label>
              <textarea id="contact-message" rows={4} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#141825] border border-slate-200 dark:border-[#637aff]/20 focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 dark:bg-[#6a7fff] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}