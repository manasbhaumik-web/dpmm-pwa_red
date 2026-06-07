// mockData.js — Simulated Relational Database Layer with Data Cleansing & Webhooks

export const MALAYSIAN_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
  'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
  'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'
];

// Raw legacy spreadsheet containing un-cleansed data (messy dates, non-standard phones, multi-year flat columns)
const LEGACY_SPREADSHEET_DATA = [
  { company_name: 'Mutiara Logistics Sdn Bhd', ssm_no: '201901044321', contact_person: 'Ahmad Razif', email: 'razif@mutiaralogistics.com.my', phone_mobile: '012-3456789', phone_office: '03-55667788', address: 'Lot 12, Jalan Perindustrian 2, Shah Alam, Selangor', category: 'Ordinary', business_type: 'Logistics', status: 'A', expiry_date: '26/12/2026', payments_2024: '100.00', payments_2025: '100.00', payments_2026: '100.00' },
  { company_name: 'TechNex Solutions Sdn Bhd', ssm_no: '202001099887', contact_person: 'Lim Wei Ling', email: 'weiling@technex.com.my', phone_mobile: '019 876 5432', phone_office: '03-88990011', address: 'Suite 15.02, Plaza Mont Kiara, Kuala Lumpur', category: 'Associate', business_type: 'IT Services', status: 'A', expiry_date: '10-01-2027', payments_2024: '100.00', payments_2025: '100.00', payments_2026: '100.00' },
  { company_name: 'Bina Teguh Construction', ssm_no: '201801055662', contact_person: 'Ravi Kumar', email: 'ravi@binateguh.my', phone_mobile: '+60 11-2233 445', phone_office: '03-44556677', address: 'No. 5, Jalan USJ 10/1E, Subang Jaya, Selangor', category: 'Ordinary', business_type: 'Construction', status: 'A', expiry_date: '2026/08/15', payments_2024: '100.00', payments_2025: '100.00', payments_2026: '100.00' },
  { company_name: 'Harmoni Trading & Supplies', ssm_no: '201701022110', contact_person: 'Siti Norsham', email: 'siti@harmonitrading.com', phone_mobile: '6013-4567890', phone_office: '03-33445566', address: '18A, Jalan Melaka, Bukit Bintang, Kuala Lumpur', category: 'Ordinary', business_type: 'Trading', status: 'A', expiry_date: '2026-11-20', payments_2024: '100.00', payments_2025: '100.00', payments_2026: '100.00' },
  { company_name: 'Angkasa Freight Services', ssm_no: '201501033221', contact_person: 'Zulkifli Md', email: 'zulkifli@angkasafreight.com', phone_mobile: '0167890123', phone_office: '03-77889900', address: 'Lot 45, Cargo Terminal, KLIA, Sepang, Selangor', category: 'Life', business_type: 'Logistics', status: 'A', expiry_date: '2099-12-31', payments_2024: '1000.00', payments_2025: '0.00', payments_2026: '0.00' },
  { company_name: 'Puncak Niaga Holdings', ssm_no: '201401088776', contact_person: 'Chan Kok Fai', email: 'kf.chan@puncakniaga.com.my', phone_mobile: '0123456780', phone_office: '03-90901234', address: 'Level 20, Wisma Puncak, Shah Alam, Selangor', category: 'Ordinary', business_type: 'Holdings', status: 'I', expiry_date: '2025-12-31', payments_2024: '100.00', payments_2025: '100.00', payments_2026: '0.00' },
  { company_name: 'Langit Biru Advertising', ssm_no: '202101033445', contact_person: 'Jacinda Lew', email: 'jacinda@langitbiru.my', phone_mobile: '016-7890124', phone_office: '03-22883344', address: '10, Lorong Maarof, Bangsar, Kuala Lumpur', category: 'Associate', business_type: 'Creative', status: 'I', expiry_date: '2025-10-15', payments_2024: '100.00', payments_2025: '100.00', payments_2026: '0.00' },
  { company_name: 'Horizon Dynamics Sdn Bhd', ssm_no: '202201088990', contact_person: 'Iskandar Putra', email: 'iskandar@horizondynamics.my', phone_mobile: '012-3400042', phone_office: '03-80809090', address: 'Block C-3-12, IOI Boulevard, Puchong, Selangor', category: 'Ordinary', business_type: 'Engineering', status: 'A', expiry_date: '2026-06-03', payments_2024: '100.00', payments_2025: '100.00', payments_2026: '100.00' }
];

// Helper to standardise and clean dates to ISO 8601 YYYY-MM-DD
export function cleanseDate(dateStr) {
  if (!dateStr) return '';
  // Clean separators
  const cleanStr = dateStr.replace(/[\/\.]/g, '-').trim();
  
  // Format DD-MM-YYYY
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(cleanStr)) {
    const parts = cleanStr.split('-');
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  // Format YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleanStr)) {
    const parts = cleanStr.split('-');
    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
  }
  return dateStr;
}

// Helper to standardise Malaysian phone formats to "+601..."
export function cleansePhone(phoneStr) {
  if (!phoneStr) return '';
  // Remove non-digit characters except "+"
  let digits = phoneStr.replace(/[^\d+]/g, '').trim();
  
  // Standardise prefix
  if (digits.startsWith('+')) {
    if (digits.startsWith('+60')) return digits;
    if (digits.startsWith('+6')) return '+60' + digits.substring(2);
    return digits;
  }
  
  if (digits.startsWith('60')) {
    return '+' + digits;
  }
  
  if (digits.startsWith('0')) {
    return '+6' + digits;
  }
  
  return '+60' + digits;
}

// Helper to extract mock district and location from address
export function extractDistrictAndLocation(address, state) {
  const parts = address.split(',').map(s => s.trim());
  let location = parts.length >= 2 ? parts[parts.length - 2] : state;
  let district = state === 'Kuala Lumpur' ? 'Kuala Lumpur' : (state === 'Selangor' ? 'Petaling' : state);
  
  if (state === 'Selangor') {
    if (location.includes('Kajang') || location.includes('Hulu Langat') || location.includes('Bangi')) district = 'Hulu Langat';
    else if (location.includes('Shah Alam') || location.includes('Klang')) district = 'Klang';
  }
  return { location, district };
}

// Relational tables holding current database state
class MockRelationalDb {
  constructor() {
    this.members = [];
    this.payments = [];
    this.pendingQueue = [];
    
    this.init();
  }

  init() {
    // 1. Cleanse & import initial legacy spreadsheet rows
    LEGACY_SPREADSHEET_DATA.forEach((row, index) => {
      const memberId = `DPMM-2026-${String(index + 1).padStart(4, '0')}`;
      const address = row.address;
      const status = row.status === 'A' ? 'Active' : 'Lapsed';
      const expDate = cleanseDate(row.expiry_date);
      const stateMatch = address.match(/(Selangor|Kuala Lumpur|Johor|Kedah|Kelantan|Melaka|Negeri Sembilan|Pahang|Perak|Perlis|Pulau Pinang|Sabah|Sarawak|Terengganu|Labuan|Putrajaya)/i);
      const mappedState = stateMatch ? stateMatch[0] : 'Selangor'; // Default to Selangor if not found
      const { location, district } = extractDistrictAndLocation(address, mappedState);

      const cleansedMember = {
        member_id: memberId,
        company_name: row.company_name,
        ssm_no: String(row.ssm_no),
        contact_person: row.contact_person,
        email: row.email,
        phone_mobile: cleansePhone(phone_mobile_field(row)),
        phone_office: cleansePhone(row.phone_office || ''),
        address: address,
        category: row.category,
        business_type: row.business_type,
        state: mappedState,
        district: district,
        location: location,
        status: status,
        expiry_date: expDate,
        whatsapp_status: status === 'Active' ? 'Active' : 'Unsubscribed',
        docs: [
          { label: 'SSM Certificate', color: '#0ea5e9' },
          { label: 'Identity Card (IC)', color: '#8b5cf6' },
        ]
      };
      
      this.members.push(cleansedMember);

      // 2. Flatten payment logs from legacy years (2024-2026)
      const years = ['2024', '2025', '2026'];
      years.forEach((yr, i) => {
        const key = `payments_${yr}`;
        const amt = parseFloat(row[key] || '0');
        if (amt > 0) {
          this.payments.push({
            payment_id: `PAY-SYS-${memberId}-${yr}`,
            member_id: memberId,
            subscription_year: yr,
            payment_date: `${yr}-01-15`,
            receipt_no: `RCP-${yr}-${String(index + 1).padStart(3, '0')}`,
            amount_rm: amt,
            gateway_transaction_id: `TXN-BILLPLZ-${yr}-${String(10000 + index).padStart(5, '0')}`,
            payment_status: 'SUCCESS'
          });
        }
      });
    });

    // Helper functions for dynamic retrieval
    function phone_mobile_field(row) {
      return row.phone_mobile || '';
    }

    // 3. Autogenerate remaining up to 209 members to replace the legacy flat-file spreadsheet
    const sectors = ['Logistics', 'IT Services', 'Construction', 'Trading', 'Engineering', 'Healthcare', 'F&B', 'Energy', 'Property', 'Agriculture', 'Creative', 'Finance'];
    const categories = ['Ordinary', 'Ordinary', 'Ordinary', 'Associate', 'Life'];
    const statuses = ['Active', 'Active', 'Active', 'Active', 'Active', 'Lapsed'];
    const addresses = [
      'Lot 142, Jalan Perusahaan 4, Kajang, Selangor',
      'No. 88, Jalan SS 21/39, Damansara Utama, Selangor',
      'Level 8, Menara Celcom, Petaling Jaya, Selangor',
      'Unit 12-04, Avenue 3, Bangsar South, Kuala Lumpur',
      'Wisma Pertanian, Precinct 4, Putrajaya'
    ];

    const stateMapping = [
      'Selangor', 'Selangor', 'Selangor', 'Kuala Lumpur', 'Putrajaya'
    ];

    for (let i = 9; i <= 209; i++) {
      const memberId = `DPMM-2026-${String(i).padStart(4, '0')}`;
      const isLapsed = statuses[i % statuses.length] === 'Lapsed';
      const addr = addresses[i % addresses.length];
      const st = stateMapping[i % addresses.length];
      const { location, district } = extractDistrictAndLocation(addr, st);
      
      const memberObj = {
        member_id: memberId,
        company_name: `Company Mega Group ${i}`,
        ssm_no: `202101${String(100000 + i).padStart(6, '0')}`,
        contact_person: `Representative ${i}`,
        email: `wakil.${i}@megagroup.com.my`,
        phone_mobile: cleansePhone(`01${i % 10}${String(1000000 + i).padStart(7, '0')}`),
        phone_office: cleansePhone(`038822${String(1000 + i).padStart(4, '0')}`),
        address: addr,
        category: categories[i % categories.length],
        business_type: sectors[i % sectors.length],
        state: st,
        district: district,
        location: location,
        status: isLapsed ? 'Lapsed' : 'Active',
        expiry_date: isLapsed ? '2025-12-31' : '2026-12-31',
        whatsapp_status: isLapsed ? 'Unsubscribed' : 'Active',
        docs: [
          { label: 'SSM Certificate', color: '#0ea5e9' },
          { label: 'Identity Card (IC)', color: '#8b5cf6' },
        ]
      };

      this.members.push(memberObj);

      // Create payments records for generated users
      const currentYear = 2026;
      const startYear = memberObj.category === 'Life' ? 2026 : 2024;
      const fee = memberObj.category === 'Life' ? 1000.00 : 100.00;

      for (let yr = startYear; yr <= currentYear; yr++) {
        if (isLapsed && yr === 2026) continue; // no payment for lapsed members in 2026
        
        this.payments.push({
          payment_id: `PAY-AUTO-${memberId}-${yr}`,
          member_id: memberId,
          subscription_year: String(yr),
          payment_date: `${yr}-02-10`,
          receipt_no: `RCP-${yr}-${String(i).padStart(3, '0')}`,
          amount_rm: fee,
          gateway_transaction_id: `TXN-AUTO-${yr}-${String(20000 + i).padStart(5, '0')}`,
          payment_status: 'SUCCESS'
        });
      }
    }

    // 4. Initialise Pending Queue workspace with applicants
    this.pendingQueue = [
      {
        id: 'APP-2026-001',
        company: 'Duta Kreatif Agency',
        ssm: '202601234567',
        category: 'Associate',
        type: 'Creative Agency',
        contact: 'Ashraf Wafi bin Rosli',
        ic: '890512-14-5678',
        email: 'ashraf@dutakreatif.com.my',
        phone: '601112345678',
        submittedAt: '2026-05-14',
        docs: [
          { label: 'SSM Certificate', color: '#0ea5e9' },
          { label: 'Identity Card (IC)', color: '#8b5cf6' },
        ],
      },
      {
        id: 'APP-2026-002',
        company: 'Prisma Digital Sdn Bhd',
        ssm: '202601987654',
        category: 'Ordinary',
        type: 'Digital Marketing',
        contact: 'Nurul Hana bt Zainudin',
        ic: '931205-08-1234',
        email: 'hana@prismadigital.my',
        phone: '601987654321',
        submittedAt: '2026-05-15',
        docs: [
          { label: 'SSM Certificate', color: '#0ea5e9' },
          { label: 'Identity Card (IC)', color: '#8b5cf6' },
        ],
      },
      {
        id: 'APP-2026-003',
        company: 'Nexus Capital Partners',
        ssm: '202601555888',
        category: 'Life',
        type: 'Investment',
        contact: 'Datuk Suresh Pillai',
        ic: '751009-10-7654',
        email: 'suresh@nexuscapital.com',
        phone: '60122222888',
        submittedAt: '2026-05-16',
        docs: [
          { label: 'SSM Certificate', color: '#0ea5e9' },
          { label: 'Identity Card (IC)', color: '#8b5cf6' },
        ],
      },
      {
        id: 'APP-2026-004',
        company: 'Minda Tekno Resources',
        ssm: '202601777000',
        category: 'Ordinary',
        type: 'Engineering',
        contact: 'Fazilah bt Musa',
        ic: '880303-06-9012',
        email: 'fazilah@mindatekno.my',
        phone: '60133334444',
        submittedAt: '2026-05-16',
        docs: [
          { label: 'SSM Certificate', color: '#0ea5e9' },
          { label: 'Identity Card (IC)', color: '#8b5cf6' },
        ],
      }
    ];
  }

  createPendingApplication(data) {
    const maxNum = this.pendingQueue.reduce((max, app) => {
      const num = parseInt(app.id.split('-')[2]);
      return num > max ? num : max;
    }, 0);
    const newId = `APP-2026-${String(maxNum + 1).padStart(3, '0')}`;
    
    const application = {
      id: newId,
      company: data.company,
      ssm: data.ssm,
      category: data.category,
      type: data.type,
      state: data.state || 'Selangor',
      contact: data.contact,
      ic: data.ic,
      email: data.email,
      phone: data.phone,
      submittedAt: new Date().toISOString().split('T')[0],
      docs: [
        { label: 'SSM Certificate', color: '#0ea5e9' },
        { label: 'Identity Card (IC)', color: '#8b5cf6' },
      ],
    };
    
    this.pendingQueue.unshift(application);
    return application;
  }

  // Database CRUD methods for Members
  getMembers() {
    return this.members;
  }

  getMemberById(id) {
    return this.members.find(m => m.member_id === id);
  }

  createMember(memberData) {
    // Generate fresh member_id incrementing the highest existing number
    const maxNum = this.members.reduce((max, m) => {
      const num = parseInt(m.member_id.split('-')[2]);
      return num > max ? num : max;
    }, 0);
    const newId = `DPMM-2026-${String(maxNum + 1).padStart(4, '0')}`;
    
    const { location, district } = extractDistrictAndLocation(memberData.address || '', memberData.state || 'Selangor');
    const newMember = {
      member_id: newId,
      company_name: memberData.company_name || memberData.company,
      ssm_no: memberData.ssm_no || '',
      contact_person: memberData.contact_person || memberData.contact || '',
      email: memberData.email || '',
      phone_mobile: cleansePhone(memberData.phone_mobile || memberData.phone || ''),
      phone_office: cleansePhone(memberData.phone_office || ''),
      address: memberData.address || '',
      category: memberData.category || 'Ordinary',
      business_type: memberData.business_type || memberData.type || 'Trading',
      state: memberData.state || 'Selangor',
      district: memberData.district || district,
      location: memberData.location || location,
      status: memberData.status || 'Active',
      expiry_date: memberData.expiry_date || '2026-12-31',
      whatsapp_status: memberData.status === 'Active' ? 'Active' : 'Unsubscribed'
    };
    
    this.members.unshift(newMember); // Insert at beginning of list
    return newMember;
  }

  updateMember(id, updatedFields) {
    const idx = this.members.findIndex(m => m.member_id === id);
    if (idx === -1) return null;
    
    const current = this.members[idx];
    const updated = {
      ...current,
      ...updatedFields,
      // Keep primary identifiers safe
      member_id: id,
      company_name: updatedFields.company_name || updatedFields.company || current.company_name,
      contact_person: updatedFields.contact_person || updatedFields.contact || current.contact_person,
      phone_mobile: cleansePhone(updatedFields.phone_mobile || updatedFields.phone || current.phone_mobile),
      phone_office: cleansePhone(updatedFields.phone_office || current.phone_office),
      expiry_date: cleanseDate(updatedFields.expiry_date || current.expiry_date)
    };

    // If status is changed, update whatsapp
    if (updatedFields.status) {
      updated.whatsapp_status = updatedFields.status === 'Active' ? 'Active' : 'Unsubscribed';
    }

    this.members[idx] = updated;
    return updated;
  }

  deleteMember(id) {
    const initialLen = this.members.length;
    this.members = this.members.filter(m => m.member_id !== id);
    // clean related payments
    this.payments = this.payments.filter(p => p.member_id !== id);
    return this.members.length < initialLen;
  }

  // Database CRUD methods for Payments
  getPayments() {
    return this.payments;
  }

  getPaymentsByMember(memberId) {
    return this.payments.filter(p => p.member_id === memberId);
  }

  createPayment(paymentData) {
    const maxNum = this.payments.length;
    const newPayment = {
      payment_id: `PAY-MAN-${paymentData.member_id}-${Date.now()}`,
      member_id: paymentData.member_id,
      subscription_year: paymentData.subscription_year || '2026',
      payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0],
      receipt_no: paymentData.receipt_no || `RCP-2026-MAN-${String(maxNum + 1).padStart(3, '0')}`,
      amount_rm: parseFloat(paymentData.amount_rm || '100.00'),
      gateway_transaction_id: paymentData.gateway_transaction_id || `TXN-MANUAL-${Date.now()}`,
      payment_status: paymentData.payment_status || 'SUCCESS'
    };

    this.payments.unshift(newPayment);

    // Side effect: update member status and expiry date
    const member = this.getMemberById(paymentData.member_id);
    if (member) {
      const extYear = parseInt(newPayment.subscription_year);
      this.updateMember(paymentData.member_id, {
        status: 'Active',
        expiry_date: `${extYear}-12-31`
      });
    }

    return newPayment;
  }
}

export const dbInstance = new MockRelationalDb();

// Maintain backwards compatible exports mapping mock schema object formats
export const MEMBERS = dbInstance.members.map(m => ({
  id: m.member_id,
  company: m.company_name,
  category: m.category,
  type: m.business_type,
  status: m.status,
  fee: m.status === 'Active' ? 100 : 0,
  year: parseInt(m.expiry_date.split('-')[0]) || 2026,
  contact: m.contact_person,
  phone: m.phone_mobile.replace('+', ''),
  state: m.state,
  district: m.district,
  location: m.location
}));

export const PENDING_APPLICANTS = dbInstance.pendingQueue;

export const B2B_PEERS = [
  { id: 1, company: 'TechNex Solutions Sdn Bhd',  sector: 'IT Services',  desc: 'Enterprise software, cloud migration & managed IT services.', phone: '60198765432', verified: true },
  { id: 2, company: 'Mutiara Logistics Sdn Bhd',  sector: 'Logistics',    desc: 'Last-mile delivery, warehousing & freight forwarding nationally.', phone: '60123456789', verified: true },
  { id: 3, company: 'Bina Teguh Construction',     sector: 'Construction', desc: 'Grade G7 contractor — civil, structural & M&E works.', phone: '60112233445', verified: true },
  { id: 4, company: 'Seraya Green Energy',         sector: 'Energy',       desc: 'Solar PV system design, supply & installation for commercial premises.', phone: '60178901234', verified: false },
  { id: 5, company: 'Giga Systems Integration',    sector: 'IT Services',  desc: 'Network infrastructure, cybersecurity & CCTV solutions.', phone: '60112345679', verified: true },
  { id: 6, company: 'Cendana Food & Beverage',     sector: 'F&B',          desc: 'Catering, event food services & corporate meal packages.', phone: '60156789012', verified: true },
  { id: 7, company: 'Alpha Maritime Sdn Bhd',      sector: 'Logistics',    desc: 'Port logistics, ship agency & customs clearance services.', phone: '60178901235', verified: true },
  { id: 8, company: 'MedCare Pharmaceutical',      sector: 'Healthcare',   desc: 'Wholesale pharmaceutical distribution & medical consumables.', phone: '60190123456', verified: false },
  { id: 9, company: 'Langit Biru Advertising',     sector: 'Creative',     desc: 'Brand strategy, creative design & digital marketing campaigns.', phone: '60167890124', verified: true },
  { id: 10, company: 'Agroland Plantation',        sector: 'Agriculture',  desc: 'Palm oil, rubber estate management & agri-consultancy.', phone: '60190123457', verified: true },
  { id: 11, company: 'Primus Engineering Works',   sector: 'Engineering',  desc: 'Precision machining, fabrication & industrial maintenance.', phone: '60189012345', verified: true },
  { id: 12, company: 'Warisan Maju Properties',    sector: 'Property',     desc: 'Commercial property development, leasing & asset management.', phone: '60145678901', verified: true },
];

export const RECEIPTS = [
  { id: 'RCP-2024-042', year: 'Subscription Year 2024', amount: 'RM 100.00', date: '15 Jan 2024', method: 'FPX – Maybank2u' },
  { id: 'RCP-2025-042', year: 'Subscription Year 2025', amount: 'RM 100.00', date: '10 Jan 2025', method: 'FPX – CIMB Clicks' },
];

export const BANKS = [
  { id: 'maybank',    name: 'Maybank2u',   color: '#ffde00', bg: '#003166' },
  { id: 'cimb',       name: 'CIMB Clicks', color: '#fff',    bg: '#e30613' },
  { id: 'rhb',        name: 'RHB Bank',    color: '#fff',    bg: '#005baa' },
  { id: 'bankislam',  name: 'Bank Islam',  color: '#fff',    bg: '#00843d' },
  { id: 'publicbank', name: 'Public Bank', color: '#fff',    bg: '#003087' },
  { id: 'hongleong',  name: 'Hong Leong',  color: '#fff',    bg: '#d4111e' },
];

// MOCK WEBHOOK LISTENER AUTOMATION
// Webhook endpoint receiver simulating standard payment gateway hook for Malaysian FPX rails (ToyyibPay/Billplz)
export function simulatedWebhookListener(payload) {
  console.log('Webhook triggered: charge.successful', payload);
  
  if (payload.event !== 'charge.successful') {
    return { success: false, error: 'Unsupported webhook event type' };
  }

  const { member_id, amount_rm, subscription_year, gateway_transaction_id } = payload.data;
  
  // Find member in DB
  const member = dbInstance.getMemberById(member_id);
  if (!member) {
    return { success: false, error: `Member with ID ${member_id} not found` };
  }

  // Record payment in DB
  const paymentRecord = dbInstance.createPayment({
    member_id,
    subscription_year: String(subscription_year || new Date().getFullYear()),
    payment_date: new Date().toISOString().split('T')[0],
    amount_rm: parseFloat(amount_rm),
    gateway_transaction_id,
    payment_status: 'SUCCESS'
  });

  return {
    success: true,
    message: 'Webhook parsed and database updated.',
    payment: paymentRecord,
    member: dbInstance.getMemberById(member_id)
  };
}

// SQL DDL Schema strings for database overview console panel
export const DDL_METADATA = {
  sql: `
-- SQL Schema Setup for Persatuan PWA via Supabase (PostgreSQL)

CREATE TABLE IF NOT EXISTS public.members (
    member_id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    ssm_no VARCHAR(50) NOT NULL UNIQUE,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_mobile VARCHAR(50) NOT NULL,
    phone_office VARCHAR(50),
    address TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Ordinary', 'Associate', 'Life')),
    business_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Active', 'Lapsed', 'Pending')),
    expiry_date DATE NOT NULL,
    whatsapp_status VARCHAR(50) DEFAULT 'Active' CHECK (whatsapp_status IN ('Active', 'Unsubscribed', 'None')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
    payment_id VARCHAR(100) PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES public.members(member_id) ON DELETE CASCADE,
    subscription_year VARCHAR(10) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_no VARCHAR(100) NOT NULL UNIQUE,
    amount_rm NUMERIC(10, 2) NOT NULL,
    gateway_transaction_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'SUCCESS'
);
`,
  rls: `
-- Row-Level Security (RLS) policies for corporate isolation

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Members can only read/edit their own organization profile
CREATE POLICY member_self_access ON public.members
    FOR ALL
    USING (auth.jwt() ->> 'email' = email)
    WITH CHECK (auth.jwt() ->> 'email' = email);

-- POLICY 2: Members can only view their own payment histories
CREATE POLICY member_payment_history ON public.payments
    FOR SELECT
    USING (member_id IN (
        SELECT member_id FROM public.members WHERE email = auth.jwt() ->> 'email'
    ));

-- POLICY 3: Full global access for administrative accounts
CREATE POLICY admin_global_access ON public.members
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%@secretariat.com.my');

CREATE POLICY admin_payments_access ON public.payments
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%@secretariat.com.my');
`
};
