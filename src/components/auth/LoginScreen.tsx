import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
  Mail,
  KeyRound,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';
import { api, authStorage } from '../../lib/api';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [targetEmail, setTargetEmail] = useState('aestheticsrare502@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Submit Password & Request OTP
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.login(password.trim());

      if (res.requireOtp) {
        if (res.email) setTargetEmail(res.email);
        setStep('otp');
      } else if (res.token) {
        authStorage.setToken(res.token, remember);
        onSuccess();
      } else {
        throw new Error('Authentication failed: No token received');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid admin password');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.verifyOtp(otp.trim());

      if (res.token) {
        authStorage.setToken(res.token, remember);
        onSuccess();
      } else {
        throw new Error('Failed to verify OTP');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setResending(true);
      setError(null);
      setResendSuccess(false);
      await api.resendOtp(password.trim());
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-md shadow-purple-500/25 mb-3">
            {step === 'password' ? (
              <Sparkles className="w-7 h-7 text-white" />
            ) : (
              <KeyRound className="w-7 h-7 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {step === 'password' ? 'Rare Aesthetics' : 'Two-Step Verification'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {step === 'password'
              ? 'Admin Portal & Content Management System'
              : `A 6-digit verification code has been sent to`}
          </p>
          {step === 'otp' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-xs font-semibold text-purple-700 mt-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{targetEmail}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs sm:text-sm text-rose-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs sm:text-sm text-emerald-700">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
            <span>A fresh verification code has been sent to your email!</span>
          </div>
        )}

        {step === 'password' ? (
          /* STEP 1: Enter Password */
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-600 transition-all shadow-2xs"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-purple-600 focus:ring-purple-500/40"
                />
                <span className="text-xs text-slate-600">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying & Sending OTP...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Continue</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: Enter 6-digit OTP */
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                6-Digit Security Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[10px] text-2xl font-bold py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-600 font-mono shadow-2xs"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Check your inbox and spam folder for the email from My Rare Aesthetics.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Access Admin</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setError(null);
                  setOtp('');
                }}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Sending...' : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
