import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Pill, Search, FlaskConical, Ruler, ShieldAlert, Activity, Plus, Edit2, Trash2, Save, X, Printer, Package, Shield, AlertTriangle, Thermometer, Stethoscope, Download, Info, Syringe, HeartPulse, MessageSquare } from 'lucide-react';
import axios from 'axios';
import DrugRulesManager from './DrugRulesManager';

const API_BASE = '/api';

const DrugsInfo = ({ currentUser, onBack, showNotification, theme, setPreviewData }) => {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const isDark = theme === 'dark';
    const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN' || currentUser?.role?.toUpperCase() === 'HEAD';

    // Form Modal states
    const [showFormModal, setShowFormModal] = useState(false);
    const [showRulesManager, setShowRulesManager] = useState(false);
    const [viewingDrugInfo, setViewingDrugInfo] = useState(null);
    const [editingDrug, setEditingDrug] = useState(null);
    const [drugForm, setDrugForm] = useState({
        drug_code: '',
        drug_name: '',
        drug_category: 'CHEMOTHERAPY',
        calculation_type: 'BSA',
        default_weight_type: 'ACTUAL',
        standard_dose_value: '',
        standard_dose_unit: '',
        max_dose_cap: '',
        max_bsa_cap: '',
        max_gfr_cap: '125',
        is_active: 1,
        dose_per_pack: '',
        dose_per_pack_unit: 'ml',
        vol_per_pack: '',
        vol_per_pack_unit: 'ml',
        package_type: '',
        inventory_qty: '',
        inventory_min: '',
        inventory_max: '',
        is_auto_dispensed: false,
        packages: [],
        prep_instructions: '',
        solvent: '',
        admin_route: '',
        concentration_per_ml: '',
        cost_price: '',
        expire_after_mix_days: '',
        expire_after_mix_hours: '',
        expire_after_recon_days: '',
        warning_msg: '',
        storage_instruction: '',
        infusion_rate: '',
        alert_cumulative_dose: '',
        alert_cumulative_dose_unit: '',
        alert_concentration_max: '',
        diluent_incompat: '',
        note: '',
        myelosuppression: '',
        side_effect_info: '',
        stability_info: '',
        drug_interactions: '',
        usual_dosage: ''
    });

    const [deleteConfirmDrug, setDeleteConfirmDrug] = useState(null);

    const [customPackageTypes, setCustomPackageTypes] = useState(() => {
        try { return JSON.parse(localStorage.getItem('customPackageTypes')) || []; }
        catch { return []; }
    });

    const allPackageTypes = useMemo(() => {
        const types = new Set([...customPackageTypes]);
        drugs.forEach(d => {
            if (d.package_type) {
                types.add(d.package_type);
            }
        });
        return Array.from(types).sort();
    }, [drugs, customPackageTypes]);

    useEffect(() => {
        fetchDrugs();
    }, []);

    const fetchDrugs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/drugs`);
            if (res.data.success) {
                setDrugs(res.data.drugs);
            }
        } catch (err) {
            console.error('Failed to fetch drugs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingDrug(null);
        setDrugForm({
            drug_code: '',
            drug_name: '',
            drug_category: 'CHEMOTHERAPY',
            calculation_type: 'BSA',
            default_weight_type: 'ACTUAL',
            standard_dose_value: '',
            standard_dose_unit: 'mg/m2',
            max_dose_cap: '',
            max_bsa_cap: '',
            max_gfr_cap: '',
            is_active: 1,
            dose_per_pack: '',
            dose_per_pack_unit: 'ml',
            vol_per_pack: '',
            vol_per_pack_unit: 'ml',
            package_type: '',
            inventory_qty: '',
            inventory_min: '',
            inventory_max: '',
            is_auto_dispensed: false,
            packages: [{ dose: '', dose_unit: 'mg', vol: '', vol_unit: 'ml' }],
            prep_instructions: '',
            solvent: '',
            admin_route: '',
            concentration_per_ml: '',
            cost_price: '',
            expire_after_mix_days: '',
            expire_after_mix_hours: '',
            expire_after_recon_days: '',
            warning_msg: '',
            storage_instruction: '',
            infusion_rate: '',
            alert_cumulative_dose: '',
            alert_cumulative_dose_unit: '',
            alert_concentration_max: '',
            diluent_incompat: '',
            note: '',
            myelosuppression: '',
            side_effect_info: '',
            stability_info: '',
            drug_interactions: '',
            usual_dosage: ''
        });
        setShowFormModal(true);
    };

    const handleOpenEditModal = (drug) => {
        setEditingDrug(drug);
        setDrugForm({
            drug_code: drug.drug_code || '',
            drug_name: drug.drug_name || '',
            drug_category: drug.drug_category || 'CHEMOTHERAPY',
            calculation_type: drug.calculation_type || 'BSA',
            default_weight_type: drug.default_weight_type || 'ACTUAL',
            standard_dose_value: drug.standard_dose_value !== null && drug.standard_dose_value !== undefined ? drug.standard_dose_value.toString() : '',
            standard_dose_unit: drug.standard_dose_unit || '',
            max_dose_cap: drug.max_dose_cap !== null && drug.max_dose_cap !== undefined ? drug.max_dose_cap.toString() : '',
            max_bsa_cap: drug.max_bsa_cap !== null && drug.max_bsa_cap !== undefined ? drug.max_bsa_cap.toString() : '',
            max_gfr_cap: drug.max_gfr_cap !== null && drug.max_gfr_cap !== undefined ? drug.max_gfr_cap.toString() : '',
            is_active: drug.is_active !== undefined ? drug.is_active : 1,
            dose_per_pack: drug.dose_per_pack !== null && drug.dose_per_pack !== undefined ? drug.dose_per_pack.toString() : '',
            dose_per_pack_unit: drug.dose_per_pack_unit || 'ml',
            vol_per_pack: drug.vol_per_pack !== null && drug.vol_per_pack !== undefined ? drug.vol_per_pack.toString() : '',
            vol_per_pack_unit: drug.vol_per_pack_unit || 'ml',
            package_type: drug.package_type || '',
            inventory_qty: drug.inventory_qty !== null && drug.inventory_qty !== undefined ? drug.inventory_qty.toString() : '',
            inventory_min: drug.inventory_min !== null && drug.inventory_min !== undefined ? drug.inventory_min.toString() : '',
            inventory_max: drug.inventory_max !== null && drug.inventory_max !== undefined ? drug.inventory_max.toString() : '',
            is_auto_dispensed: drug.is_auto_dispensed === 1,
            packages: drug.packages ? (typeof drug.packages === 'string' ? JSON.parse(drug.packages) : drug.packages) : (drug.dose_per_pack ? [{
                dose: drug.dose_per_pack,
                dose_unit: drug.dose_per_pack_unit || 'mg',
                vol: drug.vol_per_pack || '',
                vol_unit: drug.vol_per_pack_unit || 'ml'
            }] : []),
            prep_instructions: drug.prep_instructions || '',
            solvent: drug.solvent || '',
            admin_route: drug.admin_route || '',
            concentration_per_ml: drug.concentration_per_ml || '',
            cost_price: drug.cost_price || '',
            expire_after_mix_days: drug.expire_after_mix_days || '',
            expire_after_mix_hours: drug.expire_after_mix_hours || '',
            expire_after_recon_days: drug.expire_after_recon_days || '',
            warning_msg: drug.warning_msg || '',
            storage_instruction: drug.storage_instruction || '',
            infusion_rate: drug.infusion_rate || '',
            alert_cumulative_dose: drug.alert_cumulative_dose || '',
            alert_cumulative_dose_unit: drug.alert_cumulative_dose_unit || '',
            alert_concentration_max: drug.alert_concentration_max !== null && drug.alert_concentration_max !== undefined ? drug.alert_concentration_max.toString() : '',
            diluent_incompat: drug.diluent_incompat || '',
            note: drug.note || '',
            myelosuppression: drug.myelosuppression || '',
            side_effect_info: drug.side_effect_info || '',
            stability_info: drug.stability_info || '',
            drug_interactions: drug.drug_interactions || '',
            usual_dosage: drug.usual_dosage || ''
        });
        setShowFormModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!drugForm.drug_name.trim() || !drugForm.calculation_type) {
            if (showNotification) showNotification("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน", "error");
            return;
        }

        const payload = {
            ...drugForm,
            drug_code: drugForm.drug_code.toUpperCase().trim() || null,
            drug_name: drugForm.drug_name.toUpperCase().trim(),
            standard_dose_value: drugForm.standard_dose_value === '' ? null : parseFloat(drugForm.standard_dose_value),
            max_dose_cap: drugForm.max_dose_cap === '' ? null : parseFloat(drugForm.max_dose_cap),
            max_bsa_cap: drugForm.max_bsa_cap === '' ? null : parseFloat(drugForm.max_bsa_cap),
            max_gfr_cap: drugForm.max_gfr_cap === '' ? null : parseInt(drugForm.max_gfr_cap, 10),
            is_active: parseInt(drugForm.is_active, 10),
            package_type: drugForm.package_type,
            inventory_qty: drugForm.inventory_qty === '' ? null : parseFloat(drugForm.inventory_qty),
            inventory_min: drugForm.inventory_min === '' ? null : parseFloat(drugForm.inventory_min),
            inventory_max: drugForm.inventory_max === '' ? null : parseFloat(drugForm.inventory_max),
            is_auto_dispensed: drugForm.is_auto_dispensed ? 1 : 0,
            packages: drugForm.packages,
            prep_instructions: drugForm.prep_instructions,
            solvent: drugForm.solvent,
            admin_route: drugForm.admin_route,
            concentration_per_ml: drugForm.concentration_per_ml,
            cost_price: drugForm.cost_price,
            expire_after_mix_days: drugForm.expire_after_mix_days,
            expire_after_mix_hours: drugForm.expire_after_mix_hours,
            expire_after_recon_days: drugForm.expire_after_recon_days,
            warning_msg: drugForm.warning_msg,
            storage_instruction: drugForm.storage_instruction,
            infusion_rate: drugForm.infusion_rate,
            alert_cumulative_dose: drugForm.alert_cumulative_dose,
            alert_cumulative_dose_unit: drugForm.alert_cumulative_dose_unit,
            alert_concentration_max: drugForm.alert_concentration_max,
            diluent_incompat: drugForm.diluent_incompat,
            note: drugForm.note
        };

        try {
            if (editingDrug) {
                // Update
                const res = await axios.put(`${API_BASE}/admin/drugs/${editingDrug.drug_id}`, payload, {
                    headers: { 'x-employee-id': currentUser?.employee_id }
                });
                if (res.data.success) {
                    if (showNotification) showNotification("แก้ไขข้อมูลยาสำเร็จ", "success");
                    setShowFormModal(false);
                    fetchDrugs();
                }
            } else {
                // Create
                const res = await axios.post(`${API_BASE}/admin/drugs`, payload, {
                    headers: { 'x-employee-id': currentUser?.employee_id }
                });
                if (res.data.success) {
                    if (showNotification) showNotification("เพิ่มยารายการใหม่สำเร็จ", "success");
                    setShowFormModal(false);
                    fetchDrugs();
                }
            }
        } catch (err) {
            console.error("Save drug failed:", err);
            if (showNotification) showNotification(`ไม่สามารถบันทึกข้อมูลยาได้: ${err.response?.data?.message || err.message}`, "error");
        }
    };

    const handleDeleteClick = (drug) => {
        setDeleteConfirmDrug(drug);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmDrug) return;
        try {
            const res = await axios.delete(`${API_BASE}/admin/drugs/${deleteConfirmDrug.drug_id}`, {
                headers: { 'x-employee-id': currentUser?.employee_id }
            });
            if (res.data.success) {
                if (showNotification) showNotification("ลบรายการยาสำเร็จ", "success");
                setDeleteConfirmDrug(null);
                fetchDrugs();
            }
        } catch (err) {
            console.error("Delete drug failed:", err);
            if (showNotification) showNotification(`ไม่สามารถลบข้อมูลยาได้: ${err.response?.data?.message || err.message}`, "error");
        }
    };

    const filteredDrugs = drugs.filter(d => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        
        return (
            d.drug_code?.toLowerCase().includes(q) ||
            d.drug_name?.toLowerCase().includes(q) ||
            d.calculation_type?.toLowerCase().includes(q) ||
            d.standard_dose_unit?.toLowerCase().includes(q)
        );
    });

    const exportToExcel = () => {
        if (!filteredDrugs || filteredDrugs.length === 0) {
            if (showNotification) showNotification('ไม่มีข้อมูลยาสำหรับส่งออก', 'warning');
            return;
        }

        const headers = [
            "CODE", "ชื่อยา", "กลุ่มยา", "ประเภทการคำนวณ", "ขนาดยามาตรฐาน", "หน่วย",
            "จำกัดปริมาณยาสูงสุด (DOSE CAP)", "จำกัดค่าไต (CRCL CAP)", "สถานะ", "ปริมาตร/ขวด", "ขนาดยา/ขวด"
        ];

        const rows = filteredDrugs.map(d => [
            d.drug_code || '-',
            d.drug_name || '-',
            d.drug_category || '-',
            d.calculation_type || '-',
            d.standard_dose_value !== null ? parseFloat(d.standard_dose_value).toFixed(2) : '-',
            d.standard_dose_unit || '-',
            d.max_dose_cap !== null ? parseFloat(d.max_dose_cap).toFixed(2) + ' mg' : 'ไม่มี',
            d.max_gfr_cap !== null ? `${d.max_gfr_cap} ml/min` : 'ไม่มี',
            (d.is_active === 1 || d.is_active === true || d.is_active === '1') ? 'Active' : 'Inactive',
            d.vol_per_pack !== null && d.vol_per_pack !== undefined ? `${d.vol_per_pack} ml` : '-',
            d.dose_per_pack !== null && d.dose_per_pack !== undefined ? `${d.dose_per_pack} ${d.dose_per_pack_unit || 'mg'}` : '-'
        ]);

        const csvContent = "\uFEFF" + 
            headers.join(",") + "\n" + 
            rows.map(e => e.map(item => `"${item}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `ข้อมูลยา_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printAllDrugs = async () => {
        if (!filteredDrugs || filteredDrugs.length === 0) {
            if (showNotification) showNotification('ไม่มีข้อมูลยาสำหรับพิมพ์', 'warning');
            return;
        }

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>พิมพ์ข้อมูลยาทั้งหมด</title>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 landscape; margin: 1.5cm; }
                body { font-family: 'Sarabun', sans-serif; font-size: 12px; color: #000; line-height: 1.5; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
                th { background-color: #f8fafc; font-weight: bold; font-size: 11px; text-transform: uppercase; }
                .text-center { text-align: center; }
                .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
                .status-active { background: #dcfce7; color: #166534; }
                .status-inactive { background: #fee2e2; color: #991b1b; }
            </style>
        </head>
        <body>
            <h2 style="text-align: center; margin-bottom: 20px;">ข้อมูลยาทั้งหมดในระบบ (Drug Information)</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>CODE</th>
                        <th>ชื่อยา</th>
                        <th class="text-center">กลุ่มยา</th>
                        <th>ประเภทการคำนวณ</th>
                        <th>ขนาดยามาตรฐาน</th>
                        <th>หน่วย</th>
                        <th class="text-center">จำกัดปริมาณยาสูงสุด (Dose Cap)</th>
                        <th class="text-center">จำกัดค่าไต (CrCl Cap)</th>
                        <th class="text-center">น้ำหนักที่ใช้</th>
                        <th class="text-center">สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredDrugs.map((drug, idx) => `
                        <tr>
                            <td>${idx + 1}</td>
                            <td><b>${drug.drug_code || '-'}</b></td>
                            <td><b>${drug.drug_name}</b></td>
                            <td class="text-center">${drug.drug_category || '-'}</td>
                            <td>${drug.calculation_type || '-'}</td>
                            <td><b>${drug.standard_dose_value !== null ? parseFloat(drug.standard_dose_value).toFixed(2) : '-'}</b></td>
                            <td>${drug.standard_dose_unit || '-'}</td>
                            <td class="text-center">${drug.max_dose_cap !== null ? parseFloat(drug.max_dose_cap).toFixed(2) + ' mg' : 'ไม่มี'}</td>
                            <td class="text-center">${drug.max_gfr_cap !== null ? drug.max_gfr_cap + ' ml/min' : 'ไม่มี'}</td>
                            <td class="text-center">${drug.default_weight_type || '-'}</td>
                            <td class="text-center">
                                <span class="badge ${drug.is_active === 1 || drug.is_active === true || drug.is_active === '1' ? 'status-active' : 'status-inactive'}">
                                    ${drug.is_active === 1 || drug.is_active === true || drug.is_active === '1' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
        `;

        if (setPreviewData) {
            setPreviewData({
                isOpen: true,
                htmlContent: htmlContent,
                title: 'ตัวอย่างก่อนพิมพ์: ข้อมูลยาทั้งหมด (All Drugs List)',
                printerName: currentUser?.all_drugs_printer,
                onConfirm: async () => {
                    setPreviewData(prev => ({ ...prev, isOpen: false }));
                    if (currentUser?.all_drugs_printer) {
                        if (showNotification) showNotification('กำลังส่งข้อมูลไปยังเครื่องพิมพ์เอกสาร...', 'info');
                        try {
                            const res = await axios.post(currentUser?.use_local_agent ? 'http://localhost:5005/api/print' : `${API_BASE}/print`, {
                                html: htmlContent,
                                printerName: currentUser.all_drugs_printer,
                                isA4: true
                            });
                            if (res.data.success) {
                                if (showNotification) showNotification(`พิมพ์รายการยาไปที่ ${currentUser.all_drugs_printer} สำเร็จ`, 'success');
                                return;
                            }
                        } catch (err) {
                            console.error('Local Print Server error', err);
                            if (showNotification) showNotification('ไม่สามารถพิมพ์ผ่านระบบอัตโนมัติได้ กำลังเปลี่ยนไปพิมพ์ผ่านเบราว์เซอร์...', 'warning');
                        }
                    }

                    const fallbackHtml = htmlContent.replace('</body>', '<script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };</script></body>');
                    const printWindow = window.open('', '_blank', 'width=1000,height=800');
                    if (!printWindow) {
                        if (showNotification) showNotification('โปรดอนุญาตให้เบราว์เซอร์เปิดหน้าต่าง Pop-up เพื่อพิมพ์', 'warning');
                        return;
                    }
                    printWindow.document.open();
                    printWindow.document.write(fallbackHtml);
                    printWindow.document.close();
                }
            });
        } else {
            // Fallback if no preview
            if (currentUser?.all_drugs_printer) {
                if (showNotification) showNotification('กำลังส่งข้อมูลไปยังเครื่องพิมพ์เอกสาร...', 'info');
                try {
                    const res = await axios.post(currentUser?.use_local_agent ? 'http://localhost:5005/api/print' : `${API_BASE}/print`, {
                        html: htmlContent,
                        printerName: currentUser.all_drugs_printer,
                        isA4: true
                    });
                    if (res.data.success) {
                        if (showNotification) showNotification(`พิมพ์รายการยาไปที่ ${currentUser.all_drugs_printer} สำเร็จ`, 'success');
                        return;
                    }
                } catch (err) {
                    console.error('Local Print Server error', err);
                }
            }
            const fallbackHtml = htmlContent.replace('</body>', '<script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };</script></body>');
            const printWindow = window.open('', '_blank', 'width=1000,height=800');
            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(fallbackHtml);
                printWindow.document.close();
            }
        }
    };

    const getCalcTypeLabel = (type) => {
        switch (type) {
            case 'BSA': return 'BSA';
            case 'CALVERT_FORMULA': return 'Calvert';
            case 'FIXED_DOSE': return 'Fixed Dose';
            case 'WEIGHT_BASED': return 'ตามน้ำหนัก';
            default: return type;
        }
    };

    const getCalcTypeColor = (type) => {
        switch (type) {
            case 'BSA': return isDark ? 'bg-sky-950/50 text-sky-400 border-sky-800/50' : 'bg-sky-50 text-sky-700 border-sky-200';
            case 'CALVERT_FORMULA': return isDark ? 'bg-amber-950/50 text-amber-400 border-amber-800/50' : 'bg-amber-50 text-amber-700 border-amber-200';
            case 'FIXED_DOSE': return isDark ? 'bg-purple-950/50 text-purple-400 border-purple-800/50' : 'bg-purple-50 text-purple-700 border-purple-200';
            case 'WEIGHT_BASED': return isDark ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getCategoryLabel = (cat) => {
        switch (cat) {
            case 'CHEMOTHERAPY': return '💊 ยาเคมีบำบัด';
            case 'TARGETED_THERAPY': return '🎯 ยามุ่งเป้า';
            case 'IMMUNOTHERAPY': return '🛡️ ภูมิคุ้มกันบำบัด';
            case 'SUPPORTIVE_CARE': return '🩺 ยาประคับประคอง';
            default: return cat || 'ยาเคมีบำบัด';
        }
    };

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'CHEMOTHERAPY': return isDark ? 'bg-rose-950/50 text-rose-400 border-rose-800/50' : 'bg-rose-50 text-rose-700 border-rose-200';
            case 'TARGETED_THERAPY': return isDark ? 'bg-amber-950/50 text-amber-400 border-amber-800/50' : 'bg-amber-50 text-amber-700 border-amber-200';
            case 'IMMUNOTHERAPY': return isDark ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'SUPPORTIVE_CARE': return isDark ? 'bg-sky-950/50 text-sky-400 border-sky-800/50' : 'bg-sky-50 text-sky-700 border-sky-200';
            default: return isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusBadge = (isActive) => {
        if (isActive === 1 || isActive === true || isActive === '1') {
            
    return (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${isDark ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                    เปิดใช้งาน
                </span>
            );
        }
        
    return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${isDark ? 'bg-red-950/50 text-red-400 border-red-800/50' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                ปิดใช้งาน
            </span>
        );
    };

    
    return (
        <>
        <div className="animate-row-in space-y-6">
            {/* Header */}
            <div className="w-full premium-card p-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 no-print">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer shadow-md ${isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-sky-600 border-slate-200 shadow-sm'
                            }`}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <Pill size={22} className="text-sky-500" />
                            ข้อมูลยาทั้งหมดในระบบ (Drug Information)
                        </h2>
                        <p className="text-xs opacity-70">รายการยาที่ใช้ในการคำนวณขนาดยาทั้งหมดในระบบ ดึงข้อมูลจากฐานข้อมูล</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto self-stretch xl:self-auto justify-start xl:justify-end">
                    <div className="relative flex-1 md:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อยา..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-9 pr-4 py-2 rounded-xl text-sm font-bold border transition-all w-full md:w-[220px] ${isDark
                                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-sky-500'
                                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 shadow-sm'
                                }`}
                        />
                    </div>
                    <button
                        onClick={printAllDrugs}
                        className={`text-sm py-2 px-4 rounded-xl border flex items-center gap-2 cursor-pointer shrink-0 shadow-sm transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'}`}
                        title="พิมพ์ข้อมูลยาทั้งหมด"
                    >
                        <Printer size={16} /> พิมพ์
                    </button>
                    <button
                        onClick={exportToExcel}
                        className={`text-sm py-2 px-4 rounded-xl border flex items-center gap-2 cursor-pointer shrink-0 shadow-sm transition-colors text-white bg-green-600 hover:bg-green-700 border-green-600`}
                        title="ส่งออกข้อมูลเป็น Excel"
                    >
                        <Download size={16} /> Excel
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setShowRulesManager(true)}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-sm py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer shrink-0 shadow-md transition-colors"
                            >
                                <Shield size={16} /> จัดการกฎข้อห้ามสารละลาย
                            </button>
                            <button
                                onClick={handleOpenAddModal}
                                className="btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
                            >
                                <Plus size={16} /> เพิ่มยาใหม่
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`premium-card p-4 border-l-4 border-l-sky-500 flex items-center gap-4 transition-all hover:translate-y-[-2px]`}>
                    <div className={`p-2.5 rounded-xl ${isDark ? 'bg-sky-950/40 text-sky-400' : 'bg-sky-100 text-sky-600'}`}>
                        <Pill size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">ยาทั้งหมด</p>
                        <p className="text-2xl font-black">{drugs.length}</p>
                    </div>
                </div>
                <div className={`premium-card p-4 border-l-4 border-l-emerald-500 flex items-center gap-4 transition-all hover:translate-y-[-2px]`}>
                    <div className={`p-2.5 rounded-xl ${isDark ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">เปิดใช้งาน</p>
                        <p className="text-2xl font-black">{drugs.filter(d => d.is_active === 1 || d.is_active === true || d.is_active === '1').length}</p>
                    </div>
                </div>
                <div className={`premium-card p-4 border-l-4 border-l-amber-500 flex items-center gap-4 transition-all hover:translate-y-[-2px]`}>
                    <div className={`p-2.5 rounded-xl ${isDark ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                        <FlaskConical size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">ประเภทการคำนวณ</p>
                        <p className="text-2xl font-black">{new Set(drugs.map(d => d.calculation_type)).size}</p>
                    </div>
                </div>
                <div className={`premium-card p-4 border-l-4 border-l-rose-500 flex items-center gap-4 transition-all hover:translate-y-[-2px]`}>
                    <div className={`p-2.5 rounded-xl ${isDark ? 'bg-rose-950/40 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">ยาที่มีการจำกัดปริมาณยาสูงสุด (Dose Cap)</p>
                        <p className="text-2xl font-black">{drugs.filter(d => d.max_dose_cap !== null && d.max_dose_cap !== undefined).length}</p>
                    </div>
                </div>
            </div>

            {/* Drug Table */}
            <div className="premium-card overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold opacity-60">กำลังโหลดข้อมูลยา...</p>
                    </div>
                ) : filteredDrugs.length === 0 ? (
                    <div className="p-10 text-center opacity-60">
                        <Pill size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-bold">ไม่พบข้อมูลยาที่ตรงกับการค้นหา</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className={`border-b ${isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[3%]">#</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[10%]">CODE</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[15%]">ชื่อยา</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[12%] text-center">กลุ่มยา</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[13%]">ประเภทการคำนวณ</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[10%]">ขนาดยามาตรฐาน</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[7%]">หน่วย</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[9%] text-center">จำกัดปริมาณยาสูงสุด (Dose Cap)</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black tracking-wider opacity-60 w-[9%] text-center">จำกัดค่าไต (CrCl Cap)</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[9%] text-center">น้ำหนักที่ใช้</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[7%] text-center">สถานะ</th>
                                    <th className="px-2.5 py-3 text-[11px] font-black uppercase tracking-wider opacity-60 w-[8%] text-center no-print">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDrugs.map((drug, idx) => (
                                    <tr
                                        key={drug.drug_id}
                                        onDoubleClick={() => {
                                            if (isAdmin) {
                                                handleOpenEditModal(drug);
                                            }
                                        }}
                                        title={isAdmin ? "ดับเบิ้ลคลิกเพื่อแก้ไข" : ""}
                                        className={`border-b transition-colors ${isAdmin ? 'cursor-pointer' : ''} ${isDark
                                            ? 'border-slate-700/30 hover:bg-slate-800/40'
                                            : 'border-slate-100 hover:bg-sky-50/50'
                                            }`}
                                    >
                                        <td className="px-2.5 py-3 font-mono text-xs opacity-50">{idx + 1}</td>
                                        <td className="px-2.5 py-3 font-bold text-xs text-sky-500 dark:text-sky-400">
                                            {drug.drug_code || <span className="opacity-45 font-normal italic">ไม่มีโค้ด</span>}
                                        </td>
                                        <td className="px-2.5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${drug.calculation_type === 'BSA' ? (isDark ? 'bg-sky-950/60 text-sky-400' : 'bg-sky-100 text-sky-600')
                                                    : drug.calculation_type === 'CALVERT_FORMULA' ? (isDark ? 'bg-amber-950/60 text-amber-400' : 'bg-amber-100 text-amber-600')
                                                        : drug.calculation_type === 'FIXED_DOSE' ? (isDark ? 'bg-purple-950/60 text-purple-400' : 'bg-purple-100 text-purple-600')
                                                            : (isDark ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                                                    }`}>
                                                    <Pill size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm uppercase tracking-wide">{drug.drug_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2.5 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border whitespace-nowrap ${getCategoryColor(drug.drug_category)}`}>
                                                {getCategoryLabel(drug.drug_category)}
                                            </span>
                                        </td>
                                        <td className="px-2.5 py-3">
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border whitespace-nowrap ${getCalcTypeColor(drug.calculation_type)}`}>
                                                {getCalcTypeLabel(drug.calculation_type)}
                                            </span>
                                        </td>
                                        <td className="px-2.5 py-3">
                                            <span className="font-black text-sm">
                                                {drug.standard_dose_value !== null ? parseFloat(drug.standard_dose_value).toFixed(2) : '-'}
                                            </span>
                                        </td>
                                        <td className="px-2.5 py-3">
                                            <span className="font-bold text-xs opacity-70">{drug.standard_dose_unit || '-'}</span>
                                        </td>
                                        <td className="px-2.5 py-3 text-center">
                                            {drug.max_dose_cap !== null && drug.max_dose_cap !== undefined ? (
                                                <span className={`px-2 py-0.5 rounded-lg text-xs font-black border whitespace-nowrap ${isDark ? 'bg-rose-950/40 text-rose-400 border-rose-800/40' : 'bg-rose-50 text-rose-600 border-rose-200'
                                                    }`}>
                                                    {parseFloat(drug.max_dose_cap).toFixed(2)} mg
                                                </span>
                                            ) : (
                                                <span className="text-xs opacity-40 font-bold">ไม่มี</span>
                                            )}
                                        </td>
                                        <td className="px-2.5 py-3 text-center">
                                            {drug.max_gfr_cap !== null && drug.max_gfr_cap !== undefined ? (
                                                <span className={`px-2 py-0.5 rounded-lg text-xs font-black border whitespace-nowrap ${isDark ? 'bg-amber-950/40 text-amber-400 border-amber-800/40' : 'bg-amber-50 text-amber-600 border-amber-200'
                                                    }`}>
                                                    {drug.max_gfr_cap} ml/min
                                                </span>
                                            ) : (
                                                <span className="text-xs opacity-40 font-bold">ไม่มี</span>
                                            )}
                                        </td>
                                        <td className="px-2.5 py-3 text-center">
                                            <span className="text-xs font-bold opacity-70">{drug.default_weight_type || '-'}</span>
                                        </td>
                                        <td className="px-2.5 py-3 text-center">
                                            {getStatusBadge(drug.is_active)}
                                        </td>
                                        <td className="px-2.5 py-3 text-center no-print">
                                            <div className="flex justify-center gap-1.5">
                                                <button
                                                    onClick={() => setViewingDrugInfo(drug)}
                                                    className={`p-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${isDark
                                                        ? 'bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 hover:text-emerald-300 border-emerald-900/50'
                                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 border-emerald-200 shadow-sm'
                                                        }`}
                                                    title="ดูรายละเอียดเพิ่มเติม"
                                                >
                                                    <FlaskConical size={14} />
                                                </button>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => handleOpenEditModal(drug)}
                                                            className={`p-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${isDark
                                                                ? 'bg-sky-950/30 hover:bg-sky-900/40 text-sky-400 hover:text-sky-300 border-sky-900/50'
                                                                : 'bg-sky-50 hover:bg-sky-100 text-sky-600 hover:text-sky-700 border-sky-200 shadow-sm'
                                                                }`}
                                                            title="แก้ไข"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(drug)}
                                                            className={`p-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${isDark
                                                                ? 'bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 border-rose-900/50'
                                                                : 'bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border-rose-200 shadow-sm'
                                                                }`}
                                                            title="ลบ"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

            {/* Form Modal (Add / Edit) */}
            {showFormModal && (
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="flex min-h-full items-start justify-center p-4 md:p-10">
                        <div className="premium-card p-6 md:p-8 w-full max-w-[75%] animate-pop relative border-sky-500/50">
                        <button
                            onClick={() => setShowFormModal(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="font-black text-lg mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-3">
                            <Pill size={18} className="text-sky-500 dark:text-sky-400" />
                            {editingDrug ? "แก้ไขข้อมูลยา" : "เพิ่มยารายการใหม่"}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* ดึงข้อมูลยาที่มีอยู่แล้ว */}
                            <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase flex items-center gap-2 text-sky-600 dark:text-sky-400">
                                    <Search size={14} /> ค้นหารายชื่อยา (เลือกเพื่อดึงข้อมูลมาแก้ไข)
                                </label>
                                <select
                                    className="form-control text-sm font-bold text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-900 focus:border-sky-500"
                                    onChange={(e) => {
                                        if(e.target.value) {
                                            const selected = drugs.find(d => d.drug_id.toString() === e.target.value);
                                            if(selected) {
                                                handleOpenEditModal(selected);
                                            }
                                        } else {
                                            handleOpenAddModal();
                                        }
                                    }}
                                    value={editingDrug ? editingDrug.drug_id : ""}
                                >
                                    <option value="">+ เพิ่มข้อมูลยาใหม่ (New Drug)</option>
                                    {drugs.map(d => (
                                        <option key={d.drug_id} value={d.drug_id}>[ {d.drug_code || '-'} ] {d.drug_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">รหัสยา (Drug Code)</label>
                                    <input
                                        type="text"
                                        placeholder="ตัวอย่างเช่น H0201208"
                                        className="form-control text-sm uppercase"
                                        value={drugForm.drug_code}
                                        onChange={e => setDrugForm({ ...drugForm, drug_code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ชื่อยา (Generic / Trade Name) *</label>
                                    <input
                                        type="text"
                                        placeholder="ตัวอย่างเช่น CISPLATIN"
                                        className="form-control text-sm uppercase"
                                        value={drugForm.drug_name}
                                        onChange={e => setDrugForm({ ...drugForm, drug_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">กลุ่มยา *</label>
                                    <select
                                        className="form-control text-sm"
                                        value={drugForm.drug_category}
                                        onChange={e => setDrugForm({ ...drugForm, drug_category: e.target.value })}
                                        required
                                    >
                                        <option value="CHEMOTHERAPY">💊 ยาเคมีบำบัด (Chemotherapy)</option>
                                        <option value="TARGETED_THERAPY">🎯 ยามุ่งเป้า (Targeted Therapy)</option>
                                        <option value="IMMUNOTHERAPY">🛡️ ยากลุ่มภูมิคุ้มกันบำบัด (Immunotherapy)</option>
                                        <option value="SUPPORTIVE_CARE">🩺 ยาประคับประคอง (Supportive Care)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ประเภทการคำนวณหลัก *</label>
                                    <select
                                        className="form-control text-sm"
                                        value={drugForm.calculation_type}
                                        onChange={e => setDrugForm({ ...drugForm, calculation_type: e.target.value })}
                                        required
                                    >
                                        <option value="BSA">BSA (คำนวณตามพื้นที่ผิวร่างกาย)</option>
                                        <option value="CALVERT_FORMULA">CALVERT_FORMULA (สำหรับ Carboplatin)</option>
                                        <option value="FIXED_DOSE">FIXED_DOSE (ขนาดยาคงที่)</option>
                                        <option value="WEIGHT_BASED">WEIGHT_BASED (คำนวณตามน้ำหนักตัว)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ประเภทน้ำหนักแนะนำ</label>
                                    <select
                                        className="form-control text-sm"
                                        value={drugForm.default_weight_type}
                                        onChange={e => setDrugForm({ ...drugForm, default_weight_type: e.target.value })}
                                    >
                                        <option value="ACTUAL">Actual (น้ำหนักจริง)</option>
                                        <option value="IDEAL">Ideal (น้ำหนักในอุดมคติ)</option>
                                        <option value="ADJUSTED">Adjusted (น้ำหนักปรับปรุง)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ขนาดยาเริ่มต้น (Standard Dose)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="เช่น 1.40, 30.00, 75.00"
                                        className="form-control text-sm"
                                        value={drugForm.standard_dose_value}
                                        onChange={e => setDrugForm({ ...drugForm, standard_dose_value: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">หน่วยขนาดยามาตรฐาน</label>
                                    <input
                                        type="text"
                                        placeholder="เช่น mg/m2, units, Target AUC"
                                        className="form-control text-sm"
                                        value={drugForm.standard_dose_unit}
                                        onChange={e => setDrugForm({ ...drugForm, standard_dose_unit: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-2">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">จำกัดขนาดยาสูงสุด (Dose Cap mg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="ไม่มี (เว้นว่างไว้)"
                                        className="form-control text-sm"
                                        value={drugForm.max_dose_cap}
                                        onChange={e => setDrugForm({ ...drugForm, max_dose_cap: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">จำกัดพื้นที่ผิวร่างกายสูงสุด (Max BSA m²)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="ไม่มี (เว้นว่างไว้)"
                                        className="form-control text-sm"
                                        value={drugForm.max_bsa_cap}
                                        onChange={e => setDrugForm({ ...drugForm, max_bsa_cap: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 ml-1">จำกัดค่าการทำงานไตสูงสุด (Max CrCl ml/min)</label>
                                    <input
                                        type="number"
                                        placeholder="เช่น 125"
                                        className="form-control text-sm"
                                        value={drugForm.max_gfr_cap}
                                        onChange={e => setDrugForm({ ...drugForm, max_gfr_cap: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">สถานะใช้งาน</label>
                                <select
                                    className="form-control text-sm"
                                    value={drugForm.is_active}
                                    onChange={e => setDrugForm({ ...drugForm, is_active: e.target.value })}
                                >
                                    <option value={1}>เปิดการใช้งาน (Active)</option>
                                    <option value={0}>ปิดการใช้งาน (Inactive)</option>
                                </select>
                            </div>

                            {/* Additional Drug Details Section */}
                            <h4 className="font-black text-sm mt-6 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                                <FlaskConical size={16} className="text-amber-500" />
                                ข้อมูลทางเทคนิคและข้อควรระวัง (Technical & Warnings)
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">รายละเอียดวิธีการผสมยา</label>
                                    <textarea className="form-control text-sm min-h-[60px]" placeholder="เช่น นำผงยาผสมกับน้ำเกลือ 5 ml จะได้ความเข้มข้น 3 mg/ml" value={drugForm.prep_instructions} onChange={e => setDrugForm({...drugForm, prep_instructions: e.target.value})}></textarea>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ราคาทุน (บาท)</label>
                                    <input type="number" step="0.01" className="form-control text-sm" value={drugForm.cost_price} onChange={e => setDrugForm({...drugForm, cost_price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">หมดอายุหลังผสม (Mix)</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input type="number" className="form-control text-sm pr-8" value={drugForm.expire_after_mix_days} onChange={e => setDrugForm({...drugForm, expire_after_mix_days: e.target.value})} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 font-bold">วัน</span>
                                        </div>
                                        <div className="relative flex-1">
                                            <input type="number" className="form-control text-sm pr-8" value={drugForm.expire_after_mix_hours} onChange={e => setDrugForm({...drugForm, expire_after_mix_hours: e.target.value})} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 font-bold">ชม.</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">หมดอายุหลัง Recon.</label>
                                    <div className="relative">
                                        <input type="number" className="form-control text-sm pr-8" value={drugForm.expire_after_recon_days} onChange={e => setDrugForm({...drugForm, expire_after_recon_days: e.target.value})} />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 font-bold">วัน</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">อัตราเร็วในการให้ยา (Infusion Rate)</label>
                                    <input type="text" className="form-control text-sm" value={drugForm.infusion_rate} onChange={e => setDrugForm({...drugForm, infusion_rate: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1 text-rose-500">แจ้งเตือน Cumulative dose</label>
                                    <div className="flex gap-2">
                                        <input type="number" step="0.01" className="form-control text-sm flex-1" value={drugForm.alert_cumulative_dose} onChange={e => setDrugForm({...drugForm, alert_cumulative_dose: e.target.value})} />
                                        <select className="form-control text-sm flex-1" value={drugForm.alert_cumulative_dose_unit} onChange={e => setDrugForm({...drugForm, alert_cumulative_dose_unit: e.target.value})}>
                                            <option value="">(หน่วย)</option>
                                            <option value="mg">mg</option>
                                            <option value="mg/m2">mg/m2</option>
                                            <option value="g">g</option>
                                            <option value="g/m2">g/m2</option>
                                            <option value="Units">Units</option>
                                            <option value="Units/m2">Units/m2</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1 text-rose-500">แจ้งเตือนความเข้มข้นสูงสุด (MAX mg/ml.)</label>
                                    <input type="number" step="0.01" className="form-control text-sm" value={drugForm.alert_concentration_max} onChange={e => setDrugForm({...drugForm, alert_concentration_max: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ยาที่ห้ามผสมร่วมกัน (Incompat.)</label>
                                    <select className="form-control text-sm" value={drugForm.diluent_incompat || ''} onChange={e => setDrugForm({...drugForm, diluent_incompat: e.target.value})}>
                                        <option value="">-- ไม่ระบุ (Empty) --</option>
                                        <option value="Dextrose Incompatibility">Dextrose Incompatibility</option>
                                        <option value="NaCl Incompatibility">NaCl Incompatibility</option>
                                        <option value="NaCl Inclusive">NaCl Inclusive</option>
                                        <option value="Dextrose Inclusive">Dextrose Inclusive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1 text-rose-500">คำเตือน (WARNING)</label>
                                    <textarea className="form-control text-sm min-h-[60px]" placeholder="เช่น ระวังแพ้ยา" value={drugForm.warning_msg} onChange={e => setDrugForm({...drugForm, warning_msg: e.target.value})}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1 text-sky-600 dark:text-sky-400">การเก็บรักษา (STORAGE)</label>
                                    <textarea className="form-control text-sm min-h-[60px]" placeholder="เช่น เก็บในตู้เย็น 2-8 องศา" value={drugForm.storage_instruction} onChange={e => setDrugForm({...drugForm, storage_instruction: e.target.value})}></textarea>
                                </div>
                            </div>

                            {/* Clinical Info Section */}
                            <h4 className="font-black text-sm mt-6 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                                <Stethoscope size={16} className="text-purple-500" />
                                ข้อมูลเชิงการแพทย์
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ภาวะกดไขกระดูก (Myelosuppression)</label>
                                    <input type="text" className="form-control text-sm" placeholder="e.g. Mild, Moderate, Severe" value={drugForm.myelosuppression} onChange={e => setDrugForm({...drugForm, myelosuppression: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ผลข้างเคียง (Side effect)</label>
                                    <textarea className="form-control text-sm min-h-[40px]" placeholder="e.g. Anaphylaxis, Alopecia" value={drugForm.side_effect_info} onChange={e => setDrugForm({...drugForm, side_effect_info: e.target.value})}></textarea>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ความคงตัว (Stability & Reconstitution)</label>
                                    <textarea className="form-control text-sm min-h-[60px]" placeholder="e.g. reconstitute with NSS for I.M.; stable for 7 days at RT" value={drugForm.stability_info} onChange={e => setDrugForm({...drugForm, stability_info: e.target.value})}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ปฏิกิริยาระหว่างยา (Drug interactions)</label>
                                    <textarea className="form-control text-sm min-h-[60px]" placeholder="e.g. - Decreased effect: Methotrexate" value={drugForm.drug_interactions} onChange={e => setDrugForm({...drugForm, drug_interactions: e.target.value})}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ขนาดยาปกติ (Usual dosage)</label>
                                    <textarea className="form-control text-sm min-h-[60px]" placeholder="e.g. 6000 IU/m2 every other day for 3-4 weeks" value={drugForm.usual_dosage} onChange={e => setDrugForm({...drugForm, usual_dosage: e.target.value})}></textarea>
                                </div>
                            </div>

                            {/* Inventory Section */}
                            <div className="mt-6 mb-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50 pb-2">
                                <h4 className="font-black text-sm flex items-center gap-2">
                                    <Package size={16} className="text-emerald-500" />
                                    ข้อมูลบรรจุภัณฑ์ (Package Information)
                                </h4>
                                <button type="button" className="text-xs btn-secondary py-1 px-3 rounded-lg border bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold" onClick={() => setDrugForm({...drugForm, packages: [...(drugForm.packages || []), { dose: '', dose_unit: 'mg', vol: '', vol_unit: 'ml' }]})}>
                                    + เพิ่มขนาดบรรจุ
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ภาชนะบรรจุ (รวมทุกขนาด)</label>
                                <div className="flex gap-1 items-center">
                                    <input type="text" className="form-control text-sm" placeholder="เช่น Vial, Ampoule" value={drugForm.package_type || ''} onChange={e => setDrugForm({...drugForm, package_type: e.target.value})} list="package-type-list" />
                                    <datalist id="package-type-list">
                                        {allPackageTypes.map(pt => (
                                            <option key={pt} value={pt} />
                                        ))}
                                    </datalist>
                                    {drugForm.package_type && !allPackageTypes.includes(drugForm.package_type) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const val = drugForm.package_type.trim();
                                                if (!val) return;
                                                const newCustom = [...customPackageTypes, val];
                                                setCustomPackageTypes(newCustom);
                                                localStorage.setItem('customPackageTypes', JSON.stringify(newCustom));
                                            }}
                                            className="bg-sky-100 text-sky-600 hover:bg-sky-200 border border-sky-200 px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap animate-in fade-in"
                                            title="บันทึกภาชนะบรรจุใหม่ไว้ใช้ในอนาคต"
                                        >
                                            + บันทึก
                                        </button>
                                    )}
                                </div>
                            </div>
                            {(!drugForm.packages || drugForm.packages.length === 0) ? (
                                <div className="text-sm text-slate-500 italic py-4 text-center border border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">ไม่มีข้อมูลขนาดบรรจุ กดเพิ่มขนาดบรรจุด้านบน</div>
                            ) : (
                                <div className="space-y-4">
                                {drugForm.packages.map((pkg, idx) => (
                                    <div key={idx} className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-800 relative shadow-sm border-slate-200 dark:border-slate-700">
                                        <button type="button" className="absolute top-2 right-2 text-rose-400 hover:text-rose-600 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm border border-rose-100 dark:border-rose-900" onClick={() => {
                                            const newPkgs = [...drugForm.packages];
                                            newPkgs.splice(idx, 1);
                                            setDrugForm({...drugForm, packages: newPkgs});
                                        }} title="ลบขนาดบรรจุนี้"><X size={14} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ขนาดยา / ภาชนะบรรจุ</label>
                                                <div className="flex">
                                                    <input type="number" step="0.01" className="form-control text-sm rounded-r-none border-r-0 focus:z-10 bg-white" placeholder="เช่น 50" value={pkg.dose} onChange={e => {
                                                        const newPkgs = [...drugForm.packages];
                                                        newPkgs[idx].dose = e.target.value;
                                                        setDrugForm({...drugForm, packages: newPkgs});
                                                    }} />
                                                    <select className="form-control text-sm rounded-l-none w-24 bg-slate-100 dark:bg-slate-700 focus:z-10 cursor-pointer font-bold border-l border-slate-200" value={pkg.dose_unit || 'mg'} onChange={e => {
                                                        const newPkgs = [...drugForm.packages];
                                                        newPkgs[idx].dose_unit = e.target.value;
                                                        setDrugForm({...drugForm, packages: newPkgs});
                                                    }}>
                                                        <option value="ml">ML</option>
                                                        <option value="mg">MG</option>
                                                        <option value="g">G</option>
                                                        <option value="mcg">MCG</option>
                                                        <option value="IU">IU</option>
                                                        <option value="หน่วย">หน่วย</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ปริมาตร / ภาชนะบรรจุ</label>
                                                <div className="flex">
                                                    <input type="number" step="0.01" className="form-control text-sm rounded-r-none border-r-0 focus:z-10 bg-white" placeholder="เช่น 1" value={pkg.vol} onChange={e => {
                                                        const newPkgs = [...drugForm.packages];
                                                        newPkgs[idx].vol = e.target.value;
                                                        setDrugForm({...drugForm, packages: newPkgs});
                                                    }} />
                                                    <select className="form-control text-sm rounded-l-none w-24 bg-slate-100 dark:bg-slate-700 focus:z-10 cursor-pointer font-bold border-l border-slate-200" value={pkg.vol_unit || 'ml'} onChange={e => {
                                                        const newPkgs = [...drugForm.packages];
                                                        newPkgs[idx].vol_unit = e.target.value;
                                                        setDrugForm({...drugForm, packages: newPkgs});
                                                    }}>
                                                        <option value="ml">ML</option>
                                                        <option value="l">L</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className={`w-1/2 py-3 px-4 rounded-xl border text-sm font-bold transition-all active:scale-95 cursor-pointer text-center ${isDark
                                        ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                                        : 'border-slate-200 hover:bg-slate-100 text-slate-600 shadow-sm'
                                        }`}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 btn-primary text-sm py-3 px-4 flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> บันทึกข้อมูล
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            )}

            {/* Drug Info View Modal */}
            {viewingDrugInfo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="premium-card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
                            <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                <Stethoscope size={20} />
                                ข้อมูลยา : {viewingDrugInfo.drug_name}
                            </h3>
                            <button
                                onClick={() => setViewingDrugInfo(null)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 flex-1 space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            
                            {/* ข้อมูลพื้นฐาน (General Info) */}
                            <div>
                                <h4 className="font-bold text-sky-600 dark:text-sky-400 mb-3 flex items-center gap-2 border-b border-sky-100 dark:border-sky-900/50 pb-2">
                                    <Info size={16} /> ข้อมูลพื้นฐาน
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-28">รหัสยา:</span>
                                        <span className="font-mono text-slate-800 dark:text-slate-200">{viewingDrugInfo.drug_code || '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-28">กลุ่มยา:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.drug_category || '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-28">การคำนวณตั้งต้น:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.calculation_type || '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-28">น้ำหนักตั้งต้น:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.default_weight_type === 'ACTUAL' ? 'น้ำหนักจริง (Actual)' : viewingDrugInfo.default_weight_type === 'IDEAL' ? 'น้ำหนักอุดมคติ (Ideal)' : viewingDrugInfo.default_weight_type || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ขนาดยาและข้อจำกัด (Dosing & Limits) */}
                            <div>
                                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
                                    <ShieldAlert size={16} /> ขนาดยาและข้อจำกัด
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-40">ขนาดยามาตรฐาน:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.standard_dose_value ? `${viewingDrugInfo.standard_dose_value} ${viewingDrugInfo.standard_dose_unit || ''}` : '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-40">จำกัดขนาดสูงสุดต่อครั้ง:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.max_dose_cap ? `${viewingDrugInfo.max_dose_cap} mg` : '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-40">จำกัดตามพื้นที่ผิว:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.max_bsa_cap ? `${viewingDrugInfo.max_bsa_cap} m²` : '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-40">จำกัดตามค่าการทำงานไต:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.max_gfr_cap ? `${viewingDrugInfo.max_gfr_cap} ml/min` : '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-40">จำกัดขนาดยาสะสม:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.alert_cumulative_dose ? `${viewingDrugInfo.alert_cumulative_dose} ${viewingDrugInfo.alert_cumulative_dose_unit || 'mg'}` : '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-40">ความเข้มข้นสูงสุด:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.alert_concentration_max ? `${viewingDrugInfo.alert_concentration_max} mg/ml` : '-'}</span>
                                    </div>
                                </div>
                                {viewingDrugInfo.usual_dosage && (
                                    <div className="mt-3">
                                        <span className="font-semibold text-slate-500 block mb-1">ขนาดยาปกติ (Usual dosage):</span>
                                        <div className="pl-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                                            {viewingDrugInfo.usual_dosage}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ขนาดยาที่มีในระบบ (Available Packages) */}
                            <div>
                                <h4 className="font-bold text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-2 border-b border-violet-100 dark:border-violet-900/50 pb-2">
                                    <Package size={16} /> ขนาดยาที่มีในระบบ
                                </h4>
                                <div className="space-y-2">
                                    {(() => {
                                        const packages = typeof viewingDrugInfo.packages === 'string' 
                                            ? JSON.parse(viewingDrugInfo.packages || '[]') 
                                            : (viewingDrugInfo.packages || []);
                                        
                                        if (packages.length > 0) {
                                            return packages.map((pkg, i) => (
                                                <div key={i} className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    <span className="font-bold text-violet-500">ขนาดที่ {i+1}:</span>
                                                    <span className="text-slate-800 dark:text-slate-200">
                                                        {pkg.dose} {pkg.dose_unit} {pkg.vol ? ` / ${pkg.vol} ${pkg.vol_unit}` : ''}
                                                    </span>
                                                </div>
                                            ));
                                        } else if (viewingDrugInfo.dose_per_pack) {
                                            return (
                                                <div className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    <span className="font-bold text-violet-500">ขนาด:</span>
                                                    <span className="text-slate-800 dark:text-slate-200">
                                                        {viewingDrugInfo.dose_per_pack} {viewingDrugInfo.dose_per_pack_unit} {viewingDrugInfo.vol_per_pack ? ` / ${viewingDrugInfo.vol_per_pack} ${viewingDrugInfo.vol_per_pack_unit}` : ''}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return <span className="text-slate-400 italic">ไม่มีข้อมูลขนาดยาในระบบ</span>;
                                    })()}
                                </div>
                            </div>

                            {/* การบริหารยาและการเตรียมยา (Administration & Preparation) */}
                            <div>
                                <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2 border-b border-amber-100 dark:border-amber-900/50 pb-2">
                                    <Syringe size={16} /> การเตรียมและการให้ยา
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-3">
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36">ช่องทางการให้ยา:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.admin_route || '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36">สารละลายที่แนะนำ:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.solvent || '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36">ความเข้มข้น:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.concentration_per_ml || '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36">อัตราการให้ยา:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.infusion_rate || '-'}</span>
                                    </div>
                                    <div className="flex gap-2 sm:col-span-2">
                                        <span className="font-semibold text-rose-500 w-36">สารน้ำที่ห้ามใช้ร่วม:</span>
                                        <span className="text-rose-600 dark:text-rose-400">{viewingDrugInfo.diluent_incompat || '-'}</span>
                                    </div>
                                </div>
                                {viewingDrugInfo.prep_instructions && (
                                    <div>
                                        <span className="font-semibold text-slate-500 block mb-1">การเตรียมยา (Prep instructions):</span>
                                        <div className="pl-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200 border-l-2 border-amber-200 dark:border-amber-900/50">
                                            {viewingDrugInfo.prep_instructions}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* อายุยาและการเก็บรักษา (Expiration & Storage) */}
                            <div>
                                <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2 border-b border-teal-100 dark:border-teal-900/50 pb-2">
                                    <Thermometer size={16} /> อายุยาและการเก็บรักษา
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-3">
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36">อายุหลังละลาย:</span>
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.expire_after_recon_days ? `${viewingDrugInfo.expire_after_recon_days} วัน` : '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36">อายุหลังผสม:</span>
                                        <span className="text-slate-800 dark:text-slate-200">
                                            {viewingDrugInfo.expire_after_mix_days ? `${viewingDrugInfo.expire_after_mix_days} วัน ` : ''}
                                            {viewingDrugInfo.expire_after_mix_hours ? `${viewingDrugInfo.expire_after_mix_hours} ชม.` : ''}
                                            {!viewingDrugInfo.expire_after_mix_days && !viewingDrugInfo.expire_after_mix_hours ? '-' : ''}
                                        </span>
                                    </div>
                                </div>
                                {viewingDrugInfo.storage_instruction && (
                                    <div>
                                        <span className="font-semibold text-slate-500 block mb-1">การเก็บรักษา (Storage):</span>
                                        <div className="pl-4 whitespace-pre-wrap text-teal-700 dark:text-teal-300 border-l-2 border-teal-200 dark:border-teal-900/50">
                                            {viewingDrugInfo.storage_instruction}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ข้อมูลเชิงการแพทย์ */}
                            <div>
                                <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2 border-b border-rose-100 dark:border-rose-900/50 pb-2">
                                    <Stethoscope size={16} /> ข้อมูลเชิงการแพทย์
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36 shrink-0">ภาวะกดไขกระดูก:</span> 
                                        <span className={viewingDrugInfo.myelosuppression?.toLowerCase().includes('severe') ? 'text-rose-500 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                                            {viewingDrugInfo.myelosuppression || '-'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-semibold text-slate-500 w-36 shrink-0">ผลข้างเคียง:</span> 
                                        <span className="text-slate-800 dark:text-slate-200">{viewingDrugInfo.side_effect_info || '-'}</span>
                                    </div>
                                    {viewingDrugInfo.stability_info && (
                                        <div>
                                            <span className="font-semibold text-slate-500 block mb-1">ความคงตัว:</span>
                                            <div className="pl-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200 border-l-2 border-slate-300 dark:border-slate-600">
                                                {viewingDrugInfo.stability_info}
                                            </div>
                                        </div>
                                    )}
                                    {viewingDrugInfo.drug_interactions && (
                                        <div>
                                            <span className="font-semibold text-slate-500 block mb-1">ปฏิกิริยาระหว่างยา:</span>
                                            <div className="pl-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200 border-l-2 border-rose-300 dark:border-rose-600">
                                                {viewingDrugInfo.drug_interactions}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* หมายเหตุและคำเตือน (Note & Warning) */}
                            {(viewingDrugInfo.warning_msg || viewingDrugInfo.note) && (
                                <div>
                                    <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                        <MessageSquare size={16} /> หมายเหตุและคำเตือน
                                    </h4>
                                    <div className="space-y-3">
                                        {viewingDrugInfo.warning_msg && (
                                            <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
                                                <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1 flex items-center gap-1">
                                                    <AlertTriangle size={14} /> คำเตือน (Warning)
                                                </span>
                                                <div className="text-rose-700 dark:text-rose-300 whitespace-pre-wrap">
                                                    {viewingDrugInfo.warning_msg}
                                                </div>
                                            </div>
                                        )}
                                        {viewingDrugInfo.note && (
                                            <div>
                                                <span className="font-semibold text-slate-500 block mb-1">หมายเหตุ:</span>
                                                <div className="pl-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200 border-l-2 border-slate-300 dark:border-slate-600">
                                                    {viewingDrugInfo.note}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirmDrug && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="premium-card p-6 md:p-8 w-full max-w-sm animate-pop relative border-rose-500/30">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-3 text-rose-500">
                            <Trash2 size={18} />
                            ยืนยันการลบรายการยา
                        </h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            คุณแน่ใจหรือไม่ที่จะลบรายการยา <strong className="text-rose-500 text-lg mx-1">{deleteConfirmDrug.drug_name}</strong> ออกจากระบบ? การกระทำนี้ไม่สามารถกู้คืนข้อมูลกลับมาได้
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmDrug(null)}
                                className={`w-1/2 py-3 px-4 rounded-xl border text-sm font-bold transition-all active:scale-95 cursor-pointer text-center ${isDark
                                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                                    : 'border-slate-200 hover:bg-slate-100 text-slate-600 shadow-sm'
                                    }`}
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                className="w-1/2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-black py-3 px-4 rounded-xl active:scale-95 cursor-pointer text-center transition-all shadow-md shadow-rose-900/10"
                            >
                                ยืนยันลบยา
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <DrugRulesManager isOpen={showRulesManager} onClose={() => setShowRulesManager(false)} isDark={isDark} />
        </>
    );
};

export default DrugsInfo;
