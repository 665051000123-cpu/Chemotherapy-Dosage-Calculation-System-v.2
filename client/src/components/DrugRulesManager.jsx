import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Save, Trash2, Edit2, AlertTriangle, ListFilter } from 'lucide-react';
import { createPortal } from 'react-dom';

const API_BASE = '/api';

export default function DrugRulesManager({ isOpen, onClose, isDark }) {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRule, setEditingRule] = useState(null);
    const [form, setForm] = useState({ drugName: '', keywords: '', title: '', desc: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchRules();
        }
    }, [isOpen]);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/drug_rules`);
            setRules(res.data);
        } catch (err) {
            console.error('Error fetching rules', err);
            alert('ไม่สามารถโหลดข้อมูลกฎข้อห้ามได้');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setForm({ drugName: '', keywords: '', title: 'คำเตือนการให้ยา: ', desc: '' });
        setEditingRule(null);
        setShowForm(true);
    };

    const handleOpenEdit = (rule) => {
        setForm({
            drugName: rule.drugName,
            keywords: rule.keywords.join(', '),
            title: rule.title,
            desc: rule.desc
        });
        setEditingRule(rule);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบกฎข้อห้ามนี้?')) return;
        try {
            await axios.delete(`${API_BASE}/drug_rules/${id}`);
            fetchRules();
        } catch (err) {
            console.error(err);
            alert('ลบข้อมูลไม่สำเร็จ');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                drugName: form.drugName,
                keywords: form.keywords.split(',').map(k => k.trim()).filter(k => k),
                title: form.title,
                desc: form.desc
            };

            if (editingRule) {
                await axios.put(`${API_BASE}/drug_rules/${editingRule.id}`, payload);
            } else {
                await axios.post(`${API_BASE}/drug_rules`, payload);
            }
            setShowForm(false);
            fetchRules();
        } catch (err) {
            console.error(err);
            alert('บันทึกข้อมูลไม่สำเร็จ');
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h2 className="text-xl font-black flex items-center gap-3">
                        <AlertTriangle className="text-amber-500" size={24} />
                        จัดการกฎข้อห้ามการผสมยา
                    </h2>
                    <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                    {!showForm ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-sm opacity-70">รายการกฎการแจ้งเตือนเมื่อสั่งยาที่ไม่เข้ากันกับสารละลาย</p>
                                <button onClick={handleOpenAdd} className="btn-primary py-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <Plus size={16} /> เพิ่มกฎใหม่
                                </button>
                            </div>
                            
                            {loading ? (
                                <div className="text-center p-10 opacity-50 font-bold">กำลังโหลดข้อมูล...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className={`border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                                                <th className="p-3 font-black opacity-70">ชื่อยา (Drug Name)</th>
                                                <th className="p-3 font-black opacity-70">คีย์เวิร์ดสารละลาย</th>
                                                <th className="p-3 font-black opacity-70">หัวข้อแจ้งเตือน</th>
                                                <th className="p-3 font-black opacity-70 text-center w-[120px]">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rules.map(rule => (
                                                <tr key={rule.id} className={`border-b ${isDark ? 'border-slate-800 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                                                    <td className="p-3 font-bold text-sky-600 dark:text-sky-400">{rule.drugName}</td>
                                                    <td className="p-3 text-xs">
                                                        {rule.keywords.map(kw => (
                                                            <span key={kw} className={`inline-block px-2 py-1 rounded-md mr-1 mb-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>{kw}</span>
                                                        ))}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="font-bold mb-1">{rule.title}</div>
                                                        <div className="text-xs opacity-70 whitespace-pre-wrap">{rule.desc}</div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleOpenEdit(rule)} className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(rule.id)} className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="font-black text-lg mb-4">{editingRule ? 'แก้ไขกฎข้อห้าม' : 'เพิ่มกฎข้อห้ามใหม่'}</h3>
                            
                            <div>
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ชื่อยา (ส่วนหนึ่งของชื่อยาที่ต้องการดักจับ)</label>
                                <input required type="text" className="form-control text-sm" placeholder="เช่น 5-FU หรือ Cisplatin" value={form.drugName} onChange={e => setForm({...form, drugName: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">คีย์เวิร์ดสารละลาย (คั่นด้วยลูกน้ำ ,) ใส่ * ถ้าห้ามทุกสารละลาย</label>
                                <input required type="text" className="form-control text-sm" placeholder="เช่น d5w, dextrose, d5" value={form.keywords} onChange={e => setForm({...form, keywords: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">หัวข้อการแจ้งเตือน</label>
                                <input required type="text" className="form-control text-sm" placeholder="เช่น คำเตือนการให้ยา: 5-FU" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">รายละเอียดคำเตือน</label>
                                <textarea required className="form-control text-sm min-h-[100px]" placeholder="ข้อความแจ้งเตือนเมื่อมีการสั่งยานี้กับสารละลายดังกล่าว..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}></textarea>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50 mt-6">
                                <button type="button" onClick={() => setShowForm(false)} className={`w-1/2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>
                                    ยกเลิก
                                </button>
                                <button type="submit" className="w-1/2 btn-primary text-sm py-3 px-4 flex items-center justify-center gap-2">
                                    <Save size={16} /> บันทึกข้อมูล
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
