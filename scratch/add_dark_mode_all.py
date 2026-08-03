import codecs

def add_dark_mode(filepath):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()
    
    # 1. Main Modal Wrappers
    content = content.replace('bg-white rounded-2xl', 'bg-white dark:bg-slate-900 rounded-2xl')
    content = content.replace('bg-white rounded-3xl', 'bg-white dark:bg-slate-900 rounded-3xl')
    content = content.replace('bg-white w-full', 'bg-white dark:bg-slate-900 w-full')
    content = content.replace('border border-slate-200', 'border border-slate-200 dark:border-slate-800')
    
    # 2. Text Colors
    content = content.replace('text-slate-900', 'text-slate-900 dark:text-white')
    content = content.replace('text-slate-800', 'text-slate-800 dark:text-white')
    content = content.replace('text-slate-700', 'text-slate-700 dark:text-slate-200')
    content = content.replace('text-slate-600', 'text-slate-600 dark:text-slate-300')
    content = content.replace('text-slate-500', 'text-slate-500 dark:text-slate-400')
    content = content.replace('text-slate-400', 'text-slate-400 dark:text-slate-500')
    content = content.replace('text-gray-900', 'text-gray-900 dark:text-white')
    content = content.replace('text-gray-800', 'text-gray-800 dark:text-white')
    content = content.replace('text-gray-700', 'text-gray-700 dark:text-gray-200')
    content = content.replace('text-gray-600', 'text-gray-600 dark:text-gray-300')
    content = content.replace('text-gray-500', 'text-gray-500 dark:text-gray-400')
    
    # 3. Backgrounds (inner cards, inputs, footers)
    content = content.replace('bg-slate-50', 'bg-slate-50 dark:bg-slate-800')
    content = content.replace('bg-slate-100', 'bg-slate-100 dark:bg-slate-800')
    content = content.replace('bg-slate-200', 'bg-slate-200 dark:bg-slate-700')
    content = content.replace('bg-white shadow', 'bg-white dark:bg-slate-800 shadow')
    content = content.replace('bg-white p-', 'bg-white dark:bg-slate-800 p-')
    content = content.replace('bg-white border', 'bg-white dark:bg-slate-800 border')
    content = content.replace('bg-gray-50', 'bg-gray-50 dark:bg-slate-800')
    
    # 4. Inputs
    content = content.replace('border-slate-300 focus:border-indigo-500', 'border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:border-indigo-500')
    content = content.replace('border-gray-300 focus:border-indigo-500', 'border-gray-300 dark:border-slate-600 dark:bg-slate-700 focus:border-indigo-500')
    
    # 5. Buttons/Hover
    content = content.replace('hover:bg-slate-50', 'hover:bg-slate-50 dark:hover:bg-slate-700')
    content = content.replace('hover:bg-slate-100', 'hover:bg-slate-100 dark:hover:bg-slate-700')
    content = content.replace('hover:bg-gray-50', 'hover:bg-gray-50 dark:hover:bg-slate-700')
    
    # 6. Specific Headers
    content = content.replace('border-b border-slate-200', 'border-b border-slate-200 dark:border-slate-700')
    content = content.replace('border-t border-slate-200', 'border-t border-slate-200 dark:border-slate-700')
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)

# Apply to the 3 main modals
add_dark_mode('client/src/components/CalculationHistory.jsx')
add_dark_mode('client/src/components/InventoryManagement.jsx')
add_dark_mode('client/src/components/DrugsInfo.jsx')

print("Dark mode patches applied!")
