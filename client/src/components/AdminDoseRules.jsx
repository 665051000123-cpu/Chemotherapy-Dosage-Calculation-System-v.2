import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Activity, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

const AdminDoseRules = ({ isOpen, onClose, showNotification, isDark }) => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRule, setEditingRule] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    
    const [formData, setFormData] = useState({
        drug_name: '',
        lab_type: 'CrCl',
        condition_type: '<',
        value1: '',
        value2: '',
        recommendation: '',
        alert_level: 'warning'
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/dose_adjustment_rules`);
            setRules(res.data);
        } catch (err) {
            console.error(err);
            showNotification('Error fetching dose adjustment rules', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!formData.drug_name || !formData.value1 || !formData.recommendation) {
                return showNotification('กรุณากรอกข้อมูลให้ครบถ้วน (ยา, ค่าที่ตั้งไว้, คำแนะนำ)', 'warning');
            }
            
            if (isAdding) {
                await axios.post(`${API_BASE}/dose_adjustment_rules`, formData);
                showNotification('เพิ่มกฎแจ้งเตือนใหม่สำเร็จ', 'success');
            } else {
                await axios.put(`${API_BASE}/dose_adjustment_rules/${editingRule.id}`, formData);
                showNotification('อัปเดตกฎสำเร็จ', 'success');
            }
            fetchRules();
            handleCancel();
        } catch (err) {
            console.error(err);
            showNotification('Error saving rule', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณต้องการลบกฎข้อนี้ใช่หรือไม่?')) return;
        try {
            await axios.delete(`${API_BASE}/dose_adjustment_rules/${id}`);
            showNotification('ลบกฎสำเร็จ', 'success');
            fetchRules();
        } catch (err) {
            console.error(err);
            showNotification('Error deleting rule', 'error');
        }
    };

    const handleEdit = (rule) => {
        setEditingRule(rule);
        setIsAdding(false);
        setFormData({
            drug_name: rule.drug_name,
            lab_type: rule.lab_type,
            condition_type: rule.condition_type,
            value1: rule.value1,
            value2: rule.value2 || '',
            recommendation: rule.recommendation,
            alert_level: rule.alert_level || 'warning'
        });
    };

    const handleCancel = () => {
        setEditingRule(null);
        setIsAdding(false);
        setFormData({
            drug_name: '',
            lab_type: 'CrCl',
            condition_type: '<',
            value1: '',
            value2: '',
            recommendation: '',
            alert_level: 'warning'
        });
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in ${isDark ? 'dark' : ''}`}>
            <div className="bg-slate-50 dark:bg-slate-900 w-[95%] max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-200 dark:border-slate-800">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                >
                    <X size={24} />
                </button>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="animate-fade-in p-2">
                        <div className="flex items-center justify-between mb-8 pr-12">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                        <Activity className="text-emerald-500" />
                                        จัดการกฎปรับขนาดยา (Dose Adjustment Rules)
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        ตั้งค่าการแจ้งเตือนลดขนาดยา เมื่อค่าตับหรือไตผิดปกติ
                                    </p>
                                </div>
                            </div>
                            {!isAdding && !editingRule && (
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-all"
                                >
                                    <Plus size={18} />
                                    เพิ่มกฎใหม่
                                </button>
                            )}
                        </div>

            {(isAdding || editingRule) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8 animate-fade-in">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                        {isAdding ? 'สร้างกฎการแจ้งเตือนใหม่' : 'แก้ไขกฎการแจ้งเตือน'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">ชื่อยา (Drug Name)</label>
                            <input type="text" className="form-control" placeholder="เช่น cisplatin" value={formData.drug_name} onChange={e => setFormData({...formData, drug_name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">ประเภทค่า (Lab Type)</label>
                            <select className="form-control" value={formData.lab_type} onChange={e => setFormData({...formData, lab_type: e.target.value})}>
                                <option value="CrCl">CrCl</option>
                                <option value="AST">AST</option>
                                <option value="ALT">ALT</option>
                                <option value="Bilirubin">Bilirubin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">เงื่อนไข (Condition)</label>
                            <select className="form-control" value={formData.condition_type} onChange={e => setFormData({...formData, condition_type: e.target.value})}>
                                <option value="<">&lt; (น้อยกว่า)</option>
                                <option value="<=">&lt;= (น้อยกว่าหรือเท่ากับ)</option>
                                <option value=">">&gt; (มากกว่า)</option>
                                <option value=">=">&gt;= (มากกว่าหรือเท่ากับ)</option>
                                <option value="between">ระหว่าง (Between)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">ค่าอ้างอิง {formData.condition_type === 'between' ? '1' : ''}</label>
                            <input type="number" step="0.1" className="form-control" placeholder="Value" value={formData.value1} onChange={e => setFormData({...formData, value1: e.target.value})} />
                        </div>
                        {formData.condition_type === 'between' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">ค่าอ้างอิง 2</label>
                                <input type="number" step="0.1" className="form-control" placeholder="Value 2" value={formData.value2} onChange={e => setFormData({...formData, value2: e.target.value})} />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">ระดับการแจ้งเตือน</label>
                            <select className="form-control" value={formData.alert_level} onChange={e => setFormData({...formData, alert_level: e.target.value})}>
                                <option value="warning">Warning (สีเหลือง)</option>
                                <option value="danger">Danger (สีแดง - ห้ามใช้/ลดโดสหนัก)</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 mb-1">ข้อความแนะนำ (Recommendation)</label>
                        <input type="text" className="form-control" placeholder="เช่น ลดโดสลง 50% หรือ ห้ามใช้ยานี้" value={formData.recommendation} onChange={e => setFormData({...formData, recommendation: e.target.value})} />
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm flex items-center gap-2">
                            <Save size={18} />
                            บันทึก
                        </button>
                        <button onClick={handleCancel} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl shadow-sm flex items-center gap-2">
                            <X size={18} />
                            ยกเลิก
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">รายการกฎทั้งหมด ({rules.length})</h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-slate-500">กำลังโหลดข้อมูล...</div>
                ) : rules.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">ยังไม่มีกฎการแจ้งเตือน</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-4 py-3">ชื่อยา</th>
                                    <th className="px-4 py-3">ประเภท (Lab)</th>
                                    <th className="px-4 py-3">เงื่อนไข</th>
                                    <th className="px-4 py-3">ระดับการแจ้งเตือน</th>
                                    <th className="px-4 py-3">คำแนะนำ</th>
                                    <th className="px-4 py-3 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map(rule => (
                                    <tr key={rule.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-200">{rule.drug_name}</td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-medium text-xs">
                                                {rule.lab_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                                            {rule.condition_type === 'between' ? `Between ${rule.value1} and ${rule.value2}` : `${rule.condition_type} ${rule.value1}`}
                                        </td>
                                        <td className="px-4 py-3">
                                            {rule.alert_level === 'danger' ? (
                                                <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded text-xs font-bold w-max">
                                                    <AlertTriangle size={14} /> Danger
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold w-max">
                                                    <AlertTriangle size={14} /> Warning
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{rule.recommendation}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleEdit(rule)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(rule.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default AdminDoseRules;
