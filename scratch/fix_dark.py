import sys
import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the main container
content = content.replace(
    '<div id="history-print-area" className="max-w-7xl mx-auto premium-card p-6 md:p-8 relative bg-white">',
    '<div id="history-print-area" className="max-w-7xl mx-auto premium-card p-6 md:p-8 relative bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 transition-colors">'
)

# 2. Fix the back button
content = content.replace(
    'className="p-2.5 rounded-xl border border-slate-700/30 hover:bg-slate-700/10 transition-all cursor-pointer text-slate-400 hover:text-white mr-2 no-print"',
    'className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white mr-2 no-print"'
)

# 3. Fix the h1 title
content = content.replace(
    '<h1 className="text-3xl font-black flex items-center gap-2 text-slate-800">',
    '<h1 className="text-3xl font-black flex items-center gap-2 text-slate-800 dark:text-white">'
)

# 4. Fix the patient header background. 
# We need to find the `className` of the div just before `latestLog.gender === 'female'`.
# It usually contains `bg-slate-something`.
idx_gender = content.find("latestLog.gender === 'female'")
if idx_gender != -1:
    # Find the nearest <div that has bg-slate- before this
    start_search = content.rfind('<div className="', 0, idx_gender - 100) # backtrack a bit to find the wrapper
    if start_search != -1:
        # Check if we can find bg-slate- in the wrapper
        wrapper_start = content.rfind('<div', 0, idx_gender)
        wrapper_class_start = content.find('className="', wrapper_start)
        if wrapper_class_start != -1 and wrapper_class_start < idx_gender:
            wrapper_class_end = content.find('"', wrapper_class_start + 11)
            old_class = content[wrapper_class_start+11:wrapper_class_end]
            
            # Let's replace any `bg-slate-XXX` with `bg-slate-XXX dark:bg-slate-800/80` if it's not already there
            if 'bg-' in old_class and 'dark:bg-' not in old_class:
                new_class = old_class + ' dark:bg-slate-800 dark:border-slate-700'
                content = content[:wrapper_class_start+11] + new_class + content[wrapper_class_end:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed dark mode colors in Calculation History!")
