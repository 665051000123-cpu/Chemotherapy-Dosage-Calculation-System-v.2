import codecs
s = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()
with codecs.open('scratch/chars.txt', 'w', 'utf-8') as f:
    f.write(s[950:980])
    # Also find exactly which characters fail to encode in cp1252
    for i, c in enumerate(s):
        try:
            c.encode('cp1252')
        except:
            f.write(f"\nFailed at {i}: {repr(c)}")
