import codecs

filename = 'client/src/components/PrinterSettings.jsx'
with codecs.open(filename, 'r', 'utf-8') as f:
    content = f.read()

# 1. Remove fetchPrinters from useEffect
target_use_effect = """        if (show) {
            fetchPrinters(localStorage.getItem('use_local_agent') === 'true');
            // Load saved settings"""
replacement_use_effect = """        if (show) {
            // fetchPrinters(localStorage.getItem('use_local_agent') === 'true'); // User requested no auto-refresh
            // Load saved settings"""
content = content.replace(target_use_effect, replacement_use_effect)

# 2. Add the refresh button back
target_footer = """                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 flex justify-end gap-3">

                    <button 
                        onClick={handleSave}"""
replacement_footer = """                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 flex justify-end gap-3">
                    <button 
                        onClick={() => fetchPrinters()}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        disabled={loading}
                    >
                        รีเฟรชรายชื่อ
                    </button>
                    <button 
                        onClick={handleSave}"""
content = content.replace(target_footer, replacement_footer)

# 3. Fix dark mode colors for Status Box and Local Agent Toggle
# Status Box error
content = content.replace("bg-red-50 border-red-200 text-red-700", "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400")
# Status Box success
content = content.replace("bg-emerald-50 border-emerald-200 text-emerald-700", "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400")

# Local Agent Toggle
content = content.replace("bg-sky-50 p-5 rounded-2xl border border-sky-100 shadow-sm", "bg-sky-50 dark:bg-sky-900/20 p-5 rounded-2xl border border-sky-100 dark:border-sky-800/50 shadow-sm")
content = content.replace("text-sky-900 text-lg", "text-sky-900 dark:text-sky-100 text-lg")
content = content.replace("text-sky-700", "text-sky-700 dark:text-sky-400")
content = content.replace("bg-sky-200 text-sky-800", "bg-sky-200 dark:bg-sky-700 text-sky-800 dark:text-sky-100")
content = content.replace("hover:bg-sky-300", "hover:bg-sky-300 dark:hover:bg-sky-600")

with codecs.open(filename, 'w', 'utf-8') as f:
    f.write(content)

print("Fixed PrinterSettings refresh and dark mode!")
