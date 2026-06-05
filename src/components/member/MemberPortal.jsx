import { useState } from 'react';
import {
  Building2, Shield, Calendar, Download, AlertTriangle, CheckCircle2,
  Clock, CreditCard, ChevronRight, Star, Search, SlidersHorizontal, User, Lock, Upload, Printer, FileText
} from 'lucide-react';
import { dbInstance, MALAYSIAN_STATES } from '../../data/mockData';
import { PaymentModal, CommunityWidget, B2BCard } from './MemberWidgets';

const SECTORS = ['All', 'IT Services', 'Logistics', 'Construction', 'Energy', 'F&B', 'Healthcare', 'Creative', 'Agriculture', 'Engineering', 'Property'];

function ReceiptRow({ receipt, onDownload }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="w-px flex-1 bg-slate-100 mt-2 min-h-[2rem]" />
      </div>
      <div className="flex-1 pb-6">
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-800">{receipt.year}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-semibold text-slate-500">{receipt.date}</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-400">{receipt.method}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-black text-emerald-600">{receipt.amount}</p>
            <button
              onClick={() => onDownload(receipt)}
              className="flex items-center gap-1.5 text-[10px] text-slate-700 hover:text-blue-900 mt-1 transition-colors font-bold uppercase tracking-wider"
            >
              <Download className="w-3 h-3" /> PDF Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function B2BTab({ memberStatus, memberState, memberId }) {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');

  // Load from dbInstance to reflect any updates dynamically
  const peers = dbInstance.members
    .filter(m => m.status === 'Active' && m.state === memberState && m.member_id !== memberId)
    .map(m => ({
      id: m.member_id,
      company: m.company_name,
      sector: m.business_type,
      desc: `${m.category} member offering services in ${m.business_type} sector.`,
      phone: m.phone_mobile.replace('+', ''),
      verified: true
    }));

  const filtered = peers.filter(p => {
    const matchSearch = p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === 'All' || p.sector === sector;
    return matchSearch && matchSector;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-1">B2B Matchmaking Directory</h2>
        <p className="text-xs text-slate-500">Connect directly with verified corporate members in the association network.</p>
      </div>

      <CommunityWidget isActive={memberStatus === 'Active'} />

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search verified businesses by name or services…"
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {SECTORS.map(s => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 shrink-0
              ${sector === s ? 'bg-accent border-accent text-white shadow-sm hover:bg-accent-dark hover:border-accent-dark' : 'bg-white border-slate-200 text-slate-550 hover:border-slate-350'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(peer => <B2BCard key={peer.id} peer={peer} />)}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <p className="text-slate-500 text-xs">No business profiles match the query "{search}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Interactive print-ready Receipt PDF Modal
function ReceiptPdfModal({ receipt, onClose }) {
  if (!receipt) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 border border-slate-200 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 text-sm font-bold border border-slate-250 rounded-lg p-1.5 hover:bg-slate-50">
          ✕ Close
        </button>
        
        {/* Receipt Formatted Sheet */}
        <div className="border border-slate-300 p-6 rounded-xl font-mono text-xs text-slate-700 bg-slate-50/50 space-y-4" id="printable-receipt">
          <div className="text-center border-b border-dashed border-slate-300 pb-4 space-y-1">
            <h3 className="text-sm font-bold text-blue-900">DEWAN PERNIAGAAN MELAYU MALAYSIA (DPMM)</h3>
            <p className="text-[10px] text-slate-500">Kuala Lumpur, Malaysia · Reg. Association 9822/ROC</p>
            <p className="text-[11px] font-bold text-slate-800 pt-2 uppercase tracking-wide">Official Renewal Receipt (RESIT RASMI)</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <span className="text-[10px] text-slate-400 block">RECEIPT NO (NO. RESIT):</span>
              <span className="font-bold text-slate-800">{receipt.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">DATE OF PAYMENT:</span>
              <span className="font-bold text-slate-800">{receipt.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block">MEMBERSHIP NO (MEMBER NO.):</span>
              <span className="font-bold text-slate-800">DPMM-2026-0042</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">GATEWAY TXN ID:</span>
              <span className="font-bold text-slate-600 text-[10px]">TXN-BILLPLZ-2026-894A</span>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-3">
            <span className="text-[10px] text-slate-400 block">PAID BY (DITERIMA DARI):</span>
            <span className="font-bold text-slate-800 block text-xs">Horizon Dynamics Sdn Bhd</span>
            <span className="text-slate-500 block text-[10px] mt-0.5">SSM No: 202201088990</span>
          </div>

          <div className="border-t border-dashed border-slate-300 pt-3 flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">{receipt.year}</p>
              <p className="text-[10px] text-slate-400">{receipt.method}</p>
            </div>
            <p className="text-sm font-black text-emerald-600">{receipt.amount}</p>
          </div>

          <div className="text-center pt-2 text-[9px] text-slate-400 leading-normal">
            Computer generated receipt. No physical signature is required. <br />
            Thank you for supporting Dewan Perniagaan Melayu Malaysia (DPMM).
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-1.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-1.5 rounded-xl border border-slate-200"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MemberPortal({ onToast }) {
  const [member, setMember] = useState({
    id: 'DPMM-2026-0042',
    company: 'Horizon Dynamics Sdn Bhd',
    ssm_no: '202201088990',
    category: 'Ordinary Member',
    status: 'Active',
    expiresDays: 14,
    contact: 'Iskandar Putra',
    email: 'iskandar@horizondynamics.my',
    phone_mobile: '+6012-3400042',
    phone_office: '+603-80809090',
    address: 'Block C-3-12, IOI Boulevard, Puchong, Selangor',
    state: 'Selangor',
    business_type: 'Engineering',
    joinYear: 2021,
    ic_number: '920603-10-5541'
  });

  const [receiptsList, setReceiptsList] = useState([
    { id: 'RCP-2024-042', year: 'Subscription Year 2024', amount: 'RM 100.00', date: '15 Jan 2024', method: 'FPX – Maybank2u' },
    { id: 'RCP-2025-042', year: 'Subscription Year 2025', amount: 'RM 100.00', date: '10 Jan 2025', method: 'FPX – CIMB Clicks' },
  ]);

  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Document Vault files
  const [ssmFileUploaded, setSsmFileUploaded] = useState(true);
  const [uploadedSsmName, setUploadedSsmName] = useState('SSM_Profile_Horizon_Dynamics.pdf');
  const [uploadingSsm, setUploadingSsm] = useState(false);
  const [ssmUploadProgress, setSsmUploadProgress] = useState(0);

  // Profile Edit fields
  const [editedContact, setEditedContact] = useState(member.contact);
  const [editedPhone, setEditedPhone] = useState(member.phone_mobile);
  const [editedOffice, setEditedOffice] = useState(member.phone_office);
  const [editedAddress, setEditedAddress] = useState(member.address);
  const [editedBizType, setEditedBizType] = useState(member.business_type);
  const [editedEmail, setEditedEmail] = useState(member.email);
  const [editedState, setEditedState] = useState(member.state);

  const handlePaySuccess = () => {
    setShowPayment(false);
    
    // Add new payment to local receipts vault list
    const newReceipt = {
      id: `RCP-2026-${String(receiptsList.length + 42).padStart(3, '0')}`,
      year: 'Subscription Year 2026',
      amount: 'RM 100.00',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      method: 'FPX – Instant Rail Online'
    };
    
    setReceiptsList([newReceipt, ...receiptsList]);
    setMember(m => ({ ...m, status: 'Active', expiresDays: 365 }));
    
    // Sync to mock database instance
    dbInstance.updateMember(member.id, {
      status: 'Active',
      expiry_date: '2026-12-31'
    });

    dbInstance.createPayment({
      member_id: member.id,
      subscription_year: '2026',
      amount_rm: 100.00,
      payment_status: 'SUCCESS'
    });

    onToast({
      type: 'success',
      title: 'Payment Successful!',
      message: 'Your membership has been renewed for Subscription Year 2026. Official receipt generated in vault.'
    });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updated = {
      ...member,
      contact: editedContact,
      phone_mobile: editedPhone,
      phone_office: editedOffice,
      address: editedAddress,
      business_type: editedBizType,
      email: editedEmail,
      state: editedState
    };
    setMember(updated);

    // Sync to central mock dbInstance
    dbInstance.updateMember(member.id, {
      contact_person: editedContact,
      phone_mobile: editedPhone,
      phone_office: editedOffice,
      address: editedAddress,
      business_type: editedBizType,
      email: editedEmail,
      state: editedState
    });

    onToast({
      type: 'success',
      title: 'Profile Updated!',
      message: 'Your organization metadata changes have been synchronized with Supabase database.'
    });
  };

  const simulateSsmUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSsm(true);
    setSsmUploadProgress(0);
    setUploadedSsmName(file.name);

    const interval = setInterval(() => {
      setSsmUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingSsm(false);
          setSsmFileUploaded(true);
          onToast({
            type: 'success',
            title: 'SSM Document Vault Synchronized',
            message: 'Your SSM filing has been uploaded into Supabase storage buckets securely.'
          });
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const showExpiryBanner = member.expiresDays <= 30 && member.status === 'Active';
  const showLapsedBanner = member.status === 'Lapsed';

  return (
    <>
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} onSuccess={handlePaySuccess} />
      <ReceiptPdfModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />

      {/* ── DEMONSTRATION PURPOSE ONLY ── */}
      <div className="bg-amber-50 border border-amber-250 rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-800">Demonstration Purpose Only</p>
          <p className="text-[11px] text-amber-650 mt-0.5 leading-relaxed font-medium">
            This portal showcases the member workspace. Interactive actions such as uploads, profile updates, and billing simulations occur locally within the browser context.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* Profile overview card */}
        <div className="card p-5 relative overflow-hidden border-t-2 border-t-blue-900">
          <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at top right, #e42b40, transparent 70%)' }} />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg">
              {member.company.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-lg font-bold text-black">{member.company}</h1>
                <span className={member.status === 'Active' ? 'badge-active' : 'badge-lapsed'}>
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{member.category}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-xs text-slate-700 font-mono font-semibold">Member No.: {member.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Member since {member.joinYear}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-slate-500 font-medium">{5 - (2026 - member.joinYear)} loyalty years</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Alert Banner (T-30 / T-14) */}
        {showExpiryBanner && (
          <div className="bg-amber-50 border border-amber-250 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-amber-800">
                  Membership subscription expires in {member.expiresDays} days.
                </p>
                <p className="text-[11px] text-amber-650 mt-0.5">
                  Please process outstanding annual fee (RM 100.00) online to maintain active networking directory access.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-bold px-5 py-1.5 rounded-xl transition-all duration-200 active:scale-95 shrink-0"
              style={{ minHeight: '36px' }}
            >
              Renew Online <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lapsed Warning Banner (T-0) */}
        {showLapsedBanner && (
          <div className="bg-rose-50 border border-rose-250 border-l-4 border-l-accent rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-rose-800">
                  Membership Lapsed. Access Gated.
                </p>
                <p className="text-[11px] text-rose-650 mt-0.5">
                  Your B2B networking directory profiles, WhatsApp links, and community invitations have been temporarily hidden. Settle outstanding fees to unlock.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-bold px-5 py-1.5 rounded-xl transition-all duration-200 active:scale-95 shrink-0"
              style={{ minHeight: '36px' }}
            >
              Pay Dues RM 100 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs Selection Bar */}
        <div className="grid grid-cols-2 sm:flex p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-inner gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'profile',  label: 'Corporate Profile' },
            { id: 'receipts', label: 'Vault' },
            { id: 'b2b',      label: 'B2B Matchmaking' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[100px] shrink-0 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${activeTab === t.id ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-500 hover:text-blue-900 hover:bg-slate-50/50'}`}
              style={{ minHeight: '38px' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Membership Details */}
            <div className="card p-5 space-y-4 border-t-2 border-t-blue-900">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-blue-900" /> Membership Details
              </h3>
              {[
                ['Member No.', member.id],
                ['Company Name', member.company],
                ['SSM Registration', member.ssm_no],
                ['Category Tier', member.category],
                ['Status', member.status],
                ['Contact Rep', member.contact],
                ['Primary Email', member.email],
              ].map(([l,v]) => (
                <div key={l} className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 last:border-0">
                  <span className="text-[11px] text-slate-400 shrink-0 w-28 font-medium">{l}</span>
                  <span className="text-[11px] text-slate-800 text-right font-bold">{v}</span>
                </div>
              ))}
            </div>

            {/* Subscription Status Card */}
            <div className="card p-5 space-y-4 border-t-2 border-t-blue-900">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-blue-900" /> Subscription Status
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Current Active Year</p>
                <p className="text-2xl font-black text-blue-900 mt-0.5">2026</p>
                <span className={`mt-2 inline-block ${member.status === 'Active' ? 'badge-active' : 'badge-lapsed'}`}>
                  {member.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4.5 h-4.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">
                  {member.expiresDays <= 30
                    ? `Validity Warning: Expires in ${member.expiresDays} days`
                    : 'Valid through 31 Dec 2026'}
                </span>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-1.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                style={{ minHeight: '36px' }}
              >
                <CreditCard className="w-4 h-4" /> Renew Membership Subscription
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in space-y-5">
            
            {/* PDPA Privacy Protection Notice */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 items-start">
              <Lock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">PDPA & RLS Privacy Lock Enabled</p>
                <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">
                  Sensitive personal credentials (like personal IC Number <span className="font-bold font-mono">{member.ic_number.slice(0,6)}-XX-XXXX</span>) are strictly isolated from the public directory. Your database access is governed by strict Supabase RLS policies and compliance standards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Profile details form */}
              <form onSubmit={handleProfileSave} className="card p-5 space-y-4 md:col-span-2 border-t-2 border-t-blue-900">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider mb-2">
                  <User className="w-4 h-4 text-blue-900" /> Edit Corporate Metadata
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Company (Syarikat)</label>
                    <input
                      type="text"
                      value={member.company}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">SSM Registration No.</label>
                    <input
                      type="text"
                      value={member.ssm_no}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Representative Name</label>
                    <input
                      type="text"
                      value={editedContact}
                      onChange={e => setEditedContact(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:border-slate-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={e => setEditedEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:border-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Mobile Contact (+60...)</label>
                    <input
                      type="tel"
                      value={editedPhone}
                      onChange={e => setEditedPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:border-slate-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Office Contact</label>
                    <input
                      type="tel"
                      value={editedOffice}
                      onChange={e => setEditedOffice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:border-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Business Sector Tag</label>
                    <select
                      value={editedBizType}
                      onChange={e => setEditedBizType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:border-slate-400 outline-none"
                    >
                      {SECTORS.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">State / Territory</label>
                    <select
                      value={editedState}
                      onChange={e => setEditedState(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:border-slate-400 outline-none"
                    >
                      {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Registered Address</label>
                  <textarea
                    rows={2}
                    value={editedAddress}
                    onChange={e => setEditedAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:border-slate-400 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-1.5 px-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm"
                  style={{ minHeight: '40px' }}
                >
                  Save Profile Updates
                </button>
              </form>

              {/* Document Vault Component */}
              <div className="card p-5 space-y-4 flex flex-col justify-between border-t-2 border-t-blue-900">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider mb-2">
                    <Upload className="w-4 h-4 text-blue-900" /> Document Vault
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Store and renew certified company profiles securely. Submit updated SSM profile documents for annual compliance confirmation checks.
                  </p>
                </div>

                {ssmFileUploaded ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-200 text-slate-700 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-700 truncate">{uploadedSsmName}</p>
                        <p className="text-[9px] text-slate-450">Filing Status: Verified</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                    <label className="block text-center border border-dashed border-slate-300 hover:border-slate-400 bg-white cursor-pointer rounded-lg py-2 text-[9px] font-bold text-slate-600 transition-colors">
                      Upload Updated SSM Filing
                      <input type="file" onChange={simulateSsmUpload} className="hidden" accept=".pdf,.png,.jpg" />
                    </label>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-250 hover:border-slate-400 hover:bg-slate-50 cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-[10px] font-bold text-slate-700">Drop SSM Document</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">PDF or image files up to 5MB</span>
                    <input type="file" onChange={simulateSsmUpload} className="hidden" accept=".pdf,.png,.jpg" />
                  </label>
                )}

                {uploadingSsm && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] text-slate-450">
                      <span>Syncing buckets…</span>
                      <span>{ssmUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                      <div className="bg-slate-800 h-full transition-all" style={{ width: `${ssmUploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'receipts' && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4.5 h-4.5 text-blue-900" /> Receipt History Vault
            </h3>
            <div className="relative pt-2">
              {receiptsList.map(r => <ReceiptRow key={r.id} receipt={r} onDownload={(rec) => setSelectedReceipt(rec)} />)}
              
              {member.expiresDays <= 30 && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-amber-50 border border-amber-250 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="card p-4 border-amber-250 border-l-4 border-l-amber-500 flex items-center justify-between gap-3 bg-amber-50/10">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Subscription Year 2026</p>
                        <p className="text-xs text-amber-650 mt-0.5 font-medium">Payment Dues Outstanding</p>
                      </div>
                      <button
                        onClick={() => setShowPayment(true)}
                        className="bg-accent hover:bg-accent-dark text-white font-bold text-xs py-2 px-4 rounded-xl shrink-0 transition-all active:scale-95"
                        style={{ minHeight: '32px' }}
                      >
                        Pay RM 100
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'b2b' && <B2BTab memberStatus={member.status} memberState={member.state} memberId={member.id} />}
      </div>
    </>
  );
}
