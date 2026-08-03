import codecs

def patch_file(filename):
    with codecs.open(filename, 'r', 'utf-8') as f:
        content = f.read()

    # Modals backgrounds
    content = content.replace('bg-white rounded-3xl', 'bg-white dark:bg-slate-800 rounded-3xl')
    
    # Headers
    content = content.replace('bg-gradient-to-r from-indigo-50 to-white', 'bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800 dark:to-slate-800')
    content = content.replace('bg-gradient-to-r from-sky-50 to-white', 'bg-gradient-to-r from-sky-50 to-white dark:from-slate-800 dark:to-slate-800')
    content = content.replace('border-b border-slate-100', 'border-b border-slate-100 dark:border-slate-700/50')
    
    # Icons background
    content = content.replace('bg-indigo-100', 'bg-indigo-100 dark:bg-indigo-500/20')
    content = content.replace('bg-sky-100', 'bg-sky-100 dark:bg-sky-500/20')
    
    # Text colors
    content = content.replace('text-slate-800', 'text-slate-800 dark:text-white')
    content = content.replace('text-slate-500', 'text-slate-500 dark:text-slate-400')
    content = content.replace('text-slate-400', 'text-slate-400 dark:text-slate-500')
    content = content.replace('text-slate-600', 'text-slate-600 dark:text-slate-300')
    
    # Close buttons
    content = content.replace('bg-slate-100 hover:bg-slate-200 text-slate-500', 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300')
    
    # Bodies
    content = content.replace('bg-slate-50/50', 'bg-slate-50/50 dark:bg-slate-900/50')
    content = content.replace('bg-slate-50 border', 'bg-slate-50 dark:bg-slate-900 border')
    
    # Item cards
    content = content.replace('bg-white border border-slate-200', 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700')
    content = content.replace('bg-white p-5 rounded-2xl border border-slate-200', 'bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700')
    content = content.replace('hover:border-indigo-200', 'hover:border-indigo-200 dark:hover:border-indigo-500/50')
    
    # Badge
    content = content.replace('bg-slate-100 text-slate-600', 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')
    
    # Action buttons
    content = content.replace('bg-indigo-50 hover:bg-indigo-100 text-indigo-600', 'bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400')
    
    # Footer
    content = content.replace('border-t border-slate-100 bg-white', 'border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800')
    content = content.replace('bg-slate-100 hover:bg-slate-200', 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600')

    with codecs.open(filename, 'w', 'utf-8') as f:
        f.write(content)

patch_file('client/src/components/OfflinePrintHistoryModal.jsx')
patch_file('client/src/components/PrinterSettings.jsx')
print("Patched both modals!")
