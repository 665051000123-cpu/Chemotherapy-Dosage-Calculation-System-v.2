import sys

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. add state
state_str = "    const [showUserMenu, setShowUserMenu] = useState(false);\n"
if 'showUserMenu' not in content:
    idx = content.find('const [showPrinterSettings, setShowPrinterSettings] = useState(false);')
    content = content[:idx] + state_str + content[idx:]

# 2. Add ChevronDown icon to lucide-react if needed
if 'ChevronDown' not in content and 'lucide-react' in content:
    content = content.replace('import { User, ', 'import { User, ChevronDown, ChevronUp, ')

# 3. Replace the premium-card structure
old_card_start = 'className="absolute top-6 left-6 flex items-center gap-5 premium-card p-5 px-8 rounded-3xl \nshadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] z-50 animate-row-in no-print backdrop-blur-xl border-sky-500/50"'
# the whitespace might be different, let's just find "absolute top-6 left-6"
idx = content.find('absolute top-6 left-6')
if idx != -1:
    # find the previous className="
    class_idx = content.rfind('className="', 0, idx)
    # find the closing quote of className
    end_class_idx = content.find('"', idx)
    
    # We want to change the premium card to be cursor-pointer maybe, but let's just make the profile part clickable.
    # Actually, we can just replace the whole block up to the flex buttons.
    
    # Let's find <div className="flex items-center gap-3 mt-1.5 flex-wrap">
    buttons_div_idx = content.find('className="flex items-center gap-3 mt-1.5 flex-wrap"')
    
    if buttons_div_idx != -1:
        # replace className="flex items-center gap-3 mt-1.5 flex-wrap"
        # with className={`flex items-center gap-3 mt-1.5 flex-wrap transition-all duration-300 ${showUserMenu ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}
        new_class = 'className={`flex items-center gap-3 flex-wrap transition-all duration-300 ${showUserMenu ? \'opacity-100 max-h-20 mt-1.5\' : \'opacity-0 max-h-0 overflow-hidden mt-0 border-none\'}`}'
        content = content[:buttons_div_idx] + new_class + content[buttons_div_idx + len('className="flex items-center gap-3 mt-1.5 flex-wrap"'):]
        
        # Now make the top part clickable
        # Find the <div className="flex flex-col"> right before the user name
        name_div_idx = content.rfind('<div className="flex flex-col">', 0, buttons_div_idx)
        # We can add onClick to this div, or better, the whole premium card
        # Let's add onClick to the card wrapper.
        
        # Find the start of the card
        card_div_idx = content.rfind('<div className="absolute top-6 left-6', 0, name_div_idx)
        if card_div_idx != -1:
            # insert cursor-pointer into the card's className
            insert_pos = content.find('"', content.find('className="', card_div_idx) + 12)
            content = content[:insert_pos] + ' cursor-pointer' + content[insert_pos:]
            
            # insert onClick={() => setShowUserMenu(!showUserMenu)}
            # right after className="..."
            # wait, end_class_idx was original, let's just find the end of className again
            curr_class_end = content.find('"', content.find('className="', card_div_idx) + 12) + 1
            onClick_str = ' onClick={() => setShowUserMenu(!showUserMenu)} '
            content = content[:curr_class_end] + onClick_str + content[curr_class_end:]

            # Add a chevron icon next to the user name
            user_name_end = content.find('</p>', name_div_idx)
            if user_name_end != -1:
                chevron_str = '{showUserMenu ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" /> }'
                # wrap the <p> and the chevron in a flex div
                p_start = content.rfind('<p', 0, user_name_end)
                content = content[:p_start] + '<div className="flex items-center gap-2">' + content[p_start:user_name_end+4] + chevron_str + '</div>' + content[user_name_end+4:]


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done modifying App.jsx')
