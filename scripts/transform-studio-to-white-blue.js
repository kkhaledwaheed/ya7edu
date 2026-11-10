const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'instructor', 'studio', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace top tabs
content = content.replace(
  'className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-gray-900 border border-gray-800 text-xs font-bold"',
  'className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold"'
);
content = content.replace(
  "activeTab === 'chapters' ? 'bg-cyan-500 text-gray-950 font-extrabold shadow-md' : 'text-gray-400 hover:text-white'",
  "activeTab === 'chapters' ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
);
content = content.replace(
  "activeTab === 'booklets' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'",
  "activeTab === 'booklets' ? 'bg-blue-600 text-white font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
);
content = content.replace(
  "activeTab === 'revisions' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'",
  "activeTab === 'revisions' ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'"
);

// Top header link
content = content.replace(
  'className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold flex items-center gap-2 transition shrink-0"',
  'className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm text-xs font-bold flex items-center gap-2 transition shrink-0"'
);
content = content.replace(
  '<Play className="w-4 h-4 text-cyan-400" />',
  '<Play className="w-4 h-4 text-blue-600" />'
);

// General card replacements
content = content.replace(/rounded-3xl glass-card border border-gray-800/g, 'rounded-3xl bg-white border border-slate-200 shadow-sm');
content = content.replace(/p-6 rounded-3xl glass-card border border-gray-800/g, 'p-6 rounded-3xl bg-white border border-slate-200 shadow-sm');

// Form backgrounds and inputs
content = content.replace(/bg-gray-900 border border-gray-800 rounded-xl px-4 py-2\.5 text-white/g, 'bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400');
content = content.replace(/bg-gray-900 border border-gray-800 rounded-xl/g, 'bg-white border border-slate-300 rounded-xl');
content = content.replace(/bg-gray-950 border border-gray-800/g, 'bg-slate-50 border border-slate-200');
content = content.replace(/bg-gray-950\/40 hover:bg-gray-950\/80/g, 'bg-slate-50 hover:bg-slate-100');
content = content.replace(/border-2 border-dashed border-gray-800 hover:border-indigo-500\/60/g, 'border-2 border-dashed border-slate-300 hover:border-blue-500');

// Cyan button replacements
content = content.replace(/bg-cyan-500 hover:bg-cyan-400 text-gray-950/g, 'bg-blue-600 hover:bg-blue-700 text-white');
content = content.replace(/bg-cyan-600 hover:bg-cyan-500 text-white/g, 'bg-blue-600 hover:bg-blue-700 text-white');
content = content.replace(/text-cyan-400/g, 'text-blue-600');
content = content.replace(/text-cyan-300/g, 'text-blue-700');
content = content.replace(/focus:border-cyan-500/g, 'focus:border-blue-500');
content = content.replace(/focus:border-indigo-500/g, 'focus:border-blue-500');

// Text color changes for section titles
content = content.replace(/text-sm font-bold text-white flex items-center/g, 'text-sm font-bold text-slate-900 flex items-center');
content = content.replace(/text-xs font-bold text-white/g, 'text-xs font-bold text-slate-900');
content = content.replace(/text-gray-300 font-semibold/g, 'text-slate-700 font-semibold');
content = content.replace(/text-gray-400 mt-1/g, 'text-slate-500 mt-1');
content = content.replace(/text-gray-400 block/g, 'text-slate-500 block');
content = content.replace(/text-gray-500 mt-1 block/g, 'text-slate-500 mt-1 block');
content = content.replace(/text-gray-400/g, 'text-slate-500');

// Badges
content = content.replace(/bg-indigo-500\/15 border border-indigo-500\/30 text-indigo-300/g, 'bg-blue-50 border border-blue-200 text-blue-700');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated src/app/instructor/studio/page.tsx to White & Blue theme.');

