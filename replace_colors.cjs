const fs = require('fs');
const files = [
  'src/components/admin/AdminDashboard.jsx',
  'src/components/member/MemberPortal.jsx'
];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  
  // Replace Nav button active states
  code = code.replace(/bg-slate-900 text-white shadow-md/g, 'bg-blue-900 text-white shadow-md');
  code = code.replace(/bg-slate-900 text-white shadow-sm/g, 'bg-blue-900 text-white shadow-sm');
  code = code.replace(/hover:text-slate-900/g, 'hover:text-blue-900');
  
  // Replace Primary Button Colors
  code = code.replace(/bg-slate-900 hover:bg-slate-800/g, 'bg-blue-900 hover:bg-blue-800');
  
  // Replace Accent Button Colors (which were red, change to blue-900)
  code = code.replace(/bg-accent hover:bg-accent-dark/g, 'bg-blue-900 hover:bg-blue-800');
  
  // Additional border accents that might be acting as decorative banners
  code = code.replace(/border-t-slate-900/g, 'border-t-blue-900');
  code = code.replace(/border-t-accent/g, 'border-t-blue-900');
  
  // Text icons
  code = code.replace(/text-slate-900\/80/g, 'text-blue-900/80');
  code = code.replace(/text-slate-900/g, 'text-blue-900');
  
  fs.writeFileSync(f, code);
});

console.log('Colors replaced successfully!');
