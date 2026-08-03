import codecs

content = codecs.open('client/src/App.jsx', 'r', 'utf-8').read()
start_marker = '<div className="flex items-center gap-3 mb-6">'
start_idx = content.find(start_marker)

if start_idx != -1:
    end_marker = '{/* Lab Results */}'
    end_idx = content.find(end_marker, start_idx)
    if end_idx != -1:
        print(f"Found chunk! length: {end_idx - start_idx}")
        # print first 10 lines
        chunk = content[start_idx:end_idx]
        print('\n'.join(chunk.split('\n')[:10]))
    else:
        print("End marker not found")
else:
    print("Start marker not found")
