import { useState } from 'react';
import {
  Building2, User, FileText, CheckSquare,
  ChevronRight, ChevronLeft, Upload, CheckCircle2, Tag, X
} from 'lucide-react';
import { dbInstance, MALAYSIAN_STATES } from '../../data/mockData';

const STEPS = [
  { icon: Building2, label: 'Company Profile' },
  { icon: User,      label: 'Contact Rep' },
  { icon: Upload,    label: 'Documents' },
  { icon: CheckSquare, label: 'Summary' },
];

const BIZ_CATEGORIES = ['Ordinary', 'Associate', 'Life'];

function FloatInput({ label, value, onChange, type = 'text', prefix, readOnly, className = '' }) {
  return (
    <div className={`float-group ${className}`}>
      <div className="flex">
        {prefix && (
          <span className="flex items-center bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-3 text-sm text-slate-500 font-medium">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          placeholder=" "
          className={`float-input ${prefix ? 'rounded-l-none' : ''} ${readOnly ? 'opacity-70 cursor-default' : ''}`}
        />
        <label className="float-label">{label}</label>
      </div>
    </div>
  );
}

function TagInput({ tags, setTags }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setInput('');
  };
  const remove = t => setTags(tags.filter(x => x !== t));
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-2 font-bold uppercase tracking-wide">Business Type Tags</label>
      <div className="bg-white border border-slate-200 rounded-xl p-3 min-h-[3rem] flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 font-medium text-[11px] px-2.5 py-1 rounded-full">
            <Tag className="w-3 h-3" />
            {t}
            <button onClick={() => remove(t)} className="ml-0.5 hover:text-primary/70">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder={tags.length === 0 ? 'Type and press Enter…' : '+ Add more'}
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 min-w-[120px]"
        />
      </div>
    </div>
  );
}

function UploadZone({ label, uploaded, setUploaded }) {
  const [loading, setLoading] = useState(false);
  const simulate = () => {
    if (uploaded) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setUploaded(true); }, 1800);
  };
  return (
    <div
      onClick={simulate}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
        ${uploaded ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-primary/50 hover:bg-primary/5'}
      `}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-primary">Syncing with secure vault…</p>
        </div>
      ) : uploaded ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <p className="text-sm font-bold text-emerald-700">Upload Successful</p>
          <p className="text-xs font-medium text-emerald-600/80">{label}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{label}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Click or drag & drop PDF / JPG / PNG</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-1.5 border-b border-slate-200 last:border-0">
      <span className="text-xs text-slate-500 font-medium w-40 shrink-0">{label}</span>
      <span className="text-sm text-slate-800 font-medium mt-0.5 sm:mt-0">{value || '—'}</span>
    </div>
  );
}

export default function RegistrationForm({ onToast, onCancel }) {
  const [step, setStep] = useState(0);
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [ssm, setSsm] = useState('');
  const [category, setCategory] = useState('Ordinary');
  const [stateLoc, setStateLoc] = useState('Selangor');
  const [bizTags, setBizTags] = useState([]);

  const [contactName, setContactName] = useState('');
  const [ic, setIc] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [ssmUploaded, setSsmUploaded] = useState(false);
  const [icUploaded, setIcUploaded] = useState(false);

  const canNext = () => {
    if (step === 0) return companyName.trim() && ssm.trim();
    if (step === 1) return contactName.trim() && ic.trim() && email.trim() && phone.trim();
    if (step === 2) return ssmUploaded && icUploaded;
    return declared;
  };

  const handleSubmit = () => {
    const newApp = dbInstance.createPendingApplication({
      company: companyName,
      ssm,
      category,
      type: bizTags[0] || 'Trading',
      state: stateLoc,
      contact: contactName,
      ic,
      email,
      phone
    });
    setAppId(newApp.id);
    onToast({ type: 'success', title: 'Application Submitted!', message: 'Your membership application has been received and is pending admin review.' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-500 max-w-sm mx-auto">Your membership application is under review. You will receive a confirmation email within 3 working days.</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-4 text-left w-full max-w-sm">
          <p className="text-xs text-slate-500 mb-1">Application Reference</p>
          <p className="text-lg font-bold text-primary font-mono">{appId || 'APP-2026-005'}</p>
        </div>
        <button onClick={() => { setSubmitted(false); setStep(0); setDeclared(false); }} className="btn-secondary text-sm">
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-primary font-medium">Membership Registration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Join DPMM</h1>
        <p className="text-sm text-slate-500 mt-1">Complete all 4 steps to submit your application</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${i < step ? 'bg-emerald-600 border-emerald-600' : i === step ? 'bg-primary border-primary' : 'bg-transparent border-slate-300'}`}>
                {i < step ? <CheckCircle2 className="w-5 h-5 text-white" /> : <s.icon className={`w-4 h-4 ${i === step ? 'text-white' : 'text-slate-400'}`} />}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${i === step ? 'text-primary' : i < step ? 'text-emerald-600' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 rounded transition-all duration-300 ${i < step ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card p-6 animate-fade-in">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Company Profile</h2>
            <FloatInput label="Company Name (SYARIKAT)" value={companyName} onChange={setCompanyName} />
            <FloatInput label="SSM Registration Number" value={ssm} onChange={setSsm} />
            <div className="grid grid-cols-2 gap-4">
              <div className="float-group">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="float-input appearance-none"
                >
                  {BIZ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label className="float-label top-2 text-xs text-sky-400 scale-90">Business Category</label>
              </div>
              <div className="float-group">
                <select
                  value={stateLoc}
                  onChange={e => setStateLoc(e.target.value)}
                  className="float-input appearance-none"
                >
                  {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <label className="float-label top-2 text-xs text-sky-400 scale-90">State / Territory</label>
              </div>
            </div>
            <TagInput tags={bizTags} setTags={setBizTags} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Contact Representative</h2>
            <FloatInput label="Contact Person Name (PEGAWAI HUBUNGI)" value={contactName} onChange={setContactName} />
            <FloatInput label="IC Number (e.g. 900101-01-5678)" value={ic} onChange={setIc} />
            <FloatInput label="Contact Email" type="email" value={email} onChange={setEmail} />
            <FloatInput label="Mobile Number" type="tel" value={phone} onChange={setPhone} prefix="+60" />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Document Upload</h2>
            <UploadZone label="SSM Certificate" uploaded={ssmUploaded} setUploaded={setSsmUploaded} />
            <UploadZone label="Identity Card (IC)" uploaded={icUploaded} setUploaded={setIcUploaded} />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Application Summary</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <SummaryRow label="Company Name" value={companyName} />
              <SummaryRow label="SSM No." value={ssm} />
              <SummaryRow label="Category" value={category} />
              <SummaryRow label="Biz Types" value={bizTags.join(', ')} />
              <SummaryRow label="Contact Person" value={contactName} />
              <SummaryRow label="IC Number" value={ic} />
              <SummaryRow label="Email" value={email} />
              <SummaryRow label="Mobile" value={`+60${phone}`} />
              <SummaryRow label="SSM Document" value={ssmUploaded ? '✓ Uploaded' : '✗ Missing'} />
              <SummaryRow label="IC Document" value={icUploaded ? '✓ Uploaded' : '✗ Missing'} />
            </div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={declared}
                onChange={e => setDeclared(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-primary"
              />
              <span className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                I hereby declare that all information provided is true and accurate. I agree to abide by DPMM Association's constitution and by-laws.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4 gap-3">
        <button
          onClick={() => step === 0 ? onCancel && onCancel() : setStep(s => s - 1)}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canNext()}
            className="btn-primary flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-500"
          >
            <CheckSquare className="w-4 h-4" /> Submit Application
          </button>
        )}
      </div>
    </div>
  );
}
