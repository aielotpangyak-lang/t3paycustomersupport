/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SupportForm } from './pages/SupportForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { ShieldCheck, Settings } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                T3Pay <span className="text-blue-600">Official Support</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/admin"
              className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <div className="hidden sm:block px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase tracking-wider">
              System Secure
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <Routes>
            <Route path="/" element={<SupportForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="h-12 bg-white border-t border-slate-200 px-4 sm:px-10 flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] shrink-0">
          <div>© {new Date().getFullYear()} T3Pay Financial Services Ltd.</div>
          <div className="hidden sm:flex gap-8">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Security Standards</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact HQ</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

