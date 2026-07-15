import sys
import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the specific block for calculation history item.
# It contains `log.drugs_used` and `log.prescribed_dose`
idx_drugs = content.find('{log.drugs_used || \'-\'}')
if idx_drugs == -1:
    print("Could not find {log.drugs_used || '-'}")
    sys.exit(1)

# Find the start of its wrapper `flex-1 bg-slate-50`
wrapper_start_str = '<div className="flex-1 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">'
idx_start = content.rfind(wrapper_start_str, 0, idx_drugs)
if idx_start == -1:
    print("Could not find wrapper start")
    sys.exit(1)

# The end of this block is before `{log.doctor && (`
idx_end = content.find('{log.doctor && (', idx_start)
if idx_end == -1:
    print("Could not find end marker")
    sys.exit(1)

# Backtrack to the closing `</div>` of the wrapper
idx_end = content.rfind('</div>', 0, idx_end) + 6

new_block = '''{(() => {
                                                                    const drugsList = (log.drugs_used || '').split(',').map(d => d.trim()).filter(Boolean);
                                                                    const dosesList = (log.prescribed_dose || '').split('+').map(d => d.trim()).filter(Boolean);
                                                                    
                                                                    return (
                                                                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                                    <Paperclip size={12} className="text-slate-400" />
                                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">สูตรยาที่ใช้ (REGIMEN)</p>
                                                                                </div>
                                                                                <div className="text-left sm:text-right mt-1 sm:mt-0">
                                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">วิธีการคำนวณ</p>
                                                                                    <p className="text-[9px] font-bold text-slate-500 bg-slate-200/50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded inline-block uppercase">{sanitizeNaN(log.formula_used)}</p>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="flex flex-col gap-1.5 border-t border-slate-200/50 dark:border-slate-700/50 pt-2 mt-2">
                                                                                {drugsList.map((drug, idx) => (
                                                                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-1">
                                                                                        <p className="font-black text-sky-600 dark:text-sky-400 uppercase text-sm leading-snug">{drug}</p>
                                                                                        {dosesList[idx] && (
                                                                                            <div className="shrink-0 text-left sm:text-right mt-0.5 sm:mt-0">
                                                                                                <p className="text-sm font-black text-amber-600 dark:text-amber-500 bg-amber-500/10 inline-block px-2 py-0.5 rounded-md border border-amber-500/20 shadow-sm">
                                                                                                    {sanitizeNaN(dosesList[idx])}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                                {drugsList.length === 0 && (
                                                                                    <p className="text-sm text-slate-500">-</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}'''

content = content[:idx_start] + new_block + content[idx_end:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied vertically stacked regimen and doses!")
