import React from 'react';
import { History, Filter, Calendar, Printer, Edit2, Activity, Trash2, Pill, AlertTriangle, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function CalculationHistory({
    theme,
    user,
    filteredLogs,
    handleBackFromHistory,
    showFilterPanel,
    setShowFilterPanel,
    searchQuery,
    setSearchQuery,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    handleDateInputChange,
    formulaFilter,
    setFormulaFilter,
    uniqueFormulas,
    pharmacistFilter,
    setPharmacistFilter,
    uniquePharmacists,
    selectedHnDetail,
    setSelectedHnDetail,
    printHistory,
    handleUpdatePatientName,
    handleDeleteLog,
    sanitizeNaN,
    patient,
    pastToxicities,
    setStep
}) {
    const handleExportExcel = () => {
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
        XLSX.writeFile(wb, `Calculation_History_${new Date().toISOString().split('T')[0]}.xlsx`);
    };
    return (

                    <div className="animate-row-in space-y-6">
                        <div id="history-print-area" className="max-w-7xl mx-auto premium-card p-6 md:p-8 relative">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-700/10">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleBackFromHistory}
                                        className="p-2.5 rounded-xl border border-slate-700/30 hover:bg-slate-700/10 transition-all cursor-pointer text-slate-400 dark:text-slate-500 hover:text-white mr-2 no-print"
                                        title="ย้อนกลับ"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <h1 className="text-3xl font-black flex items-center gap-2 text-slate-800 dark:text-white dark:text-white">
                                            <History size={28} className="text-sky-400 print-hide" /> รายงานบันทึกประวัติการคำนวณ
                                        </h1>
                                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">ประวัติและบันทึกข้อมูลการคำนวณขนาดยาเคมีบำบัดของผู้ป่วย</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 no-print w-full md:w-auto">
                                    <button
                                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                                        className={`py-2 px-4 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all duration-300 whitespace-nowrap ${showFilterPanel
                                            ? 'bg-sky-600 border-sky-400 text-white shadow-md'
                                            : theme === 'dark'
                                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                : 'bg-white dark:bg-slate-800 border-slate-300 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-800 shadow-sm'
                                            }`}
                                    >
                                        <Filter size={15} /> {showFilterPanel ? 'ปิดตัวกรอง' : 'ตัวกรอง (Filters)'}
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="ค้นหา H.N. / ชื่อคนไข้..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="form-control py-2 px-4 text-sm rounded-xl border border-slate-700/30 font-bold focus:border-sky-500 w-[240px]"
                                    />
                                </div>
                            </div>

                            {showFilterPanel && (
                                <div className={`no-print p-5 rounded-2xl border mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pop ${theme === 'dark'
                                    ? 'bg-slate-900/60 border-slate-800'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 shadow-inner'
                                    }`}>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase">วันที่เริ่มต้น (Start Date)</label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="text"
                                                placeholder="วว/ดด/ปปปป"
                                                value={startDateFilter}
                                                onChange={e => handleDateInputChange(e.target.value, startDateFilter, setStartDateFilter)}
                                                className="form-control py-1.5 pl-3 pr-8 text-xs rounded-xl font-bold w-full"
                                                maxLength={10}
                                            />
                                            <input
                                                type="date"
                                                className="absolute left-0 right-0 top-0 bottom-0 opacity-0 cursor-pointer w-full h-full"
                                                onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                                                value={(() => {
                                                    if (startDateFilter && startDateFilter.length === 10) {
                                                        const d = startDateFilter.substring(0, 2);
                                                        const m = startDateFilter.substring(3, 5);
                                                        const yNum = parseInt(startDateFilter.substring(6, 10), 10);
                                                        if (!isNaN(yNum)) {
                                                            const gYear = yNum > 2400 ? yNum - 543 : yNum;
                                                            return `${gYear}-${m}-${d}`;
                                                        }
                                                    }
                                                    return '';
                                                })()}
                                                onChange={(e) => {
                                                    if (!e.target.value) return;
                                                    const [y, m, d] = e.target.value.split('-');
                                                    const thaiYear = parseInt(y, 10) < 2400 ? parseInt(y, 10) + 543 : parseInt(y, 10);
                                                    handleDateInputChange(`${d}/${m}/${thaiYear}`, startDateFilter, setStartDateFilter);
                                                }}
                                            />
                                            <Calendar size={14} className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase">วันที่สิ้นสุด (End Date)</label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="text"
                                                placeholder="วว/ดด/ปปปป"
                                                value={endDateFilter}
                                                onChange={e => handleDateInputChange(e.target.value, endDateFilter, setEndDateFilter)}
                                                className="form-control py-1.5 pl-3 pr-8 text-xs rounded-xl font-bold w-full"
                                                maxLength={10}
                                            />
                                            <input
                                                type="date"
                                                className="absolute left-0 right-0 top-0 bottom-0 opacity-0 cursor-pointer w-full h-full"
                                                onClick={(e) => { try { e.target.showPicker(); } catch(err){} }}
                                                value={(() => {
                                                    if (endDateFilter && endDateFilter.length === 10) {
                                                        const d = endDateFilter.substring(0, 2);
                                                        const m = endDateFilter.substring(3, 5);
                                                        const yNum = parseInt(endDateFilter.substring(6, 10), 10);
                                                        if (!isNaN(yNum)) {
                                                            const gYear = yNum > 2400 ? yNum - 543 : yNum;
                                                            return `${gYear}-${m}-${d}`;
                                                        }
                                                    }
                                                    return '';
                                                })()}
                                                onChange={(e) => {
                                                    if (!e.target.value) return;
                                                    const [y, m, d] = e.target.value.split('-');
                                                    const thaiYear = parseInt(y, 10) < 2400 ? parseInt(y, 10) + 543 : parseInt(y, 10);
                                                    handleDateInputChange(`${d}/${m}/${thaiYear}`, endDateFilter, setEndDateFilter);
                                                }}
                                            />
                                            <Calendar size={14} className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase">สูตรคำนวณ (Formula)</label>
                                        <select
                                            value={formulaFilter}
                                            onChange={e => setFormulaFilter(e.target.value)}
                                            className="form-control py-1.5 px-3 text-xs rounded-xl font-bold"
                                        >
                                            <option value="all">สูตรทั้งหมด (All)</option>
                                            {uniqueFormulas.map(f => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase">ผู้บันทึก (Pharmacist)</label>
                                        <select
                                            value={pharmacistFilter}
                                            onChange={e => setPharmacistFilter(e.target.value)}
                                            className="form-control py-1.5 px-3 text-xs rounded-xl font-bold"
                                        >
                                            <option value="all">ผู้บันทึกทั้งหมด (All)</option>
                                            {uniquePharmacists.map(u => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2 pt-3 border-t border-slate-700/10">
                                        <button
                                            onClick={() => {
                                                setStartDateFilter('');
                                                setEndDateFilter('');
                                                setFormulaFilter('all');
                                                setPharmacistFilter('all');
                                            }}
                                            className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600/20 transition-all cursor-pointer"
                                        >
                                            ล้างตัวกรอง (Reset)
                                        </button>
                                        <button
                                            onClick={() => setShowFilterPanel(false)}
                                            className="px-4 py-2 rounded-xl text-xs font-black bg-slate-700 text-white transition-all cursor-pointer"
                                        >
                                            ปิด (Close)
                                        </button>
                                    </div>
                                </div>
                            )}

                             {selectedHnDetail ? (
                                 <div className="space-y-4">
                                     <div className="flex items-center gap-3 mb-2 no-print">
                                         <button type="button" onClick={() => setSelectedHnDetail(null)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600/10 text-sky-500 border border-sky-500/20 hover:bg-sky-600/20 font-bold text-sm transition-all cursor-pointer">
                                             ← กลับ
                                         </button>
                                         <div className="flex-1">
                                             <span className="font-black text-xl">H.N. {selectedHnDetail}</span>
                                             <span className="text-slate-400 dark:text-slate-500 text-sm ml-2">— {filteredLogs.filter(l => l.hn === selectedHnDetail).length} รายการ</span>
                                         </div>
                                         <button onClick={printHistory} className="no-print bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold py-2 px-4 rounded-xl border border-slate-700 flex items-center gap-2 text-sm transition-all active:scale-95 shadow-lg whitespace-nowrap">
                                             <Printer size={16} /> พิมพ์รายงาน
                                         </button>
                                     </div>
                                     {(() => {
                                         const hnLogs = filteredLogs.filter(l => l.hn === selectedHnDetail);
                                         const latestLog = hnLogs[0] || {};
                                         return (
                                            <>
                                                <div className={`p-6 rounded-3xl border flex flex-wrap gap-5 items-center mb-6 shadow-sm backdrop-blur-sm relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-r from-slate-800/80 to-slate-800/40 border-slate-700/50' : 'bg-gradient-to-r from-sky-50 to-white border-sky-200/60'}`}>
                                                    <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                                    <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center shrink-0 font-black text-2xl relative z-10 ${
                                                        latestLog.gender === 'female'
                                                            ? 'bg-gradient-to-br from-rose-400/20 to-rose-500/10 text-rose-500 border border-rose-500/20'
                                                            : 'bg-gradient-to-br from-sky-400/20 to-sky-500/10 text-sky-500 border border-sky-500/20'
                                                    }`}>
                                                        {latestLog.gender === 'female' ? '♀' : '♂'}
                                                    </div>
                                                    <div className="relative z-10 flex items-center gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-black text-xl uppercase tracking-tight text-slate-800 dark:text-white dark:text-white mb-0.5">{latestLog.patient_name || '-'}</p>
                                                            {['ADMIN', 'HEAD'].includes(user?.role?.toUpperCase()) && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUpdatePatientName(latestLog);
                                                                    }}
                                                                    className="text-slate-400 dark:text-slate-500 hover:text-sky-500 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-800"
                                                                    title="แก้ไขชื่อผู้ป่วย"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium flex items-center gap-2 mt-1">
                                                            <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700/50 dark:bg-slate-700/50 text-xs font-bold">{latestLog.gender === 'female' ? 'หญิง' : latestLog.gender === 'male' ? 'ชาย' : '-'}</span>
                                                            {latestLog.age && <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700/50 dark:bg-slate-700/50 text-xs font-bold">{latestLog.age} ปี</span>}
                                                            {latestLog.dob && <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">{latestLog.dob}</span>}
                                                            {latestLog.ward && <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700/50 dark:bg-slate-700/50 text-xs font-bold">{latestLog.ward}</span>}
                                                        </p>
                                                    </div>
                                                    <div className="ml-auto text-right relative z-10 flex flex-col items-end">
                                                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-sky-600 leading-none mb-1">{hnLogs.length}</div>
                                                        <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">ครั้งที่คำนวณ</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 md:ml-4 space-y-5 pb-8 mt-6">
                                                    {hnLogs.map((log, idx) => (
                                                        <div key={log.id} className="relative pl-5 md:pl-8 group break-inside-avoid">
                                                            {/* Timeline dot */}
                                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-sky-500 border-4 border-white dark:border-slate-900 shadow-sm group-hover:scale-125 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-sky-200 dark:group-hover:ring-sky-900/50"></div>
                                                            
                                                            {/* Card Content */}
                                                            <div className="bg-white dark:bg-slate-800/80 p-3.5 md:p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
                                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-700/50 gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="p-1.5 bg-sky-50 dark:bg-sky-900/30 rounded-lg text-sky-500">
                                                                            <Calendar size={14} />
                                                                        </div>
                                                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                                                            <span className="font-mono text-[13px] font-bold text-slate-700 dark:text-slate-200 dark:text-slate-300">{log.timestamp}</span>
                                                                            <span className="text-[10px] text-slate-400 dark:text-slate-500">บันทึกโดย: <span className="font-bold text-sky-500 uppercase">{log.user_name || '-'}</span></span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 items-center flex-wrap">
                                                                        {log.ward && (
                                                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 dark:bg-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                                                <Activity size={10} /> {log.ward}
                                                                            </span>
                                                                        )}
                                                                        {user?.role?.toUpperCase() === 'ADMIN' && (
                                                                            <button
                                                                                onClick={() => handleDeleteLog(log)}
                                                                                className="text-slate-400 dark:text-slate-500 hover:text-rose-500 p-1 rounded-md hover:bg-rose-500/10 transition-colors active:scale-95 no-print ml-1"
                                                                                title="ลบรายการบันทึกประวัตินี้"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col lg:flex-row gap-4 relative z-10">
                                                                    {/* Patient Status */}
                                                                    <div className="flex lg:flex-col gap-4 lg:gap-2 min-w-[120px]">
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">พื้นที่ผิว (BSA)</p>
                                                                            <p className="text-sm font-black text-emerald-500">{sanitizeNaN(log.calculated_bsa)} <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">m┬▓</span></p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">ประวัติแพ้ยา</p>
                                                                            {log.allergies ? (
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {log.allergies.split(',').map(a => a.trim()).filter(Boolean).map((a, i) => (
                                                                                        <span key={i} className="text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded text-[9px] font-black border border-rose-500/20">
                                                                                            ⚠️ {a}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-xs font-bold italic text-slate-400 dark:text-slate-500/70">-</span>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">ผล LAB อื่นๆ</p>
                                                                            {log.other_lab ? (
                                                                                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">{log.other_lab}</span>
                                                                            ) : (
                                                                                <span className="text-xs font-bold italic text-slate-400 dark:text-slate-500/70">-</span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Regimen */}
                                                                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 group-hover:bg-sky-50/30 dark:group-hover:bg-sky-900/10 transition-colors">
                                                                        <div className="flex flex-col sm:flex-row gap-3 sm:items-start justify-between">
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Pill size={10}/> สูตรยาที่ใช้ (Regimen)</p>
                                                                                <p className="font-black text-sky-600 dark:text-sky-400 uppercase text-sm leading-snug">{log.drugs_used || '-'}</p>
                                                                            </div>
                                                                            <div className="text-left sm:text-right mt-1 sm:mt-0">
                                                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">วิธีการคำนวณ</p>
                                                                                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700/50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded inline-block uppercase">{sanitizeNaN(log.formula_used)}</p>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div className="border-t border-slate-200 dark:border-slate-700/50 dark:border-slate-700/50 pt-2 mt-2">
                                                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">ขนาดยาสุทธิ (Final Dose)</p>
                                                                            <p className="text-sm font-black text-amber-600 dark:text-amber-500 bg-amber-500/10 inline-block px-2 py-0.5 rounded-md border border-amber-500/20">{sanitizeNaN(log.prescribed_dose)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {log.doctor && (
                                                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-2 relative z-10">
                                                                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 dark:bg-slate-700 px-1.5 py-0.5 rounded">แพทย์ผู้สั่งยา</span>
                                                                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 dark:text-slate-300">{log.doctor}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                         );
                                     })()}
                                 </div>
                             ) : (
                                 (() => {
                                     const grouped = {};
                                     filteredLogs.forEach(log => {
                                         if (!grouped[log.hn]) {
                                             grouped[log.hn] = {
                                                 hn: log.hn,
                                                 name: log.patient_name,
                                                 gender: log.gender,
                                                 ward: log.ward,
                                                 logs: []
                                             };
                                         }
                                         grouped[log.hn].logs.push(log);
                                         if (log.patient_name) grouped[log.hn].name = log.patient_name;
                                         if (log.ward) grouped[log.hn].ward = log.ward;
                                         if (log.gender) grouped[log.hn].gender = log.gender;
                                     });
                                     const patientList = Object.values(grouped).sort((a, b) => (b.logs[0]?.timestamp || '').localeCompare(a.logs[0]?.timestamp || ''));
                                     if (patientList.length === 0) return <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-bold italic text-lg">ไม่พบประวัติการคำนวณที่ตรงกับการค้นหา</div>;
                                     return (
                                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                             {patientList.map(p => {
                                                 const latestLog = p.logs[0] || {};
                                                 const allergyList = latestLog.allergies ? latestLog.allergies.split(',').map(x => x.trim()).filter(Boolean) : [];
                                                 return (
                                                     <button
                                                         key={p.hn}
                                                         type="button"
                                                         onClick={() => setSelectedHnDetail(p.hn)}
                                                         className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer relative overflow-hidden group ${
                                                             theme === 'dark'
                                                                 ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-sky-500/50 hover:from-slate-800 hover:to-sky-900/20 shadow-lg'
                                                                 : 'bg-gradient-to-br from-white to-slate-50/80 border-slate-200/60 hover:border-sky-400/50 shadow-md hover:shadow-sky-100/80 hover:from-sky-50/30 hover:to-white'
                                                         }`}
                                                     >
                                                         <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-sky-400/10 transition-all"></div>
                                                         
                                                         <div className="flex items-start gap-4 relative z-10">
                                                             <div className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center shrink-0 font-black text-xl transition-transform duration-300 group-hover:rotate-[5deg] ${
                                                                 p.gender === 'female'
                                                                     ? 'bg-gradient-to-br from-rose-400/20 to-rose-500/10 text-rose-500 border border-rose-500/20'
                                                                     : 'bg-gradient-to-br from-sky-400/20 to-sky-500/10 text-sky-500 border border-sky-500/20'
                                                             }`}>
                                                                 {p.gender === 'female' ? '♀' : '♂'}
                                                             </div>
                                                             <div className="flex-1 min-w-0">
                                                                 <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                                                                     <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 dark:text-slate-300 tracking-wider">
                                                                         H.N. {p.hn}
                                                                     </span>
                                                                     <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center gap-1">
                                                                         <History size={10} /> {p.logs.length} ครั้ง
                                                                     </span>
                                                                 </div>
                                                                 <p className="font-black text-base uppercase truncate mb-1.5 text-slate-800 dark:text-white dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{p.name || '-'}</p>
                                                                 <div className="flex flex-wrap gap-1.5 mb-2">
                                                                     <span className="text-[10px] font-bold px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:text-slate-500">
                                                                         {p.gender === 'female' ? 'หญิง' : p.gender === 'male' ? 'ชาย' : '-'}
                                                                     </span>
                                                                     {latestLog.age && (
                                                                         <span className="text-[10px] font-bold px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:text-slate-500">
                                                                             {latestLog.age} ปี
                                                                         </span>
                                                                     )}
                                                                     {p.ward && (
                                                                         <span className="text-[10px] font-bold px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:text-slate-500">
                                                                             {p.ward}
                                                                         </span>
                                                                     )}
                                                                 </div>
                                                                 <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700/50 pt-2.5 mt-2.5">
                                                                     {allergyList.length > 0 ? (
                                                                         <div className="flex flex-wrap gap-1 items-center">
                                                                             <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mr-1 text-xs">แพ้:</span>
                                                                             {allergyList.map((a, i) => (
                                                                                 <span key={i} className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded text-[10px] font-black border border-rose-500/10">
                                                                                     ⚠️ {a}
                                                                                 </span>
                                                                             ))}
                                                                         </div>
                                                                     ) : (
                                                                         <span className="text-slate-400 dark:text-slate-500/70 font-bold italic">ไม่มีประวัติแพ้ยา</span>
                                                                     )}
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-100 dark:border-slate-700/50 pt-2.5 mt-3.5 flex items-center justify-between relative z-10">
                                                             <span className="opacity-70">ล่าสุด: {p.logs[0]?.timestamp || '-'}</span>
                                                             <span className="text-sky-500 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">ดูประวัติ <ArrowRight size={12} /></span>
                                                         </div>
                                                     </button>
                                                 );
                                             })}
                                         </div>
                                     );
                                 })()
                             )}
                        </div>
                    </div>
                
    );
}
