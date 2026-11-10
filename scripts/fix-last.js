const fs = require('fs');

let vouchers = fs.readFileSync('src/app/admin/vouchers/page.tsx', 'utf8');
vouchers = vouchers.replace('bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800', 'bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200');
vouchers = vouchers.replace('bg-gray-900 text-cyan-400', 'bg-blue-600 text-white');
fs.writeFileSync('src/app/admin/vouchers/page.tsx', vouchers, 'utf8');

let studio = fs.readFileSync('src/app/instructor/studio/page.tsx', 'utf8');
studio = studio.replace(/bg-gray-900 hover:bg-rose-600\/30 text-slate-500 hover:text-rose-400/g, 'bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600');
studio = studio.replace(/'bg-gray-900 border-gray-800'/g, "'bg-slate-50 border-slate-200'");
fs.writeFileSync('src/app/instructor/studio/page.tsx', studio, 'utf8');

console.log('Fixed last remaining instances successfully');

