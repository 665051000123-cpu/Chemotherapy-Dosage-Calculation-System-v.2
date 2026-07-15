import sys

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the missing )}
# Search for the newly injected block, and append )} at the end of it, right before the Theme button.
idx_theme = content.find('            <button onClick={() => setTheme(theme === \\\'dark\\\' ? \\\'light\\\' : \\\'dark\\\')}')

if idx_theme != -1:
    content = content[:idx_theme] + '              )}\n\n' + content[idx_theme:]
    with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed syntax error!")
else:
    print("Could not find theme button")
