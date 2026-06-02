import { useState } from 'react';
const dpmmLogo = `${import.meta.env.BASE_URL}logo.png`;
import {
  Shield, User, Eye, EyeOff, Lock, Mail, ArrowRight,
  CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';

const CREDENTIALS = {
  admin: { email: 'admin@dpmm.org.my', password: 'admin123' },
  member: { email: 'iskandar@horizondynamics.my', password: 'member123' },
};

const ROLES = [
  {
    id: 'admin',
    label: 'Admin Login',
    sub: 'Association Manager',
    icon: Shield,
    accentBg: 'bg-accent',
    accentHover: 'hover:bg-accent-dark',
    accentBorder: 'border-accent/20',
    accentText: 'text-accent',
    accentBgLight: 'bg-accent/5',
    ringFocus: 'focus:border-accent focus:ring-accent/20',
    gradient: 'from-accent/10 to-transparent',
    demoEmail: 'admin@dpmm.org.my',
    demoPass: 'admin123',
  },
  {
    id: 'member',
    label: 'Member Login',
    sub: 'Association Member',
    icon: User,
    accentBg: 'bg-primary',
    accentHover: 'hover:bg-primary-dark',
    accentBorder: 'border-primary/20',
    accentText: 'text-primary',
    accentBgLight: 'bg-primary/5',
    ringFocus: 'focus:border-primary focus:ring-primary/20',
    gradient: 'from-primary/10 to-transparent',
    demoEmail: 'iskandar@horizondynamics.my',
    demoPass: 'member123',
  },
];

export default function LoginPage({ defaultRole = 'admin', onLoginSuccess, onBack, onRegisterClick }) {
  const [activeRole, setActiveRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoFilled, setDemoFilled] = useState(false);

  const role = ROLES.find(r => r.id === activeRole);

  const handleTabSwitch = (id) => {
    setActiveRole(id);
    setEmail('');
    setPassword('');
    setError('');
    setDemoFilled(false);
  };

  const fillDemo = () => {
    setEmail(role.demoEmail);
    setPassword(role.demoPass);
    setDemoFilled(true);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const creds = CREDENTIALS[activeRole];

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      if (email === creds.email && password === creds.password) {
        onLoginSuccess(activeRole);
      } else {
        setError('Invalid credentials. Use the demo credentials below to sign in.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center px-4 py-10 animate-fade-in bg-slate-50 relative">
      {/* Background glow */}
      <div className={`absolute inset-0 opacity-40 pointer-events-none bg-gradient-to-br ${role.gradient}`} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-xl shadow-slate-200/50 mb-5 overflow-hidden bg-white border border-slate-100 p-2">
            <img src={dpmmLogo} alt="DPMM Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)' }}>Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sign in to your DPMM Association account</p>
        </div>

        {/* Role Tab Switcher */}
        <div className="flex bg-slate-200/50 border border-slate-200 rounded-2xl p-1.5 mb-6 gap-1.5 shadow-inner">
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => handleTabSwitch(r.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-xl text-sm font-bold transition-all duration-200
                ${activeRole === r.id
                  ? `${r.accentBg} text-white shadow-md`
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
            >
              <r.icon className="w-4 h-4" />
              {r.label}
            </button>
          ))}
        </div>

        {/* Login Card */}
        <div className={`bg-white rounded-2xl border ${role.accentBorder} shadow-xl shadow-slate-200/50 overflow-hidden`}>
          {/* Card accent strip */}
          <div className={`h-1.5 w-full ${role.accentBg}`} />

          <div className="p-7">
            {/* Role indicator */}
            <div className={`flex items-center gap-3 mb-6 px-4 py-1.5 rounded-xl ${role.accentBgLight} border ${role.accentBorder}`}>
              <role.icon className={`w-5 h-5 ${role.accentText} shrink-0`} />
              <div>
                <p className={`text-xs font-bold ${role.accentText} uppercase tracking-wide`}>{role.label}</p>
                <p className="text-[10px] text-slate-500 font-medium">{role.sub}</p>
              </div>
              <span className={`ml-auto w-2 h-2 rounded-full ${role.accentBg} animate-pulse`} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder={role.demoEmail}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-1.5 text-sm text-slate-900 placeholder-slate-400
                      focus:outline-none focus:ring-2 transition-all duration-200 ${role.ringFocus}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-12 py-1.5 text-sm text-slate-900 placeholder-slate-400
                      focus:outline-none focus:ring-2 transition-all duration-200 ${role.ringFocus}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end pt-1">
                <button type="button" className={`text-xs font-bold ${role.accentText} hover:underline transition-colors`}>
                  Forgot password?
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-1.5 animate-fade-in">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-rose-700 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-white font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-70 shadow-md mt-2
                  ${role.accentBg} ${role.accentHover}`}
              >
                {loading ? (
                  <>
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In…
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>
            {/* Register link for members */}
            {activeRole === 'member' && onRegisterClick && (
              <div className="mt-5 text-center border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-500 mb-2">Not a member yet?</p>
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors flex items-center gap-1 mx-auto"
                >
                  Register as a Member <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Demo credentials */}
          <div className="border-t border-slate-100 bg-slate-50 px-7 py-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Demo Credentials</p>
              <button
                onClick={fillDemo}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all duration-200 active:scale-95 flex items-center gap-1.5
                  ${demoFilled
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : `bg-white ${role.accentBorder} ${role.accentText} shadow-sm hover:shadow-md`}`}
              >
                {demoFilled ? <><CheckCircle2 className="w-3.5 h-3.5" /> Filled</> : '⚡ Auto-fill'}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500 font-bold w-16 shrink-0">Email</span>
                <code className="text-slate-700 font-mono bg-white border border-slate-200 shadow-sm px-2.5 py-1 rounded-md text-[11px] flex-1 truncate">
                  {role.demoEmail}
                </code>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500 font-bold w-16 shrink-0">Password</span>
                <code className="text-slate-700 font-mono bg-white border border-slate-200 shadow-sm px-2.5 py-1 rounded-md text-[11px]">
                  {role.demoPass}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home link */}
        {onBack && (
          <div className="text-center mt-8">
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 mx-auto"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Public Portal
            </button>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-[10px] font-medium text-slate-400 mt-5 uppercase tracking-wide">
          DPMM Association Management System · Secure Login
        </p>
      </div>
    </div>
  );
}
