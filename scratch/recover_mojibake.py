import codecs
import re

# Read the corrupted file
with codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8') as f:
    content = f.read()

# Function to fix cp437 mojibake
def fix_cp437_match(match):
    mojibake = match.group(0)
    try:
        # Encode back to cp437 to get the original utf-8 bytes
        original_bytes = mojibake.encode('cp437')
        # Decode as utf-8 to get the Thai string
        return original_bytes.decode('utf-8')
    except:
        return mojibake

# The regex looks for sequences of cp437 characters that represent Thai UTF-8.
# Thai UTF-8 starts with E0 (α in cp437), then B8 (╕) or B9 (╣), then another byte.
# So we look for sequences of 3 or more cp437 characters.
# Actually, since all 256 bytes are valid in cp437, we can just find any character 
# that is part of the cp437 set and try to decode it.
# Let's be specific: look for sequences starting with α (E0)
# A Thai character in UTF-8 is 3 bytes: E0 B8 xx or E0 B9 xx
# So we look for (α[╕╣][\x00-\xFF])
pattern = re.compile(r'(\u03b1[\u2558\u2563].)+')

fixed_content = pattern.sub(fix_cp437_match, content)

# There is also the patch_excel.py mojibake:
# ',S,1^,-,o,11%,>1^, ,'
excel_replacements = {
    "',S,1^,-,o,11%,>1^, ,': log.patient_name,": "'ชื่อผู้ป่วย': log.patient_name,",
    "'1?,z,\"': log.gender === 'male' ? ',S,,' : log.gender === 'female' ? ',,?,',' : log.gender,": "'เพศ': log.gender === 'male' ? 'ชาย' : log.gender === 'female' ? 'หญิง' : log.gender,",
    "',-,,,, (,>,)': log.age,": "'อายุ (ปี)': log.age,",
    "', ,,T,-,1^': log.timestamp,": "'วันที่คำนวณ': log.timestamp,",
    "',T1%,3,,T,,? (kg)': log.weight,": "'น้ำหนัก (kg)': log.weight,",
    "',1^, ,T,,1, (cm)': log.height,": "'ส่วนสูง (cm)': log.height,",
    "'BSA (mA)': log.calculated_bsa,": "'BSA (m²)': log.calculated_bsa,",
    "'CrCl (mL/min)': log.calculated_crcl,": "'CrCl (mL/min)': log.calculated_crcl,",
    "',,-,o,11%,>1^, ,': log.ward,": "'หอผู้ป่วย': log.ward,",
    "',,1, ,1?,,,,,s,3,s,,\"': log.drugs_used,": "'ยามะเร็งที่ได้รับ': log.drugs_used,",
    "', ,',~,,?,,,,,3,T, ,\"': log.formula_used,": "'สูตรเคมีบำบัด': log.formula_used,",
    "',,,T,,\",,,,,,-,~,'': log.prescribed_dose,": "'ขนาดยาที่สั่ง': log.prescribed_dose,",
    "'1?,z,-,1O,o,11%,,1^,': log.doctor,": "'แพทย์ผู้สั่งยา': log.doctor,",
    "',o,11%,s,,T,-, ,?': log.user_name,": "'ผู้บันทึก': log.user_name,",
    "',o,1?,1؅,s,-,1^,T1+': log.other_lab,": "'ผลแลปอื่นๆ': log.other_lab,",
    "',>,,, ,, ,'1?,z1%,,': log.allergies": "'ประวัติแพ้ยา': log.allergies"
}

for bad, good in excel_replacements.items():
    fixed_content = fixed_content.replace(bad, good)

# Also fix the second excel export button
fixed_content = fixed_content.replace("', ,,T,-,1^': log.timestamp,", "'วันที่คำนวณ': log.timestamp,")
fixed_content = fixed_content.replace("',,1, ,,-,1^1,S1%': log.drugs_used,", "'ยาที่สั่ง': log.drugs_used,")
fixed_content = fixed_content.replace("',,,T,,\",,': log.prescribed_dose", "'ขนาดยา': log.prescribed_dose")


with codecs.open('client/src/components/CalculationHistory.jsx', 'w', 'utf-8') as f:
    f.write(fixed_content)

print("Recovered mojibake!")
