import re

with open('client/src/components/DrugsInfo.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "CODE (Drug Code)": "รหัสยา (Drug Code)",
    "Dose Cap (mg)": "จำกัดขนาดยาสูงสุด (Dose Cap mg)",
    "Max BSA Cap (m²)": "จำกัดพื้นที่ผิวร่างกายสูงสุด (Max BSA m²)",
    "MAX CrCl CAP (ml/min)": "จำกัดค่าการทำงานไตสูงสุด (Max CrCl ml/min)",
    "Diluent Incompat.": "ยาที่ห้ามผสมร่วมกัน (Incompat.)",
    ">Dose Cap<": ">จำกัดปริมาณยาสูงสุด (Dose Cap)<",
    ">CrCl CAP<": ">จำกัดค่าไต (CrCl Cap)<",
    "ยาที่มี Dose Cap": "ยาที่มีการจำกัดปริมาณยาสูงสุด (Dose Cap)"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('client/src/components/DrugsInfo.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Labels patched successfully.")
