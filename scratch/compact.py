import sys
import re

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. card padding
content = content.replace('p-5 px-8 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)]', 'p-3 px-5 rounded-2xl shadow-lg')
content = content.replace('gap-5 premium-card', 'gap-4 premium-card')

# 2. Icon size
content = content.replace('w-16 h-16 rounded-2xl bg-gradient-to-br', 'w-10 h-10 rounded-xl bg-gradient-to-br')
content = content.replace('<User size={32} className="text-white" />', '<User size={20} className="text-white" />')

# 3. Name text size
content = content.replace('text-2xl font-black leading-tight', 'text-xl font-black leading-tight')

# 4. Buttons container flex-wrap -> flex-nowrap
content = content.replace('flex items-center gap-3 flex-wrap transition-all', 'flex items-center gap-3 flex-nowrap whitespace-nowrap transition-all')

# 5. Fix text-xs font-black uppercase mb-1
content = content.replace('block mb-1', 'block mb-0')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Card minimized")
