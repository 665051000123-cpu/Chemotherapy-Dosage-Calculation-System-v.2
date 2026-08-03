import codecs

def patch_file(filename):
    with codecs.open(filename, 'r', 'utf-8') as f:
        content = f.read()

    # Change action buttons from dark:bg-indigo-500/10 to dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white
    # In OfflinePrintHistoryModal.jsx it was:
    # bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400
    content = content.replace('dark:bg-indigo-500/10', 'dark:bg-indigo-600')
    content = content.replace('dark:hover:bg-indigo-500/20', 'dark:hover:bg-indigo-500')
    content = content.replace('dark:text-indigo-400', 'dark:text-white')

    # Change card backgrounds to be slightly lighter in dark mode to separate from modal bg
    content = content.replace('bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700', 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50')
    content = content.replace('bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700', 'bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50')
    
    # Change modal background to be slate-900 instead of slate-800, so cards (800) pop out more
    content = content.replace('bg-white dark:bg-slate-800 rounded-3xl', 'bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800')
    
    # Change body background
    content = content.replace('bg-slate-50/50 dark:bg-slate-900/50', 'bg-slate-50/50 dark:bg-slate-900')
    content = content.replace('bg-slate-50 dark:bg-slate-900 border', 'bg-slate-50 dark:bg-slate-800/50 border')
    
    # Change header gradient
    content = content.replace('dark:from-slate-800 dark:to-slate-800', 'dark:from-slate-900 dark:to-slate-900')

    with codecs.open(filename, 'w', 'utf-8') as f:
        f.write(content)

patch_file('client/src/components/OfflinePrintHistoryModal.jsx')
patch_file('client/src/components/PrinterSettings.jsx')
print("Fixed dark colors!")
