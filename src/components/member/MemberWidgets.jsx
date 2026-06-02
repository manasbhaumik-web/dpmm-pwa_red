import { useState } from 'react';
import { X, CreditCard, Building2, ChevronRight, Lock } from 'lucide-react';
import { BANKS } from '../../data/mockData';

const WA_ICON = () => (
  <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M16 3C9 3 3 9 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.5 28.3 13.7 29 16 29c7 0 13-6 13-13S23 3 16 3zm0 23.8c-2.1 0-4.2-.6-6-1.6l-.4-.3-4 1 1-3.9-.3-.4A10.8 10.8 0 0 1 5.1 16C5.1 10.1 10 5.2 16 5.2S26.8 10.1 26.8 16 21.9 26.8 16 26.8zm5.9-8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.1-.8 1-.9 1.2-.3.2-.6 0c-1.6-.8-2.7-1.4-3.8-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4-.1-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.1 2 3.1 4.9 4.3 1.8.8 2.5.9 3.4.7.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z"/>
  </svg>
);

export function PaymentModal({ isOpen, onClose, onSuccess }) {
  const [method, setMethod] = useState('fpx');
  const [selectedBank, setSelectedBank] = useState(null);
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const canProceed = method === 'fpx' ? !!selectedBank : (cardNum.length >= 16 && cardExp && cardCvc);

  const handleProceed = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Renew Membership</h3>
            <p className="text-xs text-slate-500">Subscription Year 2026</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Fee Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Annual Membership Fee</span>
              <span className="text-slate-800">RM 100.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Processing Fee</span>
              <span className="text-slate-800">RM 0.00</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between">
              <span className="text-sm font-semibold text-slate-900">Total</span>
              <span className="text-lg font-bold text-emerald-600">RM 100.00</span>
            </div>
          </div>

          {/* Method Selection */}
          <div>
            <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMethod('fpx')}
                className={`rounded-xl p-3 border text-left transition-all duration-200
                  ${method === 'fpx' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className={`w-4 h-4 ${method === 'fpx' ? 'text-sky-600' : 'text-slate-500'}`} />
                  <span className={`text-xs font-semibold ${method === 'fpx' ? 'text-sky-600' : 'text-slate-700'}`}>FPX Online</span>
                </div>
                <p className="text-[10px] text-slate-9000">Malaysian internet banking</p>
              </button>
              <button
                onClick={() => setMethod('card')}
                className={`rounded-xl p-3 border text-left transition-all duration-200
                  ${method === 'card' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className={`w-4 h-4 ${method === 'card' ? 'text-sky-600' : 'text-slate-500'}`} />
                  <span className={`text-xs font-semibold ${method === 'card' ? 'text-sky-600' : 'text-slate-700'}`}>Card</span>
                </div>
                <p className="text-[10px] text-slate-9000">Credit / Debit card</p>
              </button>
            </div>
          </div>

          {/* FPX Bank Grid */}
          {method === 'fpx' && (
            <div className="animate-fade-in">
              <p className="text-xs text-slate-500 mb-3">Select Your Bank</p>
              <div className="grid grid-cols-3 gap-2">
                {BANKS.map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`rounded-xl p-3 border text-center transition-all duration-200 active:scale-95
                      ${selectedBank === bank.id ? 'border-sky-500 ring-1 ring-sky-500' : 'border-slate-200 hover:border-slate-300'}`}
                    style={{ background: selectedBank === bank.id ? bank.bg + '33' : '' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ background: bank.bg }}
                    >
                      {bank.name.slice(0, 2)}
                    </div>
                    <p className="text-[9px] text-slate-700 font-medium leading-tight">{bank.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Form */}
          {method === 'card' && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Card Number</label>
                <input
                  value={cardNum}
                  onChange={e => setCardNum(e.target.value.replace(/\D/g,'').slice(0,16))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-sm text-slate-800 font-mono placeholder-slate-300 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Expiry</label>
                  <input
                    value={cardExp}
                    onChange={e => setCardExp(e.target.value.slice(0,5))}
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-sm text-slate-800 font-mono placeholder-slate-300 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">CVC</label>
                  <input
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value.replace(/\D/,'').slice(0,3))}
                    placeholder="•••"
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-sm text-slate-800 font-mono placeholder-slate-300 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!canProceed || processing}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                Proceed to Pay · RM 100.00 <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-9000 text-center">
            Secured by SSL · Powered by Billplz / PayEx
          </p>
        </div>
      </div>
    </div>
  );
}

export function CommunityWidget({ isActive }) {
  return (
    <div className={`card p-5 relative overflow-hidden ${!isActive ? 'select-none' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg flex items-center justify-center">
          <WA_ICON />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Walled-Garden Community</p>
          <p className="text-xs text-slate-500">DPMM Members WhatsApp Group</p>
        </div>
      </div>

      {isActive ? (
        <div className="animate-fade-in">
          <p className="text-xs text-slate-500 mb-3">You have full community access as an active member.</p>
          <a
            href="https://chat.whatsapp.com/mock-antigravity-link"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-1.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-95"
            style={{ background: '#25D366' }}
          >
            <WA_ICON /> Launch Group Invitation Link
          </a>
        </div>
      ) : (
        <div className="relative">
          {/* Blurred content */}
          <div className="filter blur-sm pointer-events-none select-none">
            <p className="text-xs text-slate-500 mb-3">Members-only community with exclusive resources and networking.</p>
            <div className="h-10 bg-[#25D366]/20 rounded-xl" />
          </div>
          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/70 backdrop-blur-[2px] rounded-xl border border-slate-200">
            <Lock className="w-6 h-6 text-slate-500" />
            <p className="text-xs text-slate-500 text-center px-4 leading-relaxed font-medium">
              Access restricted. Settle outstanding renewals to unlock community access links.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function B2BCard({ peer }) {
  const sectorColors = {
    'IT Services': 'bg-sky-50 text-sky-700 border-sky-200',
    'Logistics': 'bg-violet-50 text-violet-700 border-violet-200',
    'Construction': 'bg-amber-50 text-amber-700 border-amber-200',
    'Energy': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'F&B': 'bg-orange-50 text-orange-700 border-orange-200',
    'Healthcare': 'bg-rose-50 text-rose-700 border-rose-200',
    'Creative': 'bg-pink-50 text-pink-700 border-pink-200',
    'Agriculture': 'bg-lime-50 text-lime-700 border-lime-200',
    'Engineering': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Property': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  const cls = sectorColors[peer.sector] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <div className="card-hover p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{peer.company}</p>
            {peer.verified && (
              <span title="Verified Member" className="shrink-0 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </div>
          <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${cls}`}>{peer.sector}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{peer.desc}</p>
      <a
        href={`https://wa.me/${peer.phone}?text=Hello%2C%20I%20found%20your%20listing%20on%20DPMM%20B2B%20Matchmaking.`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-1.5 rounded-xl font-semibold text-xs text-white transition-all duration-200 active:scale-95 hover:opacity-90"
        style={{ background: '#25D366' }}
      >
        <WA_ICON /> Chat on WhatsApp
      </a>
    </div>
  );
}
