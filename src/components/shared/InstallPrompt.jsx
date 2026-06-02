import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

/**
 * PWA Install Prompt
 * - On Android Chrome: catches the beforeinstallprompt event and shows a custom banner
 * - On iOS Safari: detects standalone mode and shows "Add to Home Screen" instructions
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroid, setShowAndroid]       = useState(false);
  const [showIOS, setShowIOS]               = useState(false);
  const [dismissed, setDismissed]           = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Already installed as standalone? Hide.
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      return;
    }

    // Detect iOS Safari
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    if (isIOS && isSafari) {
      const timer = setTimeout(() => setShowIOS(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android / Chrome: listen for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroid(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowAndroid(false);
    if (outcome === 'accepted') setDismissed(true);
  };

  const handleDismiss = () => {
    setShowAndroid(false);
    setShowIOS(false);
    setDismissed(true);
  };

  if (!showAndroid && !showIOS) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 inset-x-4 z-[9998] animate-slide-up"
      style={{ paddingBottom: showAndroid || showIOS ? 'env(safe-area-inset-bottom, 0px)' : 0 }}
    >
      <div className="max-w-sm mx-auto bg-brand-800 border border-sky-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Accent strip */}
        <div className="h-1 bg-gradient-to-r from-sky-500 to-violet-600" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-violet-600 rounded-xl flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-50">Install DPMM AMS</p>
              {showAndroid && (
                <p className="text-xs text-brand-400 mt-0.5 leading-relaxed">
                  Add to your home screen for a faster, app-like experience — works offline too.
                </p>
              )}
              {showIOS && (
                <p className="text-xs text-brand-400 mt-0.5 leading-relaxed">
                  Tap <span className="text-sky-400 font-semibold">Share</span> then{' '}
                  <span className="text-sky-400 font-semibold">"Add to Home Screen"</span> to install.
                </p>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="text-brand-500 hover:text-brand-300 transition-colors p-1 shrink-0"
              style={{ minWidth: '32px', minHeight: '32px' }}
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {showAndroid && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAndroidInstall}
                className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-sm rounded-xl py-1.5 transition-all duration-200 active:scale-95"
              >
                <Download className="w-4 h-4" /> Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-1.5 text-sm text-brand-400 hover:text-brand-200 border border-brand-700 rounded-xl transition-colors"
              >
                Later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
