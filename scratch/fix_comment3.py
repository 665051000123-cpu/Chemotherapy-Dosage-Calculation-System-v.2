import sys

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the comment causing syntax error
content = content.replace('{/* Profile & Menu Container */}', '')

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed comment syntax error!")
