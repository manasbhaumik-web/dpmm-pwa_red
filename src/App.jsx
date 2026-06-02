import { useState, useCallback } from 'react';
import dpmmLogo from '/logo.png';
import dpmmTextLogo from '/dpmm-white-text.png';
import { Shield, User, LogOut, Globe } from 'lucide-react';
import { ToastContainer } from './components/shared/Toast';
import InstallPrompt from './components/shared/InstallPrompt';
import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import MemberPortal from './components/member/MemberPortal';
import LandingPage from './components/public/LandingPage';
import RegistrationForm from './components/public/RegistrationForm';

const ROLES = [
  {
    id: 'public',
    label: 'Home',
    fullLabel: 'Public Portal',
    sub: 'Visitor / Registration',
    icon: Globe,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    activeBg: 'bg-indigo-600',
    activeText: 'text-white',
  },
  {
    id: 'admin',
    label: 'Admin',
    fullLabel: 'Admin Workspace',
    sub: 'Association Manager',
    icon: Shield,
    // DPMM accent red
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    activeBg: 'bg-accent',
    activeText: 'text-white',
  },
  {
    id: 'member',
    label: 'Member',
    fullLabel: 'Member Portal',
    sub: 'Authenticated Member',
    icon: User,
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    activeBg: 'bg-primary',
    activeText: 'text-white',
  },
];

const DEFAULT_AUTH = { admin: false, member: false };
let toastCounter = 0;

export default function App() {
  const [role, setRole] = useState('public');
  const [auth, setAuth] = useState(DEFAULT_AUTH);
  const [toasts, setToasts] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);

  const addToast = useCallback((toast) => {
    const id = ++toastCounter;
    setToasts(t => [...t, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const activeRole = ROLES.find(r => r.id === role);

  const handleRoleChange = (id) => {
    setRole(id);
  };

  const handleLoginSuccess = (authRole) => {
    setAuth(a => ({ ...a, [authRole]: true }));
    addToast({
      type: 'success',
      title: authRole === 'admin' ? 'Admin Access Granted' : 'Welcome Back!',
      message: authRole === 'admin'
        ? 'Signed in as Association Manager.'
        : 'Signed in as Iskandar Putra · AG-2026-0042',
    });
  };

  const handleLogout = (authRole) => {
    setAuth(a => ({ ...a, [authRole]: false }));
    addToast({ type: 'info', title: 'Signed Out', message: 'You have been signed out successfully.' });
  };

  const isAdminAuthed  = auth.admin;
  const isMemberAuthed = auth.member;

  const isAuthed = (id) =>
    id === 'admin' ? isAdminAuthed : id === 'member' ? isMemberAuthed : true;

  const getStatusLabel = () => {
    if (role === 'public') return 'Guest Session';
    if (role === 'admin')  return isAdminAuthed  ? 'Signed in as Admin'        : 'Login required';
    if (role === 'member') return isMemberAuthed ? 'Signed in · AG-2026-0042' : 'Login required';
    return 'Unauthenticated';
  };

  const showSignOut = (role === 'admin' && isAdminAuthed) || (role === 'member' && isMemberAuthed);

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* ── Top Navbar ───────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-slate-200"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          background: 'linear-gradient(135deg, #1e2e70 0%, #263a8d 60%, #2d45a9 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* DPMM Logo — text version on dark navy header */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={dpmmTextLogo}
              alt="DPMM Text Logo"
              className="h-10 sm:h-14 object-contain drop-shadow-md"
            />
          </div>

          {/* Desktop tab switcher (hidden on mobile — bottom bar used instead) */}
          <nav className="hidden md:flex items-center gap-2">
            {ROLES.map(r => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active ? 'text-white bg-white/20 shadow-inner' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  <r.icon className="w-4 h-4" />
                  {r.fullLabel}
                  <span className={`w-1.5 h-1.5 rounded-full ${isAuthed(r.id) ? 'bg-emerald-400' : 'bg-white/30'}`} />
                </button>
              );
            })}
          </nav>

          {/* Right: Sign Out + status */}
          <div className="flex items-center gap-2">
            {showSignOut && (
              <button
                onClick={() => handleLogout(role)}
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white
                           border border-white/20 hover:border-white/40
                           px-3 py-2 rounded-xl transition-all duration-200 bg-white/10"
                style={{ minHeight: '36px' }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-semibold
              bg-white/10 border-white/20 text-white`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse
                ${showSignOut ? 'bg-emerald-400' : 'bg-white/40'}`}
              />
              {getStatusLabel()}
            </div>
          </div>
        </div>
      </header>

      {/* ── Context Banner (desktop only) ────────────────────── */}
      <div className={`hidden md:block border-b border-slate-200 ${activeRole.bg}`}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-2">
          <activeRole.icon className={`w-3.5 h-3.5 ${activeRole.color}`} />
          <span className={`text-[11px] font-semibold ${activeRole.color}`}>
            Viewing as: {activeRole.fullLabel}
          </span>
          <span className="text-[11px] text-slate-500 ml-1">— {getStatusLabel()}</span>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      {/* pb-20 on mobile = space for bottom tab bar */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">

        {/* Public Portal */}
        {role === 'public' && (
          <div className="animate-fade-in">
            {showRegistration ? (
              <RegistrationForm 
                onToast={addToast} 
                onCancel={() => setShowRegistration(false)} 
              />
            ) : (
              <LandingPage 
                onRegister={() => setShowRegistration(true)} 
              />
            )}
          </div>
        )}

        {/* Admin Workspace */}
        {role === 'admin' && (
          <div className="animate-fade-in">
            {isAdminAuthed ? (
              <AdminDashboard onToast={addToast} />
            ) : (
              <LoginPage
                defaultRole="admin"
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </div>
        )}

        {/* Member Portal */}
        {role === 'member' && (
          <div className="animate-fade-in">
            {isMemberAuthed ? (
              <MemberPortal onToast={addToast} />
            ) : (
              <LoginPage
                defaultRole="member"
                onLoginSuccess={handleLoginSuccess}
                onRegisterClick={() => {
                  setRole('public');
                  setShowRegistration(true);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* ── PWA Install Prompt ─────────────────────────────── */}
      <InstallPrompt />

      {/* ── Mobile Bottom Tab Bar (Android / iOS) ─────────────── */}
      {/* Hidden on md+ desktop, replaces hamburger menu on mobile */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bottom-nav"
        style={{
          background: 'linear-gradient(135deg, #1e2e70 0%, #263a8d 100%)',
          paddingLeft: 'env(safe-area-inset-left,0px)',
          paddingRight: 'env(safe-area-inset-right,0px)',
        }}
      >
        <div className="flex items-stretch">
          {ROLES.map(r => {
            const active = role === r.id;
            const authed = isAuthed(r.id);
            return (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200
                  ${active ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                style={{ minHeight: '56px' }}
                aria-label={r.fullLabel}
                aria-current={active ? 'page' : undefined}
              >
                {/* Active pill background */}
                {active && (
                  <span className="absolute top-2 inset-x-3 h-1 rounded-full bg-white/80" />
                )}

                {/* Icon with auth dot */}
                <span className="relative">
                  <r.icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                  <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-sky-900
                    ${authed ? 'bg-emerald-400' : 'bg-white/30'}`}
                  />
                </span>

                {/* Label */}
                <span className={`text-[10px] font-semibold leading-none ${active ? 'opacity-100' : 'opacity-60'}`}>
                  {r.label}
                </span>
              </button>
            );
          })}

          {/* Sign Out tab — only visible when authed on admin/member */}
          {showSignOut && (
            <button
              onClick={() => handleLogout(role)}
              className="flex-shrink-0 w-14 flex flex-col items-center justify-center gap-1 py-3 text-white/60 hover:text-white transition-colors border-l border-white/10"
              style={{ minHeight: '56px' }}
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-none opacity-60">Exit</span>
            </button>
          )}
        </div>
      </nav>

      {/* ── Footer (desktop only) ─────────────────────────────── */}
      <footer
        className="hidden md:block border-t py-4 px-4"
        style={{ borderColor: '#1e2e70', background: 'linear-gradient(135deg, #1e2e70 0%, #263a8d 100%)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={dpmmLogo} alt="DPMM" className="w-5 h-5 object-contain opacity-80" />
            <p className="text-[11px] text-white/60">© 2026 Dewan Perniagaan Melayu Malaysia (DPMM) · Hak Cipta Terpelihara</p>
          </div>
          <p className="text-[11px] text-white/40">Sistem v2.0.0 · Dibina dengan React + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
