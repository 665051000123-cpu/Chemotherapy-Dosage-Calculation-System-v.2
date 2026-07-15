import sys

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''<div className="flex items-center gap-2"><p className={`text-2xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.name || user.username}</p>{showUserMenu ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" /> }</div>'''

target2 = '''<div className={`flex items-center gap-3 flex-wrap transition-all duration-500 overflow-hidden ${showUserMenu ? 'opacity-100 max-h-20 max-w-6xl mt-1.5' : 'opacity-0 max-h-0 max-w-0 mt-0 border-none'}`}>'''

if target1 in content and target2 in content:
    idx1 = content.find(target1)
    
    # We wrap target1 and the buttons container in a flex row
    # Also we modify target2 to not have mt-1.5 but ml-2
    new_target2 = target2.replace('mt-1.5', 'ml-2').replace('mt-0', 'ml-0')
    
    # We need to find the end of target2's block to close the new wrapper div.
    # target2 contains the buttons. The buttons end with:
    end_buttons_str = '''                              )}
                          </div>'''
    idx_end = content.find(end_buttons_str, idx1)
    
    if idx_end != -1:
        idx_end_div = idx_end + len(end_buttons_str)
        
        # Now construct the new HTML
        new_html = '<div className="flex items-center gap-2">\n                          ' + target1 + '\n                          ' + new_target2
        
        # replace the original parts
        # wait, we can just replace target1 with `<div className="flex items-center gap-2">\n` + target1
        # and replace target2 with new_target2
        # and insert `</div>` at idx_end_div
        
        content = content[:idx_end_div] + '\n                          </div>' + content[idx_end_div:]
        content = content.replace(target2, new_target2)
        content = content.replace(target1, '<div className="flex items-center gap-2">\n                          ' + target1)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated structure to horizontal")
    else:
        print("Could not find end of buttons block")
else:
    print("Could not find target1 or target2")
