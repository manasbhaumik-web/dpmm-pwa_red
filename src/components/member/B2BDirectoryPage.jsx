import { useState, useMemo } from 'react';
import { Search, MapPin, Building2, Phone, Award, MessageCircle } from 'lucide-react';
import { dbInstance, MALAYSIAN_STATES } from '../../data/mockData';

const SECTORS = ['All', 'IT Services', 'Logistics', 'Construction', 'Energy', 'F&B', 'Healthcare', 'Creative', 'Agriculture', 'Engineering', 'Property'];

export default function B2BDirectoryPage({ memberId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Load active members, excluding the current logged-in member
  const activeMembers = useMemo(() => {
    return dbInstance.members.filter(m => m.status === 'Active' && m.member_id !== memberId);
  }, [memberId]);

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
      const matchIndustry = selectedIndustry === 'All' || m.business_type === selectedIndustry;
      
      return matchSearch && matchState && matchDistrict && matchLocation && matchIndustry;
    });
  }, [activeMembers, searchTerm, selectedState, selectedDistrict, selectedLocation, selectedIndustry]);

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="max-w-2xl mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">B2B Matchmaking Directory</h2>
          <p className="text-slate-500 text-sm">Connect directly with other verified corporate members across Malaysia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Search bar */}
          <div className="relative col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Industry Filter */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1">
            <select 
              value={selectedIndustry} 
              onChange={e => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              {SECTORS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Industries' : s}</option>)}
            </select>
          </div>

          {/* State Filter */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1">
            <select 
              value={selectedState} 
              onChange={e => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedLocation('All');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              <option value="All">All States</option>
              {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* District Filter */}
          <div className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1">
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
          <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1">
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
          <div key={member.member_id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden group">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 pr-4 leading-tight">{member.company_name}</h3>
                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-emerald-100 flex items-center gap-1 shrink-0">
                  <Award className="w-2.5 h-2.5"/> Verified
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mb-3">{member.member_id}</p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold">{member.business_type}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600 pl-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{member.address}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-3 mt-auto border-t border-slate-100">
               <a 
                 href={`https://wa.me/${member.phone_mobile?.replace('+', '')}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl transition-colors shadow-sm text-xs"
               >
                 <MessageCircle className="w-4 h-4" />
                 Connect via WhatsApp
               </a>
            </div>
          </div>
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-semibold">No member companies found.</p>
            <p className="text-sm">Try adjusting your filters to find more connections.</p>
          </div>
        )}
      </div>
    </div>
  );
}
