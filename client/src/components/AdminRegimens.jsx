import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ClipboardList, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

const AdminRegimens = ({ isOpen, onClose, showNotification, isDark, drugsInfo }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        drugs: [] // array of { drugId: '', standardDose: '', unit: '' }
    });

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/regimen_templates`);
            setTemplates(res.data);
        } catch (err) {
            console.error(err);
            showNotification('Error fetching regimen templates', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!formData.name) {
                return showNotification('กรุณากรอกชื่อสูตรยา', 'warning');
            }
            if (formData.drugs.length === 0) {
                return showNotification('กรุณาเพิ่มยาอย่างน้อย 1 ชนิดในสูตร', 'warning');
            }
            
            const payload = {
                name: formData.name,
                description: formData.description,
                drugs: JSON.stringify(formData.drugs)
            };
            
            if (isAdding) {
                await axios.post(`${API_BASE}/regimen_templates`, payload);
                showNotification('สร้างสูตรยาใหม่สำเร็จ', 'success');
            } else {
                await axios.put(`${API_BASE}/regimen_templates/${editingTemplate.id}`, payload);
                showNotification('อัปเดตสูตรยาสำเร็จ', 'success');
            }
            fetchTemplates();
            handleCancel();
        } catch (err) {
            console.error(err);
            showNotification(err.response?.data?.error || 'Error saving template', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณต้องการลบสูตรยานี้ใช่หรือไม่?')) return;
        try {
            await axios.delete(`${API_BASE}/regimen_templates/${id}`);
            showNotification('ลบสูตรยาสำเร็จ', 'success');
            fetchTemplates();
        } catch (err) {
            console.error(err);
            showNotification('Error deleting template', 'error');
        }
    };

    const handleEdit = (tpl) => {
        setEditingTemplate(tpl);
        setIsAdding(false);
        
        let parsedDrugs = [];
        try {
            if (tpl.drugs) parsedDrugs = JSON.parse(tpl.drugs);
        } catch(e) {}
        
        setFormData({
            name: tpl.name,
            description: tpl.description || '',
            drugs: parsedDrugs
        });
    };

    const handleCancel = () => {
        setEditingTemplate(null);
        setIsAdding(false);
        setFormData({
            name: '',
            description: '',
            drugs: []
        });
    };

    const addDrugRow = () => {
        setFormData({
            ...formData,
            drugs: [...formData.drugs, { drugId: '', standardDose: '', unit: 'mg/m2' }]
        });
    };

    const updateDrugRow = (index, field, value) => {
        const newDrugs = [...formData.drugs];
        newDrugs[index][field] = value;
        
        // If drugId changes, set default unit based on drug category/type if we want, but for now just keep simple
        if (field === 'drugId') {
            const dInfo = drugsInfo.find(d => d.id === value);
            if (dInfo && dInfo.raw && dInfo.raw.standard_dose_unit) {
                newDrugs[index].unit = dInfo.raw.standard_dose_unit;
            }
        }
        
        setFormData({ ...formData, drugs: newDrugs });
    };

    const removeDrugRow = (index) => {
        const newDrugs = [...formData.drugs];
        newDrugs.splice(index, 1);
        setFormData({ ...formData, drugs: newDrugs });
    };

    const activeDrugs = drugsInfo.filter(d => d.raw?.is_active === 1);

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
                        <div className="flex items-center justify-between mb-8 pr-16 md:pr-24">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                        <ClipboardList className="text-indigo-500" />
                                        จัดการสูตรยามาตรฐาน (Regimen Templates)
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        สร้างและแก้ไขสูตรยาเคมีบำบัด เพื่อให้แพทย์เลือกใช้งานได้รวดเร็ว
                                    </p>
                                </div>
                            </div>
                            {!isAdding && !editingTemplate && (
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm transition-all"
                                >
                                    <Plus size={18} />
                                    สร้างสูตรยาใหม่
                                </button>
                            )}
                        </div>

                        {(isAdding || editingTemplate) && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8 animate-fade-in">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                                    {isAdding ? 'สร้างสูตรยาใหม่' : 'แก้ไขสูตรยา'}
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">ชื่อสูตรยา (Regimen Name) <span className="text-red-500">*</span></label>
                                        <input type="text" className="form-control" placeholder="เช่น FOLFOX, R-CHOP" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">รายละเอียด (Description) (Optional)</label>
                                        <input type="text" className="form-control" placeholder="คำอธิบายเพิ่มเติม..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                </div>

                                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">รายการยาในสูตรนี้</label>
                                        <button onClick={addDrugRow} className="text-xs flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors font-bold">
                                            <Plus size={14} /> เพิ่มยา
                                        </button>
                                    </div>
                                    
                                    {formData.drugs.length === 0 ? (
                                        <div className="text-center p-4 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                            ยังไม่มียาในสูตรนี้ กรุณากดปุ่มเพิ่มยา
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {formData.drugs.map((d, idx) => (
                                                <div key={idx} className="flex gap-3 items-start animate-fade-in">
                                                    <div className="flex-1">
                                                        <select className="form-control text-sm" value={d.drugId} onChange={e => updateDrugRow(idx, 'drugId', e.target.value)}>
                                                            <option value="">-- เลือกยา --</option>
                                                            {activeDrugs.map(ad => (
                                                                <option key={ad.id} value={ad.id}>{ad.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="w-32">
                                                        <input type="number" step="0.01" className="form-control text-sm" placeholder="โดสมาตรฐาน" value={d.standardDose} onChange={e => updateDrugRow(idx, 'standardDose', e.target.value)} />
                                                    </div>
                                                    <div className="w-32">
                                                        <select className="form-control text-sm" value={d.unit} onChange={e => updateDrugRow(idx, 'unit', e.target.value)}>
                                                            <option value="mg/m2">mg/m2</option>
                                                            <option value="AUC">AUC</option>
                                                            <option value="mg">mg</option>
                                                            <option value="mg/kg">mg/kg</option>
                                                            <option value="mcg">mcg</option>
                                                            <option value="mcg/m2">mcg/m2</option>
                                                            <option value="mcg/kg">mcg/kg</option>
                                                            <option value="g">g</option>
                                                            <option value="g/m2">g/m2</option>
                                                            <option value="IU">IU</option>
                                                            <option value="IU/m2">IU/m2</option>
                                                            <option value="units">units</option>
                                                        </select>
                                                    </div>
                                                    <button onClick={() => removeDrugRow(idx)} className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm flex items-center gap-2">
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
                                <h3 className="font-bold text-slate-700 dark:text-slate-300">สูตรยาทั้งหมด ({templates.length})</h3>
                            </div>
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">กำลังโหลดข้อมูล...</div>
                            ) : templates.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">ยังไม่มีสูตรยาในระบบ</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-4 py-3">ชื่อสูตร (Regimen)</th>
                                                <th className="px-4 py-3">รายละเอียด</th>
                                                <th className="px-4 py-3">รายการยา</th>
                                                <th className="px-4 py-3 text-right">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {templates.map(tpl => {
                                                let parsedDrugs = [];
                                                try {
                                                    if (tpl.drugs) parsedDrugs = JSON.parse(tpl.drugs);
                                                } catch(e) {}

                                                return (
                                                    <tr key={tpl.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-200">{tpl.name}</td>
                                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{tpl.description || '-'}</td>
                                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                            <div className="flex flex-wrap gap-1">
                                                                {parsedDrugs.map((d, i) => {
                                                                    const dName = activeDrugs.find(ad => ad.id === d.drugId)?.name || d.drugId;
                                                                    return (
                                                                        <span key={i} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100 dark:border-indigo-800/50">
                                                                            {dName} {d.standardDose ? `${d.standardDose} ${d.unit}` : ''}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button onClick={() => handleEdit(tpl)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 size={16} /></button>
                                                            <button onClick={() => handleDelete(tpl.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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

export default AdminRegimens;
