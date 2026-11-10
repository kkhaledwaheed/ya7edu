const fs = require('fs');
const path = require('path');

function replaceInFile(relativePath, replacements) {
  const filePath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', relativePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [target, replacement] of replacements) {
    if (typeof target === 'string') {
      content = content.split(target).join(replacement);
    } else {
      content = content.replace(target, replacement);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed:', relativePath);
}

// Common White & Blue styling replacements for Admin & Studio files
const commonReplacements = [
  // Badges & alerts
  ['bg-rose-500/15 border border-rose-500/30 text-rose-300', 'bg-blue-50 border border-blue-200 text-blue-700'],
  ['bg-indigo-500/15 border border-indigo-500/30 text-indigo-300', 'bg-blue-50 border border-blue-200 text-blue-700'],
  ['text-rose-400', 'text-blue-600'],
  ['text-rose-300', 'text-blue-700'],
  ['text-cyan-400', 'text-blue-600'],
  ['text-cyan-300', 'text-blue-700'],

  // Headings & Text
  ['text-2xl sm:text-3xl font-extrabold text-white tracking-tight', 'text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'],
  ['text-sm text-gray-400 mt-1', 'text-sm text-slate-500 mt-1'],
  ['text-xs text-gray-400', 'text-xs text-slate-500'],
  ['text-[11px] text-gray-400', 'text-[11px] text-slate-500'],
  ['text-[10px] text-gray-400', 'text-[10px] text-slate-500'],
  ['text-gray-300 font-semibold', 'text-slate-700 font-semibold'],
  ['text-gray-300', 'text-slate-700'],
  ['text-gray-200', 'text-slate-800'],
  ['text-gray-400', 'text-slate-500'],

  // Cards and Containers
  ['rounded-3xl glass-card border border-gray-800', 'rounded-3xl bg-white border border-slate-200 shadow-sm'],
  ['rounded-2xl glass-card border border-gray-800', 'rounded-2xl bg-white border border-slate-200 shadow-sm'],
  ['rounded-3xl glass-card border border-indigo-500/30', 'rounded-3xl bg-white border border-slate-200 shadow-sm'],
  ['p-6 rounded-3xl glass-card border border-gray-800', 'p-6 rounded-3xl bg-white border border-slate-200 shadow-sm'],
  ['p-5 rounded-3xl glass-card border border-gray-800', 'p-5 rounded-3xl bg-white border border-slate-200 shadow-sm'],
  ['p-5 sm:p-6 rounded-3xl glass-card border border-gray-800', 'p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm'],
  ['p-6 sm:p-7 rounded-3xl glass-card border border-indigo-500/30', 'p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm'],
  ['glass-card', 'bg-white border border-slate-200 shadow-sm'],

  // Inputs and select boxes
  ['bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white', 'bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900'],
  ['bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white', 'bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900'],
  ['bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white', 'bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900'],
  ['bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400', 'bg-white border border-slate-300 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm'],
  ['bg-gray-900 border border-gray-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400', 'bg-white border border-slate-300 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm'],
  ['bg-gray-900 border border-gray-800 rounded-xl px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-400', 'bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm'],
  ['bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-400', 'bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm'],
  ['bg-gray-900 border border-gray-800', 'bg-white border border-slate-200'],
  ['bg-gray-950 border border-gray-800', 'bg-slate-50 border border-slate-200'],

  // Tables
  ['bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800', 'bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200'],
  ['divide-y divide-gray-800 text-gray-300', 'divide-y divide-slate-100 text-slate-700'],
  ['hover:bg-gray-800/40 transition', 'hover:bg-slate-50 transition'],

  // Buttons
  ['bg-cyan-600 hover:bg-cyan-500 text-white', 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'],
  ['bg-cyan-500 hover:bg-cyan-400 text-gray-950', 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'],
  ['bg-gray-800 hover:bg-gray-700 text-gray-200', 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'],
  ['bg-gray-800 hover:bg-gray-700 text-gray-300', 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'],
  ['bg-gray-800 hover:bg-gray-700 text-gray-400', 'bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-sm'],
  ['bg-gray-800 hover:bg-gray-700 text-cyan-300', 'bg-slate-100 hover:bg-blue-50 text-blue-700 shadow-sm'],
  ['bg-gray-800 text-gray-300 hover:bg-gray-700', 'bg-slate-100 text-slate-700 hover:bg-slate-200'],
  ['bg-cyan-500 text-gray-950', 'bg-blue-600 text-white'],

  // Focus
  ['focus:border-cyan-400', 'focus:border-blue-500'],
  ['focus:border-cyan-500', 'focus:border-blue-500'],
  ['focus:border-indigo-500', 'focus:border-blue-500']
];

// 1. Process Studio remaining
replaceInFile('src/app/instructor/studio/page.tsx', [
  ['className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-white', 'className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900'],
  ["'bg-gray-900/60 border-gray-800 text-slate-500 hover:text-white'", "'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'"],
  ['bg-gray-900 border border-indigo-500/30 space-y-3', 'bg-white border border-slate-200 shadow-sm space-y-3'],
  ['bg-gray-900 border border-rose-500/30 space-y-2', 'bg-white border border-slate-200 shadow-sm space-y-2'],
  ['bg-gray-950/60 border border-gray-800', 'bg-slate-50 border border-slate-200'],
  ['bg-gray-950/40 border border-gray-800/80', 'bg-slate-50 border border-slate-200'],
  ['bg-gray-950/60 border border-gray-800/80', 'bg-slate-50 border border-slate-200'],
  ['bg-gray-900 hover:bg-rose-600/30 text-slate-500 hover:text-rose-400', 'bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600'],
  ['bg-gray-950/70 border border-gray-800', 'bg-slate-50 border border-slate-200'],
  ['bg-gray-900/60 border border-gray-800', 'bg-white border border-slate-300'],
  ['bg-gray-900 border border-indigo-500/40 space-y-3', 'bg-white border border-slate-200 shadow-sm space-y-3'],
  ['bg-gray-900/80 border border-amber-500/40', 'bg-white border border-amber-300'],
  ['bg-gray-900 border border-emerald-500/40 space-y-3', 'bg-white border border-slate-200 shadow-sm space-y-3'],
  ['bg-gray-900 border border-emerald-500/30 space-y-3', 'bg-white border border-slate-200 shadow-sm space-y-3']
]);

// 2. Process Admin Vouchers
replaceInFile('src/app/admin/vouchers/page.tsx', [
  ...commonReplacements,
  ['bg-[#0d1322]', 'bg-slate-50'],
  ['bg-gray-900 border border-cyan-500/50 shadow-2xl', 'bg-white border border-slate-200 shadow-2xl'],
  ['bg-slate-950 flex justify-center', 'bg-slate-100 flex justify-center'],
  ['bg-gray-950 text-white text-center border border-gray-800', 'bg-blue-900 text-white text-center border border-blue-950 shadow-sm'],
  ['text-cyan-300 select-all', 'text-white select-all'],
  ['text-cyan-300 text-sm', 'text-blue-600 text-sm'],
  ['bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white', 'bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white']
]);

// 3. Process Admin Courses
replaceInFile('src/app/admin/courses/page.tsx', [
  ...commonReplacements,
  ['text-white', 'text-slate-900'],
  ['hover:border-gray-700', 'hover:border-slate-300 shadow-sm'],
  ['bg-gray-900', 'bg-white'],
  ['bg-gray-950', 'bg-slate-50'],
  ['border-gray-800', 'border-slate-200']
]);

// 4. Process Admin Grades
replaceInFile('src/app/admin/grades/page.tsx', [
  ...commonReplacements,
  ['text-white', 'text-slate-900'],
  ['bg-gray-900', 'bg-white'],
  ['bg-gray-950', 'bg-slate-50'],
  ['border-gray-800', 'border-slate-200']
]);

// 5. Process Admin Instructors
replaceInFile('src/app/admin/instructors/page.tsx', [
  ...commonReplacements,
  ['text-white', 'text-slate-900'],
  ['bg-gray-900', 'bg-white'],
  ['bg-gray-950', 'bg-slate-50'],
  ['border-gray-800', 'border-slate-200']
]);

// 6. Process Admin Payouts
replaceInFile('src/app/admin/payouts/page.tsx', [
  ...commonReplacements,
  ['text-white', 'text-slate-900'],
  ['bg-gray-900', 'bg-white'],
  ['bg-gray-950', 'bg-slate-50'],
  ['border-gray-800', 'border-slate-200'],
  ['text-amber-300', 'text-amber-700 font-bold']
]);

// 7. Process Admin Settings
replaceInFile('src/app/admin/settings/page.tsx', [
  ...commonReplacements,
  ['text-white', 'text-slate-900'],
  ['bg-gray-900', 'bg-white'],
  ['bg-gray-950', 'bg-slate-50'],
  ['border-gray-800', 'border-slate-200']
]);

// 8. Process Admin Users
replaceInFile('src/app/admin/users/page.tsx', [
  ...commonReplacements,
  ['text-white', 'text-slate-900'],
  ['bg-gray-900', 'bg-white'],
  ['bg-gray-950', 'bg-slate-50'],
  ['border-gray-800', 'border-slate-200']
]);

// 9. Process Admin YA7EDU Booklets
replaceInFile('src/app/admin/ya7edu-booklets/page.tsx', [
  ...commonReplacements,
  ['text-white', 'text-slate-900'],
  ['bg-gray-900', 'bg-white'],
  ['bg-gray-950', 'bg-slate-50'],
  ['border-gray-800', 'border-slate-200']
]);

console.log('ALL REMAINING ADMIN AND INSTRUCTOR FILES RETHEMED SUCCESSFULLY.');

