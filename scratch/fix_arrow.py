import codecs

content = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()

target = "ArrowLeft, Download } from 'lucide-react';"
replacement = "ArrowLeft, ArrowRight, Download } from 'lucide-react';"

content = content.replace(target, replacement)
codecs.open('client/src/components/CalculationHistory.jsx', 'w', 'utf-8').write(content)
print("ArrowRight imported")
