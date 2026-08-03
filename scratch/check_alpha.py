import codecs
content = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()
import re
matches = re.findall(r'α.*', content)
with codecs.open('scratch/alpha_matches.txt', 'w', 'utf-8') as f:
    for m in matches[:5]:
        f.write(repr(m) + '\n')
        # Also print hex values of each char
        f.write(' '.join(hex(ord(c)) for c in m) + '\n')
