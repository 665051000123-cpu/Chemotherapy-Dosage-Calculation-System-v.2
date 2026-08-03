import codecs

content = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()

replacements = {
    'ผู้บันทึกα╕ùα╕▒้α╕çα╕½α╕íα╕ö': 'ผู้บันทึกทั้งหมด',
    'α╕Ñ้α╕▓α╕çตัวกรอง': 'ล้างตัวกรอง',
    'α╕Ñα╕Üรายการα╕Üα╕▒α╕Öα╕ùα╕╢α╕üα╕¢α╕úα╕░α╕ºα╕▒α╕òα╕┤α╕Öα╕╡้': 'ลบรายการบันทึกประวัตินี้',
    'ไα╕í่α╕íα╕╡ประวัติแพ้ยา': 'ไม่มีประวัติแพ้ยา'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with codecs.open('client/src/components/CalculationHistory.jsx', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed leftovers!")
