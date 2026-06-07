import { useState } from 'react';
import { FileCheck, Eye, X, Download, Edit } from 'lucide-react';
import { MALAYSIAN_STATES } from '../../data/mockData';

export function DocPreview({ label, color, onView }) {
  return (
    <button
      onClick={onView}
      className="group relative w-24 h-32 rounded-xl overflow-hidden border border-slate-200 hover:border-slate-900 transition-all duration-200 hover:scale-105 bg-white"
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

export function DocModal({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4.5 h-4.5 text-blue-900" />
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
          <button className="bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-1">
            <Download className="w-3 h-3" /> Download Attachment
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditMemberModal({ member, onClose, onSave }) {
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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative space-y-4 my-auto">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xs font-bold border rounded-lg p-1.5">
          ✕
        </button>
        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
          <Edit className="w-4 h-4 text-blue-900" /> Edit Member Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Name</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SSM Registration</label>
            <input type="text" value={ssm} onChange={e => setSsm(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Person</label>
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-1.5 rounded-xl transition-all duration-200 active:scale-95 uppercase tracking-wider">
            Save Profile
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-1.5 rounded-xl border transition-all duration-200 active:scale-95 uppercase tracking-wider">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
