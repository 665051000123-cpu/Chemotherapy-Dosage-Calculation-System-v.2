import sys

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('id="history-print-area"')
if idx != -1:
    with open('scratch/temp5.txt', 'w', encoding='utf-8') as out:
        out.write(content[idx-100:idx+3000])
