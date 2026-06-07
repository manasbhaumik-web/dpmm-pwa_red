import { useState, useMemo } from 'react';
import { Search, MapPin, Building2, Phone, Award, ChevronRight, Edit, Eye, FileCheck } from 'lucide-react';
import { dbInstance, MALAYSIAN_STATES } from '../../data/mockData';
import { EditMemberModal, DocModal, DocPreview } from '../admin/SharedModals';
import MemberProfileModal from '../admin/MemberProfileModal';

export default function DirectoryPage({ adminType, adminState, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState(adminType === 'state' ? adminState : 'All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const [editTarget, setEditTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // We'll read directly from dbInstance for public directory, but only Active members.
  const activeMembers = useMemo(() => {
    return dbInstance.members.filter(m => m.status === 'Active');
  }, [refreshKey]);

  const handleEditSave = (updated) => {
    const idx = dbInstance.members.findIndex(m => m.member_id === updated.member_id);
    if (idx !== -1) {
      dbInstance.members[idx] = updated;
      setRefreshKey(k => k + 1);
    }
    setEditTarget(null);
  };

  const districts = useMemo(() => {
    const filteredForDistricts = activeMembers.filter(m => selectedState === 'All' || m.state === selectedState);
    const d = new Set(filteredForDistricts.map(m => m.district).filter(Boolean));
    return ['All', ...Array.from(d).sort()];
  }, [activeMembers, selectedState]);

  const locations = useMemo(() => {
    const filteredForLocations = activeMembers.filter(m => selectedState === 'All' || m.state === selectedState);
    const l = new Set(filteredForLocations.map(m => m.location).filter(Boolean));
    return ['All', ...Array.from(l).sort()];
  }, [activeMembers, selectedState]);

  const filteredMembers = useMemo(() => {
    return activeMembers.filter(m => {
      const matchSearch = m.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.business_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchState = selectedState === 'All' || m.state === selectedState;
      const matchDistrict = selectedDistrict === 'All' || m.district === selectedDistrict;
      const matchLocation = selectedLocation === 'All' || m.location === selectedLocation;
      return matchSearch && matchState && matchDistrict && matchLocation;
    });
  }, [activeMembers, searchTerm, selectedState, selectedDistrict, selectedLocation]);

  return (
    <div className="w-full space-y-6 max-w-7xl mx-auto px-4 py-6">
      {onBack && (
        <button onClick={onBack} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 mb-2">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Admin Dashboard
        </button>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Member Directory</h1>
          <p className="text-slate-500 text-sm mb-6">Search and connect with verified DPMM member companies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies or sectors..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* State Filter */}
          <div>
            <select 
              value={selectedState} 
              onChange={e => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedLocation('All');
              }}
              disabled={adminType === 'state'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All States</option>
              {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select 
              value={selectedDistrict} 
              onChange={e => {
                setSelectedDistrict(e.target.value);
                setSelectedLocation('All');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Districts</option>
              {districts.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select 
              value={selectedLocation} 
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All Locations</option>
              {locations.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMembers.map(member => (
          <div key={member.member_id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
               <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase border border-emerald-100 flex items-center gap-1">
                 <Award className="w-3 h-3"/> Verified
               </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 pr-20">{member.company_name}</h3>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">{member.member_id} • SSM: {member.ssm_no}</p>
            </div>
            
            <div className="space-y-1.5 mt-2">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{member.business_type} • {member.category}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{member.address}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{member.contact_person}</span>
              </div>
            </div>

            {adminType && (
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => setViewTarget(member)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-xl text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Profile
                </button>
                <button 
                  onClick={() => setEditTarget({
                    ...member,
                    company: member.company_name,
                    contact: member.contact_person,
                    phone: member.phone_mobile
                  })}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-xl text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
              </div>
            )}

            {adminType && member.docs && member.docs.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2 overflow-x-auto pb-1">
                {member.docs.map(d => (
                  <DocPreview key={d.label} label={d.label} color={d.color} onView={() => setPreviewDoc(d)} />
                ))}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-100">
              <a
                href={`https://wa.me/${member.phone_mobile.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M16 3C9 3 3 9 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.5 28.3 13.7 29 16 29c7 0 13-6 13-13S23 3 16 3zm0 23.8c-2.1 0-4.2-.6-6-1.6l-.4-.3-4 1 1-3.9-.3-.4A10.8 10.8 0 0 1 5.1 16C5.1 10.1 10 5.2 16 5.2S26.8 10.1 26.8 16 21.9 26.8 16 26.8zm5.9-8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.1-.8 1-.9 1.2-.3.2-.6 0c-1.6-.8-2.7-1.4-3.8-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4-.1-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.1 2 3.1 4.9 4.3 1.8.8 2.5.9 3.4.7.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No member companies found matching your filters.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedState('All');
              setSelectedDistrict('All');
              setSelectedLocation('All');
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-700 text-xs font-bold underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {editTarget && <EditMemberModal member={editTarget} onClose={() => setEditTarget(null)} onSave={handleEditSave} />}
      {viewTarget && <MemberProfileModal member={viewTarget} onClose={() => setViewTarget(null)} />}
      {previewDoc && <DocModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
}
