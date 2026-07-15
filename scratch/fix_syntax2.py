import sys
import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'(</div>\s*)(<button onClick=\{\(\) => setTheme\(theme === \'dark\')',
    r'\1)}\n\n            \2',
    content
)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax error!")
