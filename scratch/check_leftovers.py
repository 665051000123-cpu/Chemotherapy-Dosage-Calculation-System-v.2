import codecs
content = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()
leftovers = [line.strip() for line in content.split('\n') if 'α' in line]
with codecs.open('scratch/leftovers.txt', 'w', 'utf-8') as f:
    for l in leftovers:
        f.write(l + '\n')
