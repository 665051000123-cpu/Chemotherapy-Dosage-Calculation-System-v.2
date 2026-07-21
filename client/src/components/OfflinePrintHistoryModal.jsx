import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Clock, Printer, FileText, User } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const OfflinePrintHistoryModal = ({ show, onClose, user, showNotification, patient }) => {
    const [history, setHistory] = useState([]);
    const [printingId, setPrintingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (show) {
                setLoading(true);
                try {
                    const res = await axios.get('/api/print-logs', { 
                        params: patient?.hn ? { hn: patient.hn } : {} 
                    });
                    if (res.data.success) {
                        setHistory(res.data.logs);
                    }
                } catch (err) {
                    console.error("Failed to load print logs", err);
                    showNotification("ไม่สามารถโหลดประวัติการพิมพ์ได้", "error");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
    }, [show, patient]);

    const handleReprint = async (job) => {
        setPrintingId(job.id);
        try {
            if (job.printer_name === 'Local Browser') {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(job.html_content);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                    }, 500);
                } else {
                    showNotification('ไม่สามารถเปิดหน้าต่างพิมพ์ได้ กรุณาอนุญาต Pop-ups', 'warning');
                }
                setPrintingId(null);
                return;
            }

            const apiUrl = user?.use_local_agent ? 'http://localhost:5005/api/print' : '/api/print';
            
            await axios.post(apiUrl, {
                html: job.html_content,
                printerName: job.printer_name,
                paperSize: job.paper_size,
                isA4: job.is_a4
            });
            
            showNotification('สั่งพิมพ์ซ้ำเรียบร้อยแล้ว', 'success');
        } catch (err) {
            console.error('Reprint error', err);
            const serverMsg = err.response?.data?.message || err.message;
            showNotification('เกิดข้อผิดพลาดในการสั่งพิมพ์ซ้ำ: ' + serverMsg, 'error');
        } finally {
            setPrintingId(null);
        }
    };

    // Clear history feature removed for online logs

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-300 max-h-[85vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">ประวัติการพิมพ์ออนไลน์ (ล่าสุด)</h2>
                            <p className="text-sm font-medium text-slate-500">ประวัติการพิมพ์ {history.length} รายการล่าสุดจากฐานข้อมูล</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Clock size={32} className="animate-spin text-indigo-500" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-bold">ยังไม่มีประวัติการพิมพ์</p>
                            <p className="text-sm mt-1">ระบบจะเก็บประวัติการสั่งพิมพ์ไว้ที่นี่</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((job) => (
                                <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                                                {job.paper_size === 'Sticker' ? 'Sticker' : (job.paper_size || 'A4')}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">
                                                {format(new Date(job.createdAt), 'dd MMM yyyy HH:mm', { locale: th })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 truncate text-sm">{job.title}</h4>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 truncate">
                                            <div className="flex items-center gap-1.5">
                                                <Printer size={12} />
                                                <span className="truncate">{job.printer_name || 'ไม่ได้เลือกเครื่องพิมพ์'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User size={12} />
                                                <span className="truncate">{job.printed_by || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => handleReprint(job)}
                                            disabled={printingId === job.id}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                                        >
                                            {printingId === job.id ? (
                                                <><Clock size={16} className="animate-spin" /> กำลังสั่ง...</>
                                            ) : (
                                                <><Printer size={16} /> พิมพ์ซ้ำ</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end items-center">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfflinePrintHistoryModal;
