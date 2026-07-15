import sys

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Helper to inject code right after a specific axios call
def inject_after_axios(content, search_text, insert_text):
    idx = 0
    while True:
        idx = content.find(search_text, idx)
        if idx == -1:
            break
        # find the end of the statement (the semicolon or closing parenthesis of the axios call)
        end_idx = content.find('});', idx)
        if end_idx != -1:
            end_idx += 3 # skip '});'
            if insert_text not in content[idx:end_idx + 500]:
                content = content[:end_idx] + '\n' + insert_text + content[end_idx:]
        idx = end_idx
    return content

# 1. Sticker
sticker_insert = '''
                            addOfflinePrintHistory({
                                type: 'sticker',
                                title: `พิมพ์สติ๊กเกอร์ - ${patient?.name || patientName || 'ไม่ระบุชื่อ'}`,
                                htmlContent: htmlContent,
                                printerName: user.default_printer,
                                paperSize: 'Sticker'
                            });'''
content = inject_after_axios(content, "printerName: user.default_printer,", sticker_insert)

# 2. Working Formula
wf_insert = '''
                        addOfflinePrintHistory({
                            type: 'working_formula',
                            title: `พิมพ์ใบเตรียมยา - ${patient?.name || 'ไม่ระบุชื่อ'}`,
                            htmlContent: htmlContent,
                            printerName: user.working_formula_printer,
                            paperSize: 'A4'
                        });'''
content = inject_after_axios(content, "printerName: user.working_formula_printer,", wf_insert)

# 3. Calculation
calc_insert = '''
                        addOfflinePrintHistory({
                            type: 'calculation',
                            title: `พิมพ์ผลการคำนวณ - ${patient?.name || 'ไม่ระบุชื่อ'}`,
                            htmlContent: htmlContent,
                            printerName: user.calculation_printer,
                            paperSize: 'A4'
                        });'''
content = inject_after_axios(content, "printerName: user.calculation_printer,", calc_insert)

# 4. Drug Info
drug_insert = '''
                        addOfflinePrintHistory({
                            type: 'drug_info',
                            title: `พิมพ์ข้อมูลยา`,
                            htmlContent: htmlContent,
                            printerName: user.drug_info_printer,
                            paperSize: 'A4',
                            isA4: true
                        });'''
content = inject_after_axios(content, "printerName: user.drug_info_printer,", drug_insert)

# 5. All Drugs List
all_drugs_insert = '''
                        addOfflinePrintHistory({
                            type: 'all_drugs',
                            title: `พิมพ์รายการยาทั้งหมด`,
                            htmlContent: htmlContent,
                            printerName: user.all_drugs_printer,
                            paperSize: 'A4',
                            isA4: true
                        });'''
content = inject_after_axios(content, "printerName: user.all_drugs_printer,", all_drugs_insert)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Phase 2 done')
