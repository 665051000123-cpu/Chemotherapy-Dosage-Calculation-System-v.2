import codecs
filepath = 'client/src/App.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'InventoryManagement' in l or 'showInventory' in l:
        print(f"Line {i+1}: {l.strip()}")
