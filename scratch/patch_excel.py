import codecs

f = codecs.open('client/src/components/CalculationHistory.jsx', 'r', 'utf-8').read()

import1 = "import { History, Filter, Calendar, Printer, Edit2, Activity, Trash2, Pill, AlertTriangle, ArrowLeft } from 'lucide-react';"
import2 = "import { History, Filter, Calendar, Printer, Edit2, Activity, Trash2, Pill, AlertTriangle, ArrowLeft, Download } from 'lucide-react';\nimport * as XLSX from 'xlsx';"
f = f.replace(import1, import2)

ret1 = '    return (\n'
export_fn = '''    const handleExportExcel = () => {
        const dataToExport = filteredLogs.map(log => ({
            'H.N.': log.hn,
            'ชื่อผู้ป่วย': log.patient_name,
            'เพศ': log.gender === 'male' ? 'ชาย' : log.gender === 'female' ? 'หญิง' : log.gender,
            'อายุ (ปี)': log.age,
            'วันที่': log.timestamp,
            'น้ำหนัก (kg)': log.weight,
            'ส่วนสูง (cm)': log.height,
            'BSA (m²)': log.calculated_bsa,
            'CrCl (mL/min)': log.calculated_crcl,
            'หอผู้ป่วย': log.ward,
            'สูตรเคมีบำบัด': log.drugs_used,
            'วิธีการคำนวณ': log.formula_used,
            'ขนาดยาสุทธิ': log.prescribed_dose,
            'แพทย์ผู้สั่ง': log.doctor,
            'ผู้บันทึก': log.user_name,
            'ผลแล็บอื่นๆ': log.other_lab,
            'ประวัติแพ้ยา': log.allergies
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'History');
        const colWidths = [
            { wch: 10 }, { wch: 25 }, { wch: 8 }, { wch: 8 }, { wch: 20 },
            { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 15 },
            { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 25 }
        ];
        ws['!cols'] = colWidths;
        XLSX.writeFile(wb, f"Calculation_History_{{new Date().toISOString().split('T')[0]}}.xlsx"); // Using f string just because... actually let's use JS backticks
    };'''
# Fix the JS backticks for python f-string avoidance
export_fn = export_fn.replace('f"Calculation_History_', '`Calculation_History_${new Date().toISOString().split(\'T\')[0]}.xlsx`')
export_fn = export_fn.replace('.xlsx"); // Using f string just because... actually let\'s use JS backticks', ';')

f = f.replace(ret1, export_fn + '\n' + ret1)

btn1 = '<button\n                                        onClick={() => setShowFilterPanel(!showFilterPanel)}'
btn2 = '''<button
                                        onClick={handleExportExcel}
                                        className="py-2 px-4 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all duration-300 whitespace-nowrap bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                                    >
                                        <Download size={15} /> Export Excel
                                    </button>
                                    <button
                                        onClick={() => setShowFilterPanel(!showFilterPanel)}'''
f = f.replace(btn1, btn2)

print_btn1 = '<button onClick={printHistory} className="no-print bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold py-2 px-4 rounded-xl border border-slate-700 flex items-center gap-2 text-sm transition-all active:scale-95 shadow-lg whitespace-nowrap">\n                                             <Printer size={16} />'
export_ind = '''<button onClick={() => {
                                                const dataToExport = hnLogs.map(log => ({
                                                    'H.N.': log.hn,
                                                    'วันที่': log.timestamp,
                                                    'BSA': log.calculated_bsa,
                                                    'สูตรที่ใช้': log.drugs_used,
                                                    'ขนาดยา': log.prescribed_dose
                                                }));
                                                const ws = XLSX.utils.json_to_sheet(dataToExport);
                                                const wb = XLSX.utils.book_new();
                                                XLSX.utils.book_append_sheet(wb, ws, 'HN_'+selectedHnDetail);
                                                XLSX.writeFile(wb, `HN_${selectedHnDetail}_History.xlsx`);
                                         }} className="no-print bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold py-2 px-4 rounded-xl border border-emerald-200 flex items-center gap-2 text-sm transition-all active:scale-95 shadow-sm whitespace-nowrap">
                                             <Download size={16} /> Export
                                         </button>\n                                         '''
f = f.replace(print_btn1, export_ind + print_btn1)

codecs.open('client/src/components/CalculationHistory.jsx', 'w', 'utf-8').write(f)
print('Patch complete')
