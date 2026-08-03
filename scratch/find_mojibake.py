import codecs, re
content = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()
matches = set(re.findall(r'[\u0370-\u03FF\u2000-\u206F]+.*?[\u0370-\u03FF\u2000-\u206F]+', content))
with codecs.open('scratch/mojibake.txt', 'w', 'utf-8') as f:
    for m in list(matches):
        f.write(repr(m) + '\n')
print("Done")
