import React, { useState } from 'react';
import {
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface AdminSecurityTabProps {
  masterPin: string;
  onChangePin: (newPin: string) => void;
  onLogout: () => void;
}

export default function AdminSecurityTab({
  masterPin,
  onChangePin,
  onLogout
}: AdminSecurityTabProps) {
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (oldPin.trim() !== masterPin.trim()) {
      setErrorMsg('Current Master PIN is incorrect.');
      return;
    }

    if (newPin.trim().length < 6) {
      setErrorMsg('New Master PIN must be at least 6 characters.');
      return;
    }

    if (newPin.trim() !== confirmPin.trim()) {
      setErrorMsg('New PINs do not match.');
      return;
    }

    onChangePin(newPin.trim());
    setSuccessMsg('Master PIN successfully updated and secured.');
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Security & Master Access PIN
            </h3>
            <p className="text-xs text-slate-400">
              Manage your master secret key for accessing the QuickCalc CMS control panel.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              CURRENT MASTER PIN / PASSWORD
            </label>
            <input
              type="password"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
              placeholder="Enter current PIN..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              NEW MASTER PIN (MIN 6 CHARACTERS)
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Enter new PIN..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              CONFIRM NEW PIN
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Re-type new PIN..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Update Master Access PIN
          </button>
        </form>
      </div>

      {/* Session Management */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
        <h4 className="font-bold text-sm text-white">Active Session Controls</h4>
        <p className="text-xs text-slate-400">
          Immediately revoke authentication credentials and return to the lock screen.
        </p>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Revoke Session & Log Out</span>
        </button>
      </div>
    </div>
  );
}
