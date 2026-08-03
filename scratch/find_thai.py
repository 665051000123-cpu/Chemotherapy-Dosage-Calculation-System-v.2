import codecs
content = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()
thai_chars = set(c for c in content if '\u0e00' <= c <= '\u0e7f')
with codecs.open('scratch/thai_chars.txt', 'w', 'utf-8') as f:
    for c in sorted(thai_chars):
        f.write(f"{c} {hex(ord(c))} {hex(ord(c.encode('utf-8').decode('cp437')[2]))}\n")
