import { useState, useMemo } from 'react';
import {
  Users, UserCheck, Clock, DollarSign, Download, Search,
  ChevronDown, ChevronUp, CheckCircle2, Mail, Phone, Building2,
  FileCheck, Eye, X, Shield, User, BarChart3, PieChart, Filter,
  TrendingUp, Briefcase, Plus, Edit, Trash2, Database, Activity, RefreshCw, AlertTriangle, Upload, Tag, FileText, ChevronRight
} from 'lucide-react';
import { dbInstance, DDL_METADATA, simulatedWebhookListener, MALAYSIAN_STATES } from '../../data/mockData';
import { read, utils } from 'xlsx';

const STATUS_FILTERS = ['All', 'Active', 'Pending', 'Lapsed'];

function KPICard({ icon: Icon, label, value, sub, color }) {
  let borderClass = "border-l-4 border-primary";
  if (color) {
    if (color.includes("emerald")) borderClass = "border-l-4 border-emerald-500";
    else if (color.includes("amber")) borderClass = "border-l-4 border-amber-500";
    else if (color.includes("accent") || color.includes("rose")) borderClass = "border-l-4 border-accent";
  }
  return (
    <div className={`card p-5 flex items-start gap-4 ${borderClass}`}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary-dark text-white">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-[10px] text-slate-450 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function DocPreview({ label, color, onView }) {
  return (
    <button
      onClick={onView}
      className="group relative w-24 h-32 rounded-xl overflow-hidden border border-slate-200 hover:border-primary transition-all duration-200 hover:scale-105 bg-white"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2 bg-slate-50/50">
        <FileCheck className="w-7 h-7" style={{ color }} />
        <p className="text-[9px] font-bold text-slate-700 text-center leading-tight">{label}</p>
      </div>
      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
        <Eye className="w-3.5 h-3.5 text-white" />
        <span className="text-[9px] text-white font-bold">View</span>
      </div>
    </button>
  );
}

function DocModal({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4.5 h-4.5 text-primary" />
            <span className="text-xs font-bold text-slate-800">{doc.label}</span>
          </div>
          <button onClick={onClose} className="text-slate-450 hover:text-slate-650 p-1 border rounded-lg hover:bg-slate-50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div
          className="h-60 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${doc.color}15, ${doc.color}05)` }}
        >
          <div className="text-center flex flex-col items-center gap-3">
            <FileCheck className="w-16 h-16 opacity-30" style={{ color: doc.color }} />
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-1.5 shadow-sm">
              <p className="text-[9px] text-slate-400 font-bold uppercase">Compliance Preview</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{doc.label}</p>
              <p className="text-[9px] text-slate-500 mt-1">Legitimacy verification certified</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 flex justify-between items-center border-t border-slate-100 bg-slate-50/50">
          <span className="text-[10px] text-slate-450 font-bold uppercase">SSL Verified Link</span>
          <button className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-1">
            <Download className="w-3 h-3" /> Download Attachment
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingCard({ applicant, onApprove }) {
  const [open, setOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  return (
    <>
      {previewDoc && <DocModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
      <div className="card overflow-hidden transition-all duration-300 bg-white">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
          style={{ minHeight: '36px' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{applicant.company}</p>
              <p className="text-[10px] text-slate-450">{applicant.id} · Submitted: {applicant.submittedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-pending">Pending</span>
            {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {open && (
          <div className="border-t border-slate-100 p-4 pb-8 bg-slate-50/30 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">Category: <strong className="text-slate-800">{applicant.category}</strong> · {applicant.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 font-mono">SSM: <strong className="text-slate-850">{applicant.ssm}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600">Rep: <strong className="text-slate-800">{applicant.contact}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 truncate">{applicant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-600 font-mono">+{applicant.phone}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Registration Documents Submitted</p>
              <div className="flex gap-3 flex-wrap">
                {applicant.docs.map(d => (
                  <DocPreview key={d.label} label={d.label} color={d.color} onView={() => setPreviewDoc(d)} />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onApprove(applicant)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-sm"
                style={{ minHeight: '36px' }}
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Registration
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold px-4 py-1.5 rounded-xl transition-all duration-200 active:scale-95 border border-slate-200" style={{ minHeight: '36px' }}>
                Reject Application
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Credentials notification modal for verified users
function WelcomeCredentialsModal({ credentials, onClose }) {
  if (!credentials) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative animate-scale-in text-center space-y-5">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-250 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        
        <div>
          <h3 className="text-base font-bold text-slate-900">Membership Verified Successfully</h3>
          <p className="text-xs text-slate-500 mt-1">Incremental Member No. allocated & credentials generated.</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-450 font-medium">Member No. (Membership ID):</span>
            <span className="font-mono font-bold text-primary">{credentials.member_id}</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2.5">
            <span className="text-slate-450 font-medium">Username / Login Email:</span>
            <span className="font-bold text-slate-800">{credentials.email}</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2.5">
            <span className="text-slate-450 font-medium">Temporary Password:</span>
            <span className="font-mono font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-800">{credentials.password}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 items-start text-left">
          <Shield className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-650 leading-relaxed font-semibold">
            In compliance with PDPA guidelines, this temporary password must be changed immediately by the member upon first login.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-accent hover:bg-accent-dark text-white text-xs font-bold py-1.5 rounded-xl uppercase tracking-wider transition-all duration-200 active:scale-95"
          style={{ minHeight: '40px' }}
        >
          Confirm Approval
        </button>
      </div>
    </div>
  );
}

// Edit Member Modal
function EditMemberModal({ member, onClose, onSave }) {
  const [company, setCompany] = useState(member?.company || '');
  const [ssm, setSsm] = useState(member?.ssm_no || '');
  const [contact, setContact] = useState(member?.contact || '');
  const [email, setEmail] = useState(member?.email || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [category, setCategory] = useState(member?.category || 'Ordinary');
  const [type, setType] = useState(member?.type || 'Trading');
  const [status, setStatus] = useState(member?.status || 'Active');
  const [stateLoc, setStateLoc] = useState(member?.state || 'Selangor');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...member,
      company,
      ssm_no: ssm,
      contact,
      email,
      phone,
      category,
      type,
      status,
      state: stateLoc
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xs font-bold border rounded-lg p-1.5">
          ✕
        </button>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Edit className="w-4 h-4 text-primary" /> Edit Member Profile
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Name</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SSM Registration</label>
            <input type="text" value={ssm} onChange={e => setSsm(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Person</label>
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Mobile</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none">
              <option value="Ordinary">Ordinary</option>
              <option value="Associate">Associate</option>
              <option value="Life">Life</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">State / Territory</label>
            <select value={stateLoc} onChange={e => setStateLoc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none">
              {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none">
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Lapsed">Lapsed</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs font-bold py-1.5 rounded-xl transition-all duration-200 active:scale-95 uppercase tracking-wider">
            Save Modifications
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-1.5 rounded-xl border transition-all duration-200 active:scale-95 uppercase tracking-wider">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Add New Member Modal
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
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Type Tags</label>
      <div className="bg-white border border-slate-200 rounded-xl p-2 min-h-[38px] flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 font-medium text-[10px] px-2 py-0.5 rounded-md">
            <Tag className="w-2.5 h-2.5" />
            {t}
            <button type="button" onClick={() => remove(t)} className="ml-0.5 hover:text-primary/70">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder={tags.length === 0 ? 'Type & Enter' : '+ Add more'}
          className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1 min-w-[80px]"
        />
      </div>
    </div>
  );
}

function AddMemberModal({ onClose, onSave }) {
  const [company, setCompany] = useState('');
  const [ssm, setSsm] = useState('');
  const [contact, setContact] = useState('');
  const [ic, setIc] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Ordinary');
  const [stateLoc, setStateLoc] = useState('Selangor');
  const [bizTags, setBizTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      company_name: company,
      ssm_no: ssm,
      contact_person: contact,
      ic,
      email,
      phone_mobile: phone,
      category,
      business_type: bizTags[0] || 'Trading',
      state: stateLoc,
      status: 'Active'
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 text-xs font-bold border rounded-lg p-1.5">
          ✕
        </button>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" /> Add New Member Profile
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Name (Syarikat)</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} required placeholder="e.g. Company Maju Sdn Bhd" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SSM Registration</label>
            <input type="text" value={ssm} onChange={e => setSsm(e.target.value)} required placeholder="e.g. 202601998877" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Business Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none">
              <option value="Ordinary">Ordinary</option>
              <option value="Associate">Associate</option>
              <option value="Life">Life</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">State / Territory</label>
            <select value={stateLoc} onChange={e => setStateLoc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none">
              {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <TagInput tags={bizTags} setTags={setBizTags} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Person</label>
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} required placeholder="e.g. Mohd Fauzi" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">IC Number</label>
            <input type="text" value={ic} onChange={e => setIc(e.target.value)} required placeholder="e.g. 900101-01-5678" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="e.g. fauzi@company.my" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Number</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="e.g. 0123456789" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs font-bold py-1.5 rounded-xl transition-all duration-200 active:scale-95 uppercase tracking-wider">
            Register Member
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold py-1.5 rounded-xl border transition-all duration-200 active:scale-95 uppercase tracking-wider">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Bulk Upload Modal
function BulkUploadModal({ onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = utils.sheet_to_json(ws);
      setPreview(data);
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleImport = async () => {
    setProcessing(true);
    // Process records
    await new Promise(r => setTimeout(r, 500)); // fake delay for UX
    onImport(preview);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl relative flex flex-col max-h-[90vh]">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 text-xs font-bold border rounded-lg p-1.5">
          ✕
        </button>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4 shrink-0">
          <Upload className="w-4 h-4 text-primary" /> Bulk Upload Members
        </h3>

        {!file ? (
          <div className="flex-1 min-h-[200px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 relative hover:bg-slate-100 transition-colors">
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              onChange={handleFileUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-700">Click or drag file to upload</p>
            <p className="text-[10px] text-slate-500 mt-1">Supports .xlsx, .xls, .csv</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs font-bold text-slate-800">{file.name}</p>
                <p className="text-[10px] text-slate-500">{preview.length} records found</p>
              </div>
              <button 
                onClick={() => { setFile(null); setPreview([]); }} 
                className="text-[10px] text-rose-500 hover:text-rose-600 font-bold underline"
              >
                Change File
              </button>
            </div>
            
            <div className="flex-1 overflow-auto border border-slate-200 rounded-xl mb-4">
              <table className="w-full text-[10px]">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-600 uppercase">Company</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-600 uppercase">SSM No</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-600 uppercase">Contact</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-600 uppercase">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-1.5 truncate max-w-[120px]">{row['Company Name'] || row.Company || row.company_name || 'N/A'}</td>
                      <td className="px-3 py-1.5">{row['SSM No'] || row.SSM || row.ssm_no || 'N/A'}</td>
                      <td className="px-3 py-1.5">{row['Contact Person'] || row.Contact || row.contact_person || 'N/A'}</td>
                      <td className="px-3 py-1.5">{row.Category || row.category || 'N/A'}</td>
                    </tr>
                  ))}
                  {preview.length > 10 && (
                    <tr>
                      <td colSpan="4" className="px-3 py-2 text-center text-slate-400 bg-slate-50/50">
                        ...and {preview.length - 10} more records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 shrink-0">
              <button 
                onClick={handleImport} 
                disabled={processing || preview.length === 0}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-xs font-bold py-2 rounded-xl transition-all duration-200 active:scale-95 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {processing ? 'Processing...' : 'Confirm Import'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard({ onToast }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pending, setPending] = useState(dbInstance.pendingQueue);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  
  // Re-read from relational dbInstance dynamically to allow updates
  const [membersList, setMembersList] = useState(dbInstance.members.map(m => ({
    id: m.member_id,
    company: m.company_name,
    category: m.category,
    type: m.business_type,
    state: m.state,
    status: m.status,
    fee: m.status === 'Active' ? (m.category === 'Life' ? 1000 : 100) : 0,
    year: parseInt(m.expiry_date.split('-')[0]) || 2026,
    contact: m.contact_person,
    phone: m.phone_mobile.replace('+', ''),
    ssm_no: m.ssm_no
  })));

  // Relational payments database state
  const [paymentsList, setPaymentsList] = useState(dbInstance.payments);

  // Modals state
  const [credentialsPopup, setCredentialsPopup] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Webhook Simulation Sandbox panel states
  const [webhookMemberId, setWebhookMemberId] = useState('AG-2026-0008');
  const [webhookAmount, setWebhookAmount] = useState('100.00');
  const [webhookYear, setWebhookYear] = useState('2026');
  const [webhookProcessing, setWebhookProcessing] = useState(false);

  // Manual payment override states
  const [overrideMember, setOverrideMember] = useState('');
  const [overrideYear, setOverrideYear] = useState('2026');
  const [overrideMethod, setOverrideMethod] = useState('Bank Transfer');
  const [overrideAmount, setOverrideAmount] = useState('100.00');

  // Report filters
  const [reportCategory, setReportCategory] = useState('All');
  const [reportStatus, setReportStatus] = useState('All');
  const [reportSector, setReportSector] = useState('All');

  // Sync back local state with mock database
  const refreshLocalState = () => {
    setMembersList(dbInstance.members.map(m => ({
      id: m.member_id,
      company: m.company_name,
      category: m.category,
      type: m.business_type,
      state: m.state,
      status: m.status,
      fee: m.status === 'Active' ? (m.category === 'Life' ? 1000 : 100) : 0,
      year: parseInt(m.expiry_date.split('-')[0]) || 2026,
      contact: m.contact_person,
      phone: m.phone_mobile.replace('+', ''),
      ssm_no: m.ssm_no
    })));
    setPaymentsList([...dbInstance.payments]);
  };

  const activeCount  = membersList.filter(m => m.status === 'Active').length;
  const pendingCount = pending.length;
  const totalFees    = paymentsList.reduce((s, p) => s + p.amount_rm, 0);

  // Dynamic industry list for reports
  const sectorsList = useMemo(() => {
    const list = new Set(membersList.map(m => m.type));
    return ['All', ...Array.from(list).sort()];
  }, [membersList]);

  const allRecords = useMemo(() => {
    const pendingAsMembers = pending.map(p => ({
      id: p.id,
      company: p.company,
      ssm_no: p.ssm,
      category: p.category || 'Ordinary',
      type: p.type || '',
      state: p.state || 'Selangor',
      contact: p.contact,
      phone: p.phone || '',
      status: 'Pending',
      fee: 0,
      year: new Date().getFullYear(),
    }));
    return [...membersList, ...pendingAsMembers];
  }, [membersList, pending]);

  // Main Directory filtered list
  const filtered = useMemo(() => {
    return allRecords.filter(m => {
      const matchSearch = m.company.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'All' || m.status === filter;
      return matchSearch && matchFilter;
    });
  }, [allRecords, search, filter]);

  // Report Module filtered list
  const reportFiltered = useMemo(() => {
    return allRecords.filter(m => {
      const matchCat = reportCategory === 'All' || m.category === reportCategory;
      const matchStatus = reportStatus === 'All' || m.status === reportStatus;
      const matchSector = reportSector === 'All' || m.type === reportSector;
      return matchCat && matchStatus && matchSector;
    });
  }, [allRecords, reportCategory, reportStatus, reportSector]);

  // Report Stats Calculation
  const reportStats = useMemo(() => {
    const total = reportFiltered.length;
    const active = reportFiltered.filter(m => m.status === 'Active').length;
    const pendingCount = reportFiltered.filter(m => m.status === 'Pending').length;
    const lapsed = reportFiltered.filter(m => m.status === 'Lapsed').length;
    
    // Sum matching payments
    const matchIds = reportFiltered.map(m => m.id);
    const fees = paymentsList
      .filter(p => matchIds.includes(p.member_id))
      .reduce((sum, p) => sum + p.amount_rm, 0);
      
    const expectedFees = reportFiltered.reduce((sum, m) => sum + (m.category === 'Life' ? 1000 : 100), 0);
    const outstanding = expectedFees - fees;
    const complianceRate = total > 0 ? Math.round((active / total) * 100) : 0;
    
    const ordCount = reportFiltered.filter(m => m.category === 'Ordinary').length;
    const assocCount = reportFiltered.filter(m => m.category === 'Associate').length;
    const lifeCount = reportFiltered.filter(m => m.category === 'Life').length;
    
    const sectorMap = {};
    reportFiltered.forEach(m => {
      sectorMap[m.type] = (sectorMap[m.type] || 0) + 1;
    });
    const topSectors = Object.entries(sectorMap)
      .map(([name, count]) => ({
        name,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      active,
      pending: pendingCount,
      lapsed,
      fees,
      outstanding,
      expectedFees,
      complianceRate,
      categories: {
        Ordinary: { count: ordCount, percent: total > 0 ? Math.round((ordCount / total) * 100) : 0 },
        Associate: { count: assocCount, percent: total > 0 ? Math.round((assocCount / total) * 100) : 0 },
        Life: { count: lifeCount, percent: total > 0 ? Math.round((lifeCount / total) * 100) : 0 },
      },
      topSectors
    };
  }, [reportFiltered, paymentsList]);

  // One-click verify pending applicant
  const approve = applicant => {
    // 1. Create in relational dbInstance
    const addedMember = dbInstance.createMember({
      company: applicant.company,
      ssm_no: applicant.ssm,
      contact: applicant.contact,
      email: applicant.email,
      phone: applicant.phone,
      category: applicant.category,
      type: applicant.type,
      address: 'Suite ' + applicant.id + ', Kuala Lumpur',
      status: 'Active',
      expiry_date: '2026-12-31'
    });

    // 2. Generate initial payment log
    dbInstance.createPayment({
      member_id: addedMember.member_id,
      subscription_year: '2026',
      amount_rm: addedMember.category === 'Life' ? 1000.00 : 100.00,
      payment_status: 'SUCCESS'
    });

    // 3. Remove from pending visual queue
    setPending(p => p.filter(a => a.id !== applicant.id));
    refreshLocalState();

    // 4. Open Welcome popup with login credentials details
    setCredentialsPopup({
      member_id: addedMember.member_id,
      email: addedMember.email,
      password: 'SSM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + addedMember.member_id.split('-')[2]
    });

    onToast({
      type: 'success',
      title: 'Membership Approved!',
      message: `Applicant verified. Incremental ID ${addedMember.member_id} allocated.`
    });
  };

  // CRUD member updates
  const handleEditSave = (updatedFields) => {
    dbInstance.updateMember(updatedFields.id, {
      company_name: updatedFields.company,
      ssm_no: updatedFields.ssm_no,
      contact_person: updatedFields.contact,
      email: updatedFields.email,
      phone_mobile: updatedFields.phone,
      category: updatedFields.category,
      business_type: updatedFields.type,
      state: updatedFields.state,
      status: updatedFields.status
    });
    setEditTarget(null);
    refreshLocalState();
    onToast({ type: 'success', title: 'Profile Updated', message: `Modifications synchronized with Supabase.` });
  };

  const handleDeleteMember = (id) => {
    if (window.confirm(`Are you sure you want to permanently delete member ${id} from Supabase database tables?`)) {
      dbInstance.deleteMember(id);
      refreshLocalState();
      onToast({ type: 'error', title: 'Member Deleted', message: `Profile and related ledger logs removed.` });
    }
  };

  const handleAddNewMember = (fields) => {
    const created = dbInstance.createMember(fields);
    // Create initial payment
    dbInstance.createPayment({
      member_id: created.member_id,
      subscription_year: '2026',
      amount_rm: created.category === 'Life' ? 1000.00 : 100.00,
      payment_status: 'SUCCESS'
    });
    setShowAddModal(false);
    refreshLocalState();
    onToast({ type: 'success', title: 'Member Profile Created', message: `Member No. allocated: ${created.member_id}` });
  };

  const handleBulkImport = (records) => {
    let successCount = 0;
    records.forEach(row => {
      // Create Member
      const created = dbInstance.createMember({
        company_name: row['Company Name'] || row.Company || row.company_name || 'Unknown Company',
        ssm_no: row['SSM No'] || row.SSM || row.ssm_no || `SSM-UNKNOWN-${Math.floor(Math.random()*10000)}`,
        contact_person: row['Contact Person'] || row.Contact || row.contact_person || 'Unknown Contact',
        email: row.Email || row.email || `contact@${Math.floor(Math.random()*10000)}.com`,
        phone_mobile: row.Phone || row.phone || row.phone_mobile || '0123456789',
        category: row.Category || row.category || 'Ordinary',
        business_type: row['Business Type'] || row.Type || row.type || row.business_type || 'Trading',
        status: row.Status || row.status || 'Active'
      });

      // Create Payment
      const amt = parseFloat(row['Amount RM'] || row.Amount || row.amount || (created.category === 'Life' ? 1000 : 100));
      const year = row['Subscription Year'] || row.Year || row.year || '2026';
      
      dbInstance.createPayment({
        member_id: created.member_id,
        subscription_year: String(year),
        amount_rm: amt,
        payment_status: 'SUCCESS'
      });
      successCount++;
    });

    setShowBulkUpload(false);
    refreshLocalState();
    onToast({ type: 'success', title: 'Bulk Import Successful', message: `Imported ${successCount} members and recorded their payments.` });
  };

  // Webhook listener simulation trigger
  const triggerSimulatedWebhook = () => {
    setWebhookProcessing(true);
    setTimeout(() => {
      const response = simulatedWebhookListener({
        event: 'charge.successful',
        data: {
          member_id: webhookMemberId,
          amount_rm: parseFloat(webhookAmount),
          subscription_year: webhookYear,
          gateway_transaction_id: `TXN-WEBHOOK-${Date.now()}`
        }
      });
      setWebhookProcessing(false);
      if (response.success) {
        refreshLocalState();
        onToast({
          type: 'success',
          title: 'charge.successful Webhook Fired',
          message: `Member ${webhookMemberId} status switched to Active. Validity extended.`
        });
      } else {
        onToast({ type: 'error', title: 'Webhook Failed', message: response.error });
      }
    }, 1500);
  };

  // Manual payment override override submission
  const handleOfflineOverride = (e) => {
    e.preventDefault();
    if (!overrideMember) {
      onToast({ type: 'error', title: 'Selection Missing', message: 'Please select a member to record the payment override.' });
      return;
    }

    dbInstance.createPayment({
      member_id: overrideMember,
      subscription_year: overrideYear,
      payment_date: new Date().toISOString().split('T')[0],
      amount_rm: parseFloat(overrideAmount),
      gateway_transaction_id: `TXN-OVERRIDE-RCP-${Date.now()}`,
      payment_status: 'SUCCESS'
    });

    refreshLocalState();
    setOverrideMember('');
    onToast({
      type: 'success',
      title: 'Offline Override Recorded',
      message: `Recorded ${overrideMethod} payment. Expiry updated to 31 Dec ${overrideYear}.`
    });
  };

  const handleExport = () => {
    exportCSV(membersList);
    onToast({ type: 'info', title: 'Export Ready', message: 'Member registry exported as SSM_Members_AGM.csv' });
  };

  const handleExportReport = () => {
    const header = 'Member No.,Company,Category,Type,Status,Fee (RM),Year,Contact,Phone';
    const rows = reportFiltered.map(m =>
      `${m.id},"${m.company}",${m.category},${m.type},${m.status},${m.fee},${m.year},"${m.contact}",+${m.phone}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SSM_Report_${reportCategory}_${reportStatus}_${reportSector}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast({ type: 'success', title: 'Report Exported', message: `Exported ${reportFiltered.length} records to CSV.` });
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onToast({ type: 'error', title: 'Pop-up Blocked', message: 'Please allow pop-ups to export the PDF report.' });
      return;
    }

    const today = new Date().toLocaleDateString('ms-MY', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const rowsHTML = reportFiltered.map(m => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 8px; font-family: monospace;">${m.id}</td>
        <td style="padding: 10px 8px; font-weight: 600; color: #0f172a;">${m.company}</td>
        <td style="padding: 10px 8px; color: #475569;">${m.type}</td>
        <td style="padding: 10px 8px; color: #475569;">${m.category}</td>
        <td style="padding: 10px 8px; color: #475569;">${m.contact}</td>
        <td style="padding: 10px 8px;">
          <span style="
            display: inline-block;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 700;
            ${m.status === 'Active' ? 'background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0;' : m.status === 'Pending' ? 'background: #fffbeb; color: #b45309; border: 1px solid #fde68a;' : 'background: #fff1f2; color: #be123c; border: 1px solid #fecdd3;'}
          ">${m.status}</span>
        </td>
      </tr>
    `).join('');

    const sectorsHTML = reportStats.topSectors.map(s => `
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; color: #334155; font-weight: 500;">
          <span>${s.name}</span>
          <span style="font-weight: 700; color: #1e293b;">${s.count} (${s.percent}%)</span>
        </div>
        <div style="background: #e2e8f0; border-radius: 9999px; height: 8px; overflow: hidden;">
          <div style="background: #6366f1; height: 100%; border-radius: 9999px; width: ${s.percent}%;"></div>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>SSM Association Membership Report</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: sans-serif; color: #1e293b; padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .logo { font-size: 20px; font-weight: bold; }
            .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 30px 0; }
            .kpi-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; background: #f8fafc; }
            .kpi-label { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; }
            .kpi-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { border-bottom: 2px solid #e2e8f0; padding: 10px; text-align: left; }
            td { border-bottom: 1px solid #e2e8f0; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SSM Association Registry</div>
            <div>Generated: ${today}</div>
          </div>
          <h2>Membership Analytics Report</h2>
          <div class="kpis">
            <div class="kpi-card"><p class="kpi-label">Members</p><p class="kpi-value">${reportStats.total}</p></div>
            <div class="kpi-card"><p class="kpi-label">Revenue</p><p class="kpi-value">RM ${reportStats.fees}</p></div>
            <div class="kpi-card"><p class="kpi-label">Outstanding</p><p class="kpi-value">RM ${reportStats.outstanding}</p></div>
            <div class="kpi-card"><p class="kpi-label">Compliance</p><p class="kpi-value">${reportStats.complianceRate}%</p></div>
          </div>
          <table>
            <thead><tr><th>Member No.</th><th>Company</th><th>Type</th><th>Category</th><th>Contact</th><th>Status</th></tr></thead>
            <tbody>${rowsHTML}</tbody>
          </table>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    onToast({ type: 'info', title: 'PDF Export Ready', message: 'Print window triggered. Save as PDF natively.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Dynamic Popups */}
      <WelcomeCredentialsModal credentials={credentialsPopup} onClose={() => setCredentialsPopup(null)} />
      {editTarget && <EditMemberModal member={editTarget} onClose={() => setEditTarget(null)} onSave={handleEditSave} />}
      {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} onSave={handleAddNewMember} />}
      {showBulkUpload && <BulkUploadModal onClose={() => setShowBulkUpload(false)} onImport={handleBulkImport} />}

      {/* ── DEMONSTRATION PURPOSE ONLY ── */}
      <section className="bg-amber-50 border border-amber-250 rounded-2xl p-4.5 flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-amber-800">Demonstration Purpose Only</p>
          <p className="text-[11px] text-amber-650 mt-0.5 leading-relaxed font-medium">
            This admin workspace simulates an active database registry. All actions, data synchronization, and imports are executed locally for mockup demonstration.
          </p>
        </div>
      </section>

      {/* Tab Switcher */}
      <div className="flex gap-1.5 bg-slate-100 border border-slate-200 rounded-xl p-1 overflow-x-auto whitespace-nowrap scrollbar-thin shadow-inner">
        {[
          { id: 'dashboard', label: 'Management Dashboard', icon: Shield },
          { id: 'ledger', label: 'Financial Ledger & Override', icon: DollarSign },
          { id: 'reports', label: 'Report Module & Analytics', icon: BarChart3 },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[180px] sm:min-w-0 shrink-0 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200
                ${active ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary hover:bg-slate-50'}`}
              style={{ minHeight: '38px' }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* flex-col on mobile, grid on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard icon={Users}      label="Total Members"        value={membersList.length} sub="As of AGM 2026" color="bg-primary/5 text-primary" />
            <KPICard icon={UserCheck}  label="Active (Active)"       value={activeCount}    sub="Paid up"        color="bg-emerald-50 text-emerald-600" />
            <KPICard icon={Clock}      label="Pending Verification" value={pendingCount}   sub="Awaiting review" color="bg-amber-50 text-amber-600" />
            <KPICard icon={DollarSign} label="Total Fees Collected" value={`RM ${totalFees.toLocaleString()}`} sub="FY 2026" color="bg-accent/5 text-accent" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Verification Queue */}
            <div className="xl:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Registration & Verification Queue</h2>
                <span className="badge-pending">{pending.length} waiting</span>
              </div>
              {pending.length === 0 ? (
                <div className="card p-10 text-center bg-white border border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-800">All applications verified!</p>
                  <p className="text-xs text-slate-400 mt-1">Pending queue is empty</p>
                </div>
              ) : (
                pending.map(a => <PendingCard key={a.id} applicant={a} onApprove={approve} />)
              )}
            </div>

            {/* Global Directory Grid */}
            <div className="xl:col-span-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h2 className="text-sm font-semibold text-slate-800">Global Membership Registry</h2>
                <div className="flex gap-2 sm:ml-auto">
                  <button
                    onClick={() => setShowBulkUpload(true)}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <Upload className="w-4 h-4" /> Bulk Upload
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Member
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-650 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search company name, ssm no, or member ID…"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-450 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 flex-wrap">
                {STATUS_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border
                      ${filter === f
                        ? 'bg-accent border-accent text-white shadow-sm hover:bg-accent-dark hover:border-accent-dark'
                        : 'bg-white border-slate-200 text-slate-550 hover:border-slate-350'}`}
                  >
                    {f} {f === 'All' ? `(${allRecords.length})` : f === 'Active' ? `(${activeCount})` : f === 'Lapsed' ? `(${membersList.filter(m=>m.status==='Lapsed').length})` : `(${pendingCount})`}
                  </button>
                ))}
              </div>

              {/* Registry Table */}
              <div className="card overflow-hidden bg-white border border-slate-200 border-t-2 border-t-primary">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-primary/5 text-primary font-bold">
                        <th className="text-left px-4 py-1.5 font-semibold">Member No.</th>
                        <th className="text-left px-4 py-1.5 font-semibold">Company Name</th>
                        <th className="text-left px-4 py-1.5 font-semibold hidden sm:table-cell">SSM No</th>
                        <th className="text-left px-4 py-1.5 font-semibold hidden lg:table-cell">State</th>
                        <th className="text-left px-4 py-1.5 font-semibold hidden md:table-cell">Rep Contact</th>
                        <th className="text-left px-4 py-1.5 font-semibold">Status</th>
                        <th className="text-right px-4 py-1.5 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0, 15).map((m, i) => (
                        <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-1.5 font-mono text-primary font-bold">{m.id}</td>
                          <td className="px-4 py-1.5 text-slate-800 font-bold max-w-[140px] truncate">{m.company}</td>
                          <td className="px-4 py-1.5 text-slate-500 font-mono hidden sm:table-cell">{m.ssm_no}</td>
                          <td className="px-4 py-1.5 text-slate-500 hidden lg:table-cell">{m.state}</td>
                          <td className="px-4 py-1.5 text-slate-500 hidden md:table-cell">{m.contact}</td>
                          <td className="px-4 py-1.5">
                            <span className={m.status === 'Active' ? 'badge-active' : m.status === 'Pending' ? 'badge-pending' : 'badge-lapsed'}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-4 py-1.5 text-right flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditTarget(m)}
                              className="p-1.5 bg-slate-100 border border-slate-200 hover:border-primary rounded-lg text-slate-600 hover:text-primary"
                              title="Edit Profile"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-1.5 bg-rose-50 border border-rose-100 hover:border-rose-300 rounded-lg text-rose-500 hover:text-rose-600"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-slate-400">No member records match the search parameters.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {filtered.length > 15 && (
                  <div className="px-4 py-1.5 border-t border-slate-200 bg-slate-50/50">
                    <p className="text-[10px] text-slate-500">
                      Showing top 15 of {filtered.length} total members. Apply search filtering to locate specific profiles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 animate-fade-in">
          
          {/* Offline Override Facility Form */}
          <div className="xl:col-span-2 space-y-4">
            <div className="card p-5 space-y-4 border-t-2 border-t-accent">
              <div>
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                  <DollarSign className="w-4.5 h-4.5 text-primary/80" /> Offline Payment Override
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                  Log offline transactions (cash/cheque) directly. Fills database tables, shifts memberships to "Active", and extends validation periods.
                </p>
              </div>

              <form onSubmit={handleOfflineOverride} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Select Member Account</label>
                  <select
                    value={overrideMember}
                    onChange={e => setOverrideMember(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  >
                    <option value="">-- Choose Member Profile --</option>
                    {membersList.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.company} ({m.id}) - {m.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Renewal Year</label>
                    <select
                      value={overrideYear}
                      onChange={e => setOverrideYear(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Payment Method</label>
                    <select
                      value={overrideMethod}
                      onChange={e => setOverrideMethod(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque / Cek">Cheque / Cek</option>
                      <option value="Cash / Tunai">Cash / Tunai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Override Amount (RM)</label>
                  <input
                    type="number"
                    value={overrideAmount}
                    onChange={e => setOverrideAmount(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm"
                  style={{ minHeight: '40px' }}
                >
                  Apply Override & Renew
                </button>
              </form>
            </div>

            {/* Simulated Webhook Trigger Console */}
            <div className="card p-5 bg-slate-900 border border-slate-800 text-white space-y-4 border-t-2 border-t-accent">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-accent flex items-center gap-2 uppercase tracking-wider">
                    <Database className="w-4.5 h-4.5" /> Webhook Gateway Simulator
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-full border border-emerald-500/30 font-mono">LISTENING</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-1.5">
                  Simulate incoming ToyyibPay/Billplz payment gateway callback. Triggers backend callback listener `charge.successful` to sync active members.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target member_id</label>
                  <select
                    value={webhookMemberId}
                    onChange={e => setWebhookMemberId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  >
                    {membersList.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.company} ({m.id}) - {m.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount (RM)</label>
                    <input
                      type="text"
                      value={webhookAmount}
                      onChange={e => setWebhookAmount(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subscription Year</label>
                    <input
                      type="text"
                      value={webhookYear}
                      onChange={e => setWebhookYear(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={triggerSimulatedWebhook}
                  disabled={webhookProcessing}
                  className="w-full bg-primary/90 hover:bg-primary disabled:opacity-40 text-white font-bold py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                  style={{ minHeight: '38px' }}
                >
                  {webhookProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Firing Callback payload…
                    </>
                  ) : (
                    <>
                      Fire charge.successful Event
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Financial Transactions Ledger */}
          <div className="xl:col-span-3 space-y-3">
            <h2 className="text-sm font-semibold text-slate-800">Financial Ledger logs ({paymentsList.length} records)</h2>
            
            <div className="card overflow-hidden bg-white border border-slate-200 border-t-2 border-t-primary">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-primary/5 text-primary font-bold">
                      <th className="text-left px-4 py-1.5 font-semibold">Payment ID</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Member</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Year</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Date</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Transaction ID</th>
                      <th className="text-right px-4 py-1.5 font-semibold">Amount RM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList.slice(0, 15).map((p, i) => {
                      const memb = membersList.find(m => m.id === p.member_id);
                      return (
                        <tr key={p.payment_id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-1.5 font-mono text-slate-500 text-[10px]">{p.payment_id.slice(0, 16)}…</td>
                          <td className="px-4 py-1.5 text-slate-800 font-bold max-w-[120px] truncate">{memb ? memb.company : p.member_id}</td>
                          <td className="px-4 py-1.5 text-slate-500 font-bold">{p.subscription_year}</td>
                          <td className="px-4 py-1.5 text-slate-400 font-mono text-[10px]">{p.payment_date}</td>
                          <td className="px-4 py-1.5 text-slate-500 font-mono text-[10px]">{p.gateway_transaction_id.slice(0,18)}…</td>
                          <td className="px-4 py-1.5 text-right font-bold text-emerald-600">RM {p.amount_rm.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-1.5 border-t border-slate-200 bg-slate-50/50">
                <p className="text-[10px] text-slate-500">
                  Showing top 15 ledger logs. All renewal fees paid through toyibPay/Billplz callbacks synchronize immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fade-in">
          {/* Report Title & Header */}
          <div className="card p-5 relative overflow-hidden bg-white border border-slate-200 border-t-2 border-t-accent">
            <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at top right, #e42b40, transparent 70%)' }} />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary/80" /> Report Generator & Analytics
                </h2>
                <p className="text-xs text-slate-500 font-medium">Generate compliance summaries, filter sector groups, and export subsets.</p>
              </div>
              <div className="flex gap-2 flex-wrap shrink-0">
                <button
                  onClick={handleExportReport}
                  disabled={reportFiltered.length === 0}
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all duration-200 active:scale-95"
                  style={{ minHeight: '38px' }}
                >
                  <Download className="w-4 h-4" /> Export CSV ({reportFiltered.length})
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={reportFiltered.length === 0}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-xl transition-all duration-200 active:scale-95"
                  style={{ minHeight: '38px' }}
                >
                  <FileText className="w-4 h-4 text-primary/80" /> Print PDF Report
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Filters Grid */}
          <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 border-t-2 border-t-primary">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Category
              </label>
              <select
                value={reportCategory}
                onChange={e => setReportCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-primary"
              >
                <option value="All">All Categories ({membersList.length})</option>
                <option value="Ordinary">Ordinary</option>
                <option value="Associate">Associate</option>
                <option value="Life">Life</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Status
              </label>
              <select
                value={reportStatus}
                onChange={e => setReportStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-primary"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Lapsed">Lapsed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Industry Sector
              </label>
              <select
                value={reportSector}
                onChange={e => setReportSector(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-primary"
              >
                {sectorsList.map(sec => (
                  <option key={sec} value={sec}>
                    {sec === 'All' ? 'All Sectors' : sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Report KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard icon={Users}      label="Matched Members"      value={reportStats.total} sub="Matching filters" color="bg-primary/5 text-primary" />
            <KPICard icon={DollarSign} label="Revenue Collected"    value={`RM ${reportStats.fees.toLocaleString()}`} sub="From matching payments" color="bg-emerald-50 text-emerald-600" />
            <KPICard icon={Clock}      label="Outstanding Dues"     value={`RM ${reportStats.outstanding.toLocaleString()}`} sub="Remaining outstanding" color="bg-rose-50 text-rose-600" />
            <KPICard icon={TrendingUp} label="Compliance Rate"      value={`${reportStats.complianceRate}%`} sub="Paid status fraction" color="bg-primary/5 text-primary" />
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Category distribution */}
            <div className="card p-5 space-y-4 bg-white border border-slate-200 border-t-2 border-t-primary">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wide flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary/80" /> Category Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(reportStats.categories).map(([catName, data]) => (
                  <div key={catName} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">{catName} Members</span>
                      <span className="text-slate-800 font-bold">{data.count} ({data.percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          catName === 'Ordinary' ? 'bg-primary' : catName === 'Associate' ? 'bg-accent/90' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${data.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector representation */}
            <div className="card p-5 space-y-4 bg-white border border-slate-200 border-t-2 border-t-primary">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wide flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary/80" /> Top Industry Representation
              </h3>
              <div className="space-y-3">
                {reportStats.topSectors.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No industry sectors match filters</p>
                ) : (
                  reportStats.topSectors.map(s => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 truncate max-w-[150px]">{s.name}</span>
                        <span className="text-slate-800 font-bold">{s.count} ({s.percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${s.percent}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SQL DDL Schema Viewer */}
            <div className="card p-5 space-y-4 bg-white border border-slate-200 border-t-2 border-t-accent">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wide flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-primary/80" /> Supabase Database Schema Console
              </h3>
              <p className="text-[10px] text-slate-500 leading-normal">
                Review verified Postgres database structures and RLS rules integrated with this Progressive Web App.
              </p>
              
              <div className="space-y-2.5 pt-1.5">
                <button
                  onClick={() => {
                    const win = window.open('', '_blank');
                    win.document.write(`<pre style="font-family: monospace; padding: 20px; font-size: 13px; line-height:1.4; color:#1e293b;">${DDL_METADATA.sql}</pre>`);
                    win.document.close();
                  }}
                  className="w-full text-left bg-slate-50 border border-slate-200 hover:border-slate-350 p-3.5 rounded-xl transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">View SQL Tables DDL</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">MEMBERS & PAYMENTS schemas</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    const win = window.open('', '_blank');
                    win.document.write(`<pre style="font-family: monospace; padding: 20px; font-size: 13px; line-height:1.4; color:#1e293b;">${DDL_METADATA.rls}</pre>`);
                    win.document.close();
                  }}
                  className="w-full text-left bg-slate-50 border border-slate-200 hover:border-slate-350 p-3.5 rounded-xl transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">View Row-Level Security Rules</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Member-specific corporate isolation</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtered List Preview */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-550 uppercase tracking-wide">Matching Records Preview ({reportFiltered.length})</h3>
            <div className="card overflow-hidden bg-white border border-slate-200 border-t-2 border-t-primary">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-primary/5 text-primary font-bold">
                      <th className="text-left px-4 py-1.5 font-semibold">Member No.</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Company Name</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Sector</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Category</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Contact Person</th>
                      <th className="text-left px-4 py-1.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportFiltered.slice(0, 15).map((m, i) => (
                      <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-1.5 font-mono text-primary font-bold">{m.id}</td>
                        <td className="px-4 py-1.5 text-slate-850 font-bold max-w-[180px] truncate">{m.company}</td>
                        <td className="px-4 py-1.5 text-slate-500">{m.type}</td>
                        <td className="px-4 py-1.5 text-slate-500">{m.category}</td>
                        <td className="px-4 py-1.5 text-slate-500 truncate max-w-[120px]">{m.contact}</td>
                        <td className="px-4 py-1.5">
                          <span className={m.status === 'Active' ? 'badge-active' : m.status === 'Pending' ? 'badge-pending' : 'badge-lapsed'}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {reportFiltered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">No member records match the selected filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {reportFiltered.length > 15 && (
                <div className="px-4 py-1.5 border-t border-slate-200 bg-slate-50/50">
                  <p className="text-[10px] text-slate-500">
                    Showing top 15 of {reportFiltered.length} matched records. Export to CSV to download full report dataset.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
