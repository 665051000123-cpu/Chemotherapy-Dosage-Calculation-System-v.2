import sys

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the buttons div
buttons_div_start = content.find('<div className={`flex items-center gap-3 flex-wrap transition-all duration-300 ${showUserMenu ?')

if buttons_div_start != -1:
    # Replace the conditional classes with a simpler one and wrap it in a conditional render
    
    # We need to find where this div ends. 
    # It ends right before the closing tag of the <div className="flex flex-col">
    # Let's find the end of this div manually or replace the exact class string
    
    target_class_str = "className={`flex items-center gap-3 flex-wrap transition-all duration-300 ${showUserMenu ? 'opacity-100 max-h-20 mt-1.5' : 'opacity-0 max-h-0 overflow-hidden mt-0 border-none'}`}"
    
    new_class_str = "className={`flex items-center gap-3 flex-wrap transition-all duration-500 overflow-hidden ${showUserMenu ? 'opacity-100 max-h-20 max-w-6xl mt-1.5' : 'opacity-0 max-h-0 max-w-0 mt-0 border-none'}`}"
    
    content = content.replace(target_class_str, new_class_str)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated width transition')
else:
    print('Could not find buttons div')
