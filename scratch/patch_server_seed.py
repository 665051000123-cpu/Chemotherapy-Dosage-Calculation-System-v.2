import re

with open('oncology-backend/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

seed_function = """
// --- Seed Drug Rules ---
const seedDrugRules = async () => {
    try {
        const count = await DrugRule.count();
        if (count === 0) {
            console.log('Seeding initial drug rules...');
            const initialRules = [
                {
                    "drugName": "5-FU",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: 5-FU",
                    "desc": "❌ ห้ามผสมรวมในถุง/สายเดียวกับ Leucovorin (ตกตะกอน)\\n⚠️ ห้ามผสมรวมในถุง/สายเดียวกับ Leucovorin (ตกตะกอน)"
                },
                {
                    "drugName": "6-MP",
                    "keywords": ["*"],
                    "title": "คำเตือนการให้ยา: 6-MP",
                    "desc": "❌ ห้ามนำมาผสมฉีด\\n⚠️ เป็นยาเม็ดสำหรับกินเท่านั้น"
                },
                {
                    "drugName": "6-Thioguanine",
                    "keywords": ["*"],
                    "title": "คำเตือนการให้ยา: 6-Thioguanine",
                    "desc": "❌ ห้ามนำมาผสมฉีด\\n⚠️ เป็นยาเม็ดสำหรับกินเท่านั้น"
                },
                {
                    "drugName": "Actinomycin-D",
                    "keywords": ["bacteriostatic", "กันเสีย"],
                    "title": "คำเตือนการให้ยา: Actinomycin-D",
                    "desc": "❌ ห้ามใช้ WFI ที่มีสารกันเสีย\\n⚠️ ละลายด้วย WFI ก่อน แล้วเจือจางต่อด้วย NSS หรือ D5W"
                },
                {
                    "drugName": "Asparaginase",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Asparaginase",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ตอนละลายห้ามเขย่าแรง (ทำให้เกิดฟองและยาเสื่อมสภาพ) ให้หมุนขวดเบาๆ"
                },
                {
                    "drugName": "Bevacizumab (Avastin)",
                    "keywords": ["d5w", "dextrose", "d5"],
                    "title": "คำเตือนการให้ยา: Bevacizumab (Avastin)",
                    "desc": "❌ ห้ามใช้ D5W เด็ดขาด\\n⚠️ สารน้ำน้ำตาลจะทำลายโครงสร้างโปรตีนของยา"
                },
                {
                    "drugName": "Bleomycin",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Bleomycin",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ แนะนำ NSS เพื่อความคงตัว (เสถียรน้อยใน D5W)"
                },
                {
                    "drugName": "Bortezomib (VELCADE)",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Bortezomib (VELCADE)",
                    "desc": "❌ ห้ามใช้ตัวทำละลายอื่น\\n⚠️ ต้องใช้ NSS ในปริมาณที่กำหนดเป๊ะๆ ในการละลาย"
                },
                {
                    "drugName": "Capecitabine",
                    "keywords": ["*"],
                    "title": "คำเตือนการให้ยา: Capecitabine",
                    "desc": "❌ ห้ามนำมาผสมฉีด\\n⚠️ เป็นยาเม็ดสำหรับกินหลังอาหาร"
                },
                {
                    "drugName": "Carboplatin",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Carboplatin",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ห้ามใช้เข็มหรืออุปกรณ์ที่มีอลูมิเนียม (Aluminum) ยาจะดำและตกตะกอน"
                },
                {
                    "drugName": "CCNU",
                    "keywords": ["*"],
                    "title": "คำเตือนการให้ยา: CCNU",
                    "desc": "❌ ห้ามนำมาผสมฉีด\\n⚠️ เป็นยาแคปซูลสำหรับกิน"
                },
                {
                    "drugName": "Cisplatin",
                    "keywords": ["d5w", "dextrose", "d5"],
                    "title": "คำเตือนการให้ยา: Cisplatin",
                    "desc": "❌ ห้ามใช้ D5W เพียวๆ\\n⚠️ ต้องมี Chloride ในสารน้ำเสมอ ไม่งั้นจะเกิดพิษต่อไตสูงมาก ห้ามใช้อุปกรณ์อลูมิเนียม"
                },
                {
                    "drugName": "Cotrimoxazole",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Cotrimoxazole",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ยาตกตะกอนง่ายมาก ต้องผสมตามสัดส่วนปริมาตรน้ำที่กำหนดในเอกสารอย่างเคร่งครัด"
                },
                {
                    "drugName": "Cyclophosphamide",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Cyclophosphamide",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ละลายยากมาก ต้องใช้เวลาละลายนาน"
                },
                {
                    "drugName": "Cytarabine (Ara-C)",
                    "keywords": ["bacteriostatic", "กันเสีย", "benzyl"],
                    "title": "คำเตือนการให้ยา: Cytarabine (Ara-C)",
                    "desc": "❌ ห้ามใช้สารละลายที่มี Benzyl alcohol สำหรับการฉีดเข้าไขสันหลัง (IT)\\n⚠️ สำหรับ High dose ไม่ควรใช้ตัวทำละลายที่มีสารกันเสีย"
                },
                {
                    "drugName": "Dacarbazine (DTIC)",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Dacarbazine (DTIC)",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ยาไวต่อแสงมาก ต้องป้องกันแสงระหว่างให้ยา ยาอาจเปลี่ยนเป็นสีชมพูหากโดนแสง"
                },
                {
                    "drugName": "Docetaxel",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Docetaxel",
                    "desc": "❌ ห้ามใช้อุปกรณ์ PVC\\n⚠️ ใช้ภาชนะ/สายให้ยาที่เป็น Non-PVC (DEHP-free) เท่านั้น"
                },
                {
                    "drugName": "Doxorubicin",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Doxorubicin",
                    "desc": "❌ ห้ามใช้ร่วมกับ Heparin หรือ 5-FU\\n⚠️ เป็น Vesicant รุนแรง ระวังยาออกนอกเส้นเลือด"
                },
                {
                    "drugName": "Etoposide",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Etoposide",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ต้องระวังเรื่องความเข้มข้น ห้ามเข้มข้นเกิน 0.4 mg/mL ไม่งั้นจะตกตะกอน (ยกเว้นบางยี่ห้อที่อนุญาต)"
                },
                {
                    "drugName": "Fludarabine",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Fludarabine",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ห้ามผสมกับยาอื่นในสายเดียวกัน"
                },
                {
                    "drugName": "Gemcitabine",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Gemcitabine",
                    "desc": "❌ ห้ามแช่เย็นหลังละลาย\\n⚠️ การแช่เย็นจะทำให้ยาตกตะกอน"
                },
                {
                    "drugName": "Hydroxyurea",
                    "keywords": ["*"],
                    "title": "คำเตือนการให้ยา: Hydroxyurea",
                    "desc": "❌ ห้ามนำมาผสมฉีด\\n⚠️ เป็นยาแคปซูลสำหรับกิน"
                },
                {
                    "drugName": "Idarubicin",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Idarubicin",
                    "desc": "❌ ห้ามผสมกับ Heparin\\n⚠️ ตกตะกอนทันทีถ้าเจอ Heparin เป็น Vesicant รุนแรง"
                },
                {
                    "drugName": "Ifosfamide",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Ifosfamide",
                    "desc": "❌ ควรระวังเป็นพิเศษ\\n⚠️ ต้องให้ร่วมกับ Mesna เสมอเพื่อป้องกันกระเพาะปัสสาวะอักเสบเลือดออก"
                },
                {
                    "drugName": "Irinotecan",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Irinotecan",
                    "desc": "❌ ห้ามใช้สารน้ำที่มีความเป็นด่าง\\n⚠️ ยาจะเสื่อมสภาพ แนะนำใช้ D5W ดีที่สุด"
                },
                {
                    "drugName": "Methotrexate",
                    "keywords": ["bacteriostatic", "กันเสีย"],
                    "title": "คำเตือนการให้ยา: Methotrexate",
                    "desc": "❌ สำหรับ High dose หรือ IT ห้ามใช้สารละลายที่มีสารกันเสีย\\n⚠️ ต้องเป็นแบบ Preservative-free เท่านั้น"
                },
                {
                    "drugName": "Mitomycin",
                    "keywords": ["d5w", "dextrose"],
                    "title": "คำเตือนการให้ยา: Mitomycin",
                    "desc": "❌ ห้ามใช้ D5W\\n⚠️ ยาไม่คงตัวในสารละลายกรด (D5W) ให้ใช้ NSS เป็นหลัก"
                },
                {
                    "drugName": "Oxaliplatin",
                    "keywords": ["nss", "n/s", "saline", "sodium chloride"],
                    "title": "คำเตือนการให้ยา: Oxaliplatin",
                    "desc": "❌ ห้ามใช้ NSS หรือสารละลายที่มี Chloride เด็ดขาด\\n⚠️ ตัวยาจะพังทันที ต้องใช้ D5W เท่านั้น ห้ามใช้อุปกรณ์อลูมิเนียม"
                },
                {
                    "drugName": "Paclitaxel",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Paclitaxel",
                    "desc": "❌ ห้ามใช้อุปกรณ์ PVC\\n⚠️ ใช้ภาชนะ/สายให้ยาที่เป็น Non-PVC (DEHP-free) และต้องมี in-line filter (0.22 ไมครอน) เสมอ"
                },
                {
                    "drugName": "Pemetrexed (ALIMTA)",
                    "keywords": ["d5w", "dextrose"],
                    "title": "คำเตือนการให้ยา: Pemetrexed (ALIMTA)",
                    "desc": "❌ ห้ามใช้ D5W\\n⚠️ ต้องละลายและผสมใน NSS เท่านั้น (เฉพาะ Preservative-free NSS)"
                },
                {
                    "drugName": "Rituximab (MabThera)",
                    "keywords": [],
                    "title": "คำเตือนการให้ยา: Rituximab (MabThera)",
                    "desc": "❌ ห้ามเขย่า\\n⚠️ ระวังการเกิดฟอง ห้ามให้แบบ IV push เด็ดขาด"
                },
                {
                    "drugName": "Trastuzumab (Herceptin)",
                    "keywords": ["d5w", "dextrose", "d5"],
                    "title": "คำเตือนการให้ยา: Trastuzumab (Herceptin)",
                    "desc": "❌ ห้ามใช้ D5W เด็ดขาด\\n⚠️ โปรตีนจะพัง ให้เจือจางใน NSS เท่านั้น"
                },
                {
                    "drugName": "Vincristine",
                    "keywords": ["it", "intrathecal"],
                    "title": "คำเตือนการให้ยา: Vincristine",
                    "desc": "❌ ห้ามฉีดเข้าไขสันหลัง (Intrathecal) เด็ดขาด\\n⚠️ อันตรายถึงชีวิต (Fatal if given intrathecally) เป็นยา Vesicant"
                }
            ];
            await DrugRule.bulkCreate(initialRules);
            console.log('Seeding complete.');
        }
    } catch (e) {
        console.error('Error seeding drug rules:', e);
    }
};
// ----------------------
"""

if "// --- Seed Drug Rules ---" not in content:
    content = content.replace("app.listen(port,", seed_function + "\n    await seedDrugRules();\n    app.listen(port,")

with open('oncology-backend/server.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("server.js patched for seeding drug rules.")
