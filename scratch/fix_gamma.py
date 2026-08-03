import codecs

content = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()

replacements = {
    'ΓÖÇ': '♀',
    'ΓÖé': '♂',
    'ΓÜá∩╕Å': '⚠️'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with codecs.open('client/src/components/CalculationHistory.jsx', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed gamma leftovers!")
