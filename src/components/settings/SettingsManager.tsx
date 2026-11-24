import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Database,
  Cloud,
  Globe,
  Mail,
  Phone,
  Key,
} from 'lucide-react';
import { SiteSettings, SystemHealth } from '../../types';
import { api } from '../../lib/api';

interface SettingsManagerProps {
  health: SystemHealth | null;
  onRefreshHealth: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  health,
  onRefreshHealth,
}) => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      setSettings(data || {});
    } catch (err: any) {
      console.warn('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.saveSettings(settings);
      setSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Diagnostics */}
      <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Infrastructure Connectivity</span>
          </h4>
          <button
            onClick={onRefreshHealth}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium"
          >
            Recheck Services
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-white font-medium text-xs">
              <Database className="w-4 h-4 text-purple-400" />
              <span>MongoDB Atlas / Local</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Status:{' '}
              <span
                className={`font-semibold ${
                  health?.services?.mongodb?.connected ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {health?.services?.mongodb?.connected ? 'Online (Ready)' : 'Disconnected (Using Memory)'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Configure <code className="text-purple-300">MONGODB_URI</code> in <code className="text-slate-400">backend/.env</code>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-white font-medium text-xs">
              <Cloud className="w-4 h-4 text-indigo-400" />
              <span>Cloudinary Media CDN</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Status:{' '}
              <span
                className={`font-semibold ${
                  health?.services?.cloudinary?.configured ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {health?.services?.cloudinary?.configured ? 'Configured & Active' : 'Fallback Local Buffer'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Configure <code className="text-purple-300">CLOUDINARY_*</code> keys in <code className="text-slate-400">backend/.env</code>
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Brand & Contact Information</span>
            </h4>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={settings.siteName || ''}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="My Rare Aesthetics"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Cosmetic Product Development & Consulting"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="info@myrareaesthetics.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone || ''}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+27 71 000 0000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Pretoria, Gauteng, South Africa"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+27..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            <span>Admin Authentication Key</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Admin access is secured with <code className="bg-slate-950 px-2 py-0.5 rounded text-purple-300 font-mono">ADMIN_PASSWORD</code> and JWT verification in <code className="text-slate-300">backend/.env</code>. To change credentials, modify the environment file and restart the backend.
          </p>
        </div>
      </form>
    </div>
  );
};
