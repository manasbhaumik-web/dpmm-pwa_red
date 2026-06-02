import { useState } from 'react';
import {
  Zap, Users, Shield, TrendingUp, ArrowRight, CheckCircle2,
  Globe, Handshake, Award, ChevronRight, Star, Building2,
  MessageSquare, BarChart3, FileCheck, Wifi, ChevronDown, Landmark, Sparkles
} from 'lucide-react';

const WA_ICON = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M16 3C9 3 3 9 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.5 28.3 13.7 29 16 29c7 0 13-6 13-13S23 3 16 3zm0 23.8c-2.1 0-4.2-.6-6-1.6l-.4-.3-4 1 1-3.9-.3-.4A10.8 10.8 0 0 1 5.1 16C5.1 10.1 10 5.2 16 5.2S26.8 10.1 26.8 16 21.9 26.8 16 26.8zm5.9-8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.1-.8 1-.9 1.2-.3.2-.6 0c-1.6-.8-2.7-1.4-3.8-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4-.1-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.1 2 3.1 4.9 4.3 1.8.8 2.5.9 3.4.7.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z"/>
  </svg>
);

const STATS = [
  { value: '209',     label: 'Registered Members',  icon: Users },
  { value: '185',     label: 'Active Businesses',    icon: TrendingUp },
  { value: '12+',     label: 'Industry Sectors',     icon: Globe },
  { value: 'Since \'98', label: 'Years of Advocacy', icon: Award },
];

const FEATURES = [
  {
    icon: FileCheck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    title: 'Digital Membership',
    desc: 'Paperless registration and instant database sync. Submit your SSM documents securely online.',
  },
  {
    icon: Handshake,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    title: 'B2B Matchmaking',
    desc: 'Connect directly with 185+ verified member businesses across 12 sectors via WhatsApp wa.me links.',
  },
  {
    icon: Shield,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    title: 'Official Recognition',
    desc: 'Receive a unique membership ID (Member No.) and carry the association endorsement in all dealings.',
  },
  {
    icon: BarChart3,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'AGM Participation',
    desc: 'Vote on association resolutions and access audited financial reports at the Annual General Meeting.',
  },
  {
    icon: MessageSquare,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    title: 'Walled-Garden Community',
    desc: 'Exclusive access to private WhatsApp groups and deal-flow threads gated to active accounts.',
  },
  {
    icon: Wifi,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    title: 'Real-Time Sync Console',
    desc: 'Track membership status, download digital receipts, and manage profile modifications 24/7.',
  },
];

const CATEGORIES = [
  { name: 'Ordinary Member', fee: 'RM 100 / year', desc: 'For active Malaysian-registered businesses. Full voting rights.', highlight: true },
  { name: 'Associate Member', fee: 'RM 100 / year', desc: 'For professional firms, NGOs & non-business entities.', highlight: false },
  { name: 'Life Member',      fee: 'RM 1,000 (one-time)', desc: 'Lifetime membership with all benefits and no renewals.', highlight: false },
];

const TESTIMONIALS = [
  {
    name: 'Ahmad Razif',
    stars: 5,
    text: 'The digital membership portal made registration so simple! Instant WhatsApp match-up got us two corporate logistics contracts in our first week.',
    company: 'Mutiara Logistics Sdn Bhd',
    sector: 'Logistics'
  },
  {
    name: 'Lim Wei Ling',
    stars: 5,
    text: 'Our IT consultancy business has grown significantly since joining. Having a digital Endorsement and a secure document vault helps build trust.',
    company: 'TechNex Solutions Sdn Bhd',
    sector: 'IT Services'
  },
  {
    name: 'Ravi Kumar',
    stars: 5,
    text: 'Advocacy for local businesses is excellent. The simple annual RM100 renewal fee is exceptional value for the networking access we receive.',
    company: 'Bina Teguh Construction',
    sector: 'Construction'
  }
];

const StarRating = ({ count }) => {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  );
};

const MOCK_SECTOR_SHOWCASE = {
  'IT Services': {
    count: 42,
    avgLoyalty: '4.8 Years',
    verified: '98%',
    samples: [
      { name: 'TechNex Solutions Sdn Bhd', desc: 'Enterprise software, cloud migration & managed IT services.', phone: '60198765432' },
      { name: 'Giga Systems Integration', desc: 'Network infrastructure, cybersecurity & CCTV systems.', phone: '60112345679' }
    ]
  },
  'Logistics': {
    count: 28,
    avgLoyalty: '5.2 Years',
    verified: '100%',
    samples: [
      { name: 'Mutiara Logistics Sdn Bhd', desc: 'Last-mile delivery, warehousing & freight forwarding.', phone: '60123456789' },
      { name: 'Alpha Maritime Sdn Bhd', desc: 'Port logistics, ship agency & customs clearance.', phone: '60178901235' }
    ]
  },
  'Construction': {
    count: 31,
    avgLoyalty: '6.1 Years',
    verified: '95%',
    samples: [
      { name: 'Bina Teguh Construction', desc: 'Grade G7 contractor — civil, structural & M&E works.', phone: '60112233445' }
    ]
  },
  'Energy': {
    count: 15,
    avgLoyalty: '3.5 Years',
    verified: '92%',
    samples: [
      { name: 'Seraya Green Energy', desc: 'Solar PV system design, supply & installation.', phone: '60178901234' }
    ]
  }
};

const FAQS = [
  { q: 'How long does the registration verification take?', a: 'Once you submit your SSM certificate and representative details, our secretariat reviews the queue. Verification and incremental Member No. generation typically takes 1-2 working days.' },
  { q: 'What files are required for uploading?', a: 'We require a copy of your SSM corporate profile (Form 9 / Section 17) and the representative Identity Card (IC) front image for identity confirmation.' },
  { q: 'How are sensitive personal fields protected?', a: 'Sensitive personal fields like personal IC numbers are secured under strict Row-Level Security (RLS) rules in our Supabase database. They are only viewable by association auditors and are never shared in public directories.' },
  { q: 'What payment rails are supported for renewals?', a: 'We simulate FPX internet banking via ToyyibPay/Billplz (including Maybank2u, CIMB Clicks, RHB, etc.) alongside Credit and Debit card checkouts.' }
];

export default function LandingPage({ onRegister }) {
  const [selectedShowcaseSector, setSelectedShowcaseSector] = useState('IT Services');
  const [activeFaq, setActiveFaq] = useState(null);

  // Calculator states
  const [calcTier, setCalcTier] = useState('Ordinary');
  const [calcSize, setCalcSize] = useState('500k-2M');

  const calculateROI = () => {
    const cost = calcTier === 'Life' ? 1000 : 100;
    let multiplier = 1;
    if (calcSize === 'under-500k') multiplier = 1.2;
    if (calcSize === '500k-2M') multiplier = 2.5;
    if (calcSize === 'above-2M') multiplier = 5.0;

    const leads = Math.round(15 * multiplier);
    const value = Math.round(cost * 18 * multiplier);
    return { leads, value };
  };

  const { leads, value } = calculateROI();

  return (
    <div className="w-full space-y-12 animate-fade-in">
      
      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm" style={{
        backgroundImage: `radial-gradient(circle at top right, rgba(38,58,141,0.05) 0%, transparent 60%)`,
      }}>
        {/* Animated pattern & glow */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:30px_30px]" />

        <div className="relative z-10 px-3 py-16 md:px-12 md:py-24 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-left">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4.5 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs text-primary font-bold tracking-wide uppercase">Dewan Perniagaan Melayu Malaysia (DPMM)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)' }}>
              Memperkasa Usahawan <br />
              <span className="text-accent">Melayu Malaysia</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
              Malaysia's automated PWA platform for B2B collaboration. Connect directly with <strong className="text-slate-900">209 verified companies</strong>, access walled-garden networks, and manage your membership seamlessly.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onRegister}
                className="bg-accent hover:bg-accent/90 text-white font-bold text-base px-4 py-1.5 rounded-xl shadow-lg shadow-accent/20 transition-all duration-200 active:scale-95 flex items-center gap-2"
              >
                Join Membership <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://wa.me/60312345678?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20DPMM%20membership."
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.preventDefault()}
                className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-bold text-base bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-200 active:scale-95 border border-emerald-200"
              >
                <WA_ICON /> Contact Secretariat
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sejak 1938
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 15 Cawangan Negeri
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kad APEC Business Travel
              </div>
            </div>
          </div>

          {/* Right Hero side: Clean Metric cards */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Verified Registry</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                </span>
              </div>
              <p className="text-4xl font-black text-slate-900 font-mono tracking-tight">209</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-primary h-full w-[88%]" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">185 Active (Active) · 24 Pending/Lapsed</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Annual Membership</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">RM 100.00 <span className="text-xs font-medium text-slate-500">/ yr</span></p>
              </div>
              <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center">
                <Landmark className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="card p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 bg-white">
          {STATS.map((s, index) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center text-center p-4">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── INTERACTIVE B2B SECTOR SHOWCASE ────────────────────────── */}
      <section className="card p-6 md:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Showcase Sandbox
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Explore Our B2B Networking Hub</h2>
          <p className="text-xs md:text-sm text-slate-500">
            Click through sectors to preview live member counts, loyalty distributions, and sample directory profiles featuring direct WhatsApp connections.
          </p>
        </div>

        {/* Sector Tabs */}
        <div className="flex gap-2 justify-center flex-wrap">
          {Object.keys(MOCK_SECTOR_SHOWCASE).map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedShowcaseSector(sector)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border
                ${selectedShowcaseSector === sector
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-primary/50'}`}
              style={{ minHeight: '40px' }}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Showcase Area */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Stats Column */}
          <div className="space-y-4 flex flex-col justify-center">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Sector Overview</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedShowcaseSector}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Members</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{MOCK_SECTOR_SHOWCASE[selectedShowcaseSector].count}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Loyalty</p>
                <p className="text-xs font-black text-slate-850 mt-1">{MOCK_SECTOR_SHOWCASE[selectedShowcaseSector].avgLoyalty}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Verified</p>
                <p className="text-xs font-black text-emerald-600 mt-1">{MOCK_SECTOR_SHOWCASE[selectedShowcaseSector].verified}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every profile in this sector is fully registered with a verified SSM certificate. Peer-matching cards render direct deep links for rapid networking.
            </p>
          </div>

          {/* Sample Cards Columns */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_SECTOR_SHOWCASE[selectedShowcaseSector].samples.map((peer, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-bold text-slate-800 truncate">{peer.name}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{peer.desc}</p>
                </div>

                <a
                  href={`https://wa.me/${peer.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.preventDefault()}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#25D366] text-white rounded-lg text-[10px] font-bold hover:opacity-95 active:scale-95 transition-all"
                >
                  <WA_ICON /> Chat with Representative
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP VALUE CALCULATOR ───────────────────────────── */}
      <section className="card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-700 via-transparent to-transparent pointer-events-none" />
        
        <div className="space-y-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            ROI Simulator
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Calculate Your Membership Value</h2>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
            Select your preferred membership category and organization size. Instantly project your business networking output and potential financial value generated.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Business Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {['Ordinary', 'Associate', 'Life'].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setCalcTier(tier)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all
                      ${calcTier === tier ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    style={{ minHeight: '38px' }}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Annual Revenue Range (RM)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'under-500k', label: '< 500k' },
                  { value: '500k-2M', label: '500k - 2M' },
                  { value: 'above-2M', label: '> 2M' }
                ].map(size => (
                  <button
                    key={size.value}
                    onClick={() => setCalcSize(size.value)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all
                      ${calcSize === size.value ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    style={{ minHeight: '38px' }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5 shadow-inner">
          <h3 className="text-xs font-bold text-slate-400 uppercase">Simulated Annual Benefit Projection</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs text-slate-500">Target Connections / yr</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{leads} B2B Peers</p>
              </div>
              <span className="p-2 bg-primary/10 text-primary rounded-xl">
                <Users className="w-5 h-5" />
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs text-slate-500">Estimated Business Deal-flow Value</p>
                <p className="text-xl font-black text-emerald-600 mt-0.5">RM {value.toLocaleString()}</p>
              </div>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Advocacy & Community Access</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">Full WhatsApp Walled-Garden Access</p>
              </div>
              <span className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                <Shield className="w-5 h-5" />
              </span>
            </div>
          </div>

          <button
            onClick={onRegister}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 active:scale-95"
            style={{ minHeight: '32px' }}
          >
            Claim My Profile Now
          </button>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Everything Your Business Needs</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            One membership unlocks a complete digital ecosystem — built specifically for Malaysian SMEs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.bg} ${f.border}`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MEMBERSHIP CATEGORIES ────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Membership Categories</h2>
          <p className="text-xs sm:text-sm text-slate-500">Choose the tier that fits your organization.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map(c => (
            <div
              key={c.name}
              className={`relative card p-6 flex flex-col gap-4 transition-all duration-200
                ${c.highlight ? 'border-indigo-500 shadow-lg shadow-indigo-500/5' : 'hover:border-slate-350'}`}
            >
              {c.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className={`w-4 h-4 ${c.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <h3 className={`text-sm font-bold ${c.highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{c.name}</h3>
                </div>
                <p className="text-xl font-extrabold text-slate-900 mb-2">{c.fee}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
              </div>
              <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                {['Digital membership card', 'B2B directory access', 'AGM voting rights', 'Receipt history vault'].map(b => (
                  <li key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs text-slate-650">{b}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onRegister}
                className={`mt-auto flex items-center justify-center gap-2 w-full py-1.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95
                  ${c.highlight ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                style={{ minHeight: '40px' }}
              >
                Apply Now <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">What Our Members Say</h2>
          <p className="text-xs sm:text-sm text-slate-500">Trusted by businesses across Malaysia since 1998.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
              <StarRating count={t.stars} />
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{t.name}</p>
                  <p className="text-[10px] text-slate-450">{t.company}</p>
                </div>
                <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 border border-slate-200 rounded-full">{t.sector}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE FAQ ACCORDION ──────────────────────────────── */}
      <section className="card p-6 md:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500">Answers to key operational and security queries.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  style={{ minHeight: '48px' }}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 animate-fade-in">
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center border border-primary/20 bg-primary/5">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_50%,_#263a8d_1px,_transparent_1px),_radial-gradient(circle_at_80%_20%,_#263a8d_1px,_transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)' }}>
            Ready to Elevate Your Business?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Join 209 member businesses. Complete your application online via our secured platform in under 5 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={onRegister}
              className="flex items-center gap-2 bg-primary text-white font-bold px-4 py-1.5 rounded-xl text-sm transition-all duration-200 hover:bg-primary/90 active:scale-95 shadow-md shadow-primary/20"
              style={{ minHeight: '32px' }}
            >
              Start Registration <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/60312345678"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.preventDefault()}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-xl border border-emerald-200 text-sm transition-all duration-200 hover:bg-emerald-100 active:scale-95"
              style={{ minHeight: '32px' }}
            >
              <WA_ICON /> Chat with Secretariat
            </a>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <div className="card px-3 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500 shrink-0" />
          <span><strong className="text-slate-800">DPMM</strong> · Dewan Perniagaan Melayu Malaysia</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span>📞 +603-1234 5678</span>
          <span>✉️ secretariat@dpmm.org.my</span>
        </div>
      </div>
    </div>
  );
}
