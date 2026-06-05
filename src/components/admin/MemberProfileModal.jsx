import {
  X, Building2, Shield, Calendar, MapPin, Phone, Mail,
  CreditCard, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';

export default function MemberProfileModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">
              {member.company.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">{member.company}</h2>
              <p className="text-xs text-slate-500 font-medium">SSM: {member.ssm_no} · ID: <span className="font-mono text-blue-900 font-bold">{member.id}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors self-start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl flex items-center gap-3 border ${
            member.status === 'Active' ? 'bg-emerald-50 border-emerald-200' :
            member.status === 'Pending' ? 'bg-amber-50 border-amber-200' :
            'bg-rose-50 border-rose-200'
          }`}>
            {member.status === 'Active' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> :
             member.status === 'Pending' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
             <AlertTriangle className="w-5 h-5 text-rose-600" />}
            <div>
              <p className={`text-sm font-bold ${
                member.status === 'Active' ? 'text-emerald-800' :
                member.status === 'Pending' ? 'text-amber-800' : 'text-rose-800'
              }`}>
                Membership Status: {member.status}
              </p>
              <p className={`text-xs mt-0.5 ${
                member.status === 'Active' ? 'text-emerald-600' :
                member.status === 'Pending' ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {member.status === 'Active' ? `Valid until ${member.expiry_date}` :
                 member.status === 'Pending' ? 'Awaiting verification and payment.' :
                 'Subscription lapsed. Payment required.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Primary Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Building2 className="w-4 h-4 text-blue-900" /> Corporate Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Sector / Industry</p>
                  <p className="text-sm font-semibold text-slate-700">{member.business_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Membership Category</p>
                  <p className="text-sm font-semibold text-slate-700">{member.category}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Date Joined</p>
                  <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> 2021
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Mail className="w-4 h-4 text-blue-900" /> Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Representative Name</p>
                  <p className="text-sm font-semibold text-slate-700">{member.contact_person}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                  <p className="text-sm font-medium text-blue-600 break-all">
                    <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Numbers</p>
                  <p className="text-sm font-medium text-slate-700 flex flex-col gap-1 mt-0.5">
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {member.phone_mobile} (Mobile)</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {member.phone_office || 'N/A'} (Office)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <MapPin className="w-4 h-4 text-blue-900" /> Registered Address
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{member.address}</p>
                <p className="text-xs text-slate-500 font-bold mt-1">State: {member.state}</p>
              </div>
            </div>
          </div>

          {/* Payments Mini-Ledger */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <CreditCard className="w-4 h-4 text-blue-900" /> Recent Fee Payments
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-slate-600">Year</th>
                    <th className="text-right px-4 py-2 font-semibold text-slate-600">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-700 font-medium">2026</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-600">{member.payments_2026}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-700 font-medium">2025</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-600">{member.payments_2025}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-700 font-medium">2024</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-600">{member.payments_2024}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
