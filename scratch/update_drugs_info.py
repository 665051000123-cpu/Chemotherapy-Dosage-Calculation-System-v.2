import re

with open('client/src/components/DrugsInfo.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Package to lucide-react imports
content = content.replace(
    "import { ArrowLeft, Pill, Search, FlaskConical, Ruler, ShieldAlert, Activity, Plus, Edit2, Trash2, Save, X, Printer } from 'lucide-react';",
    "import { ArrowLeft, Pill, Search, FlaskConical, Ruler, ShieldAlert, Activity, Plus, Edit2, Trash2, Save, X, Printer, Package } from 'lucide-react';"
)

# 2. Update initial drugForm state
old_state = """    const [drugForm, setDrugForm] = useState({
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
        is_active: 1
    });"""

new_state = """    const [drugForm, setDrugForm] = useState({
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
        package_type: '',
        inventory_qty: '',
        inventory_min: '',
        inventory_max: '',
        is_auto_dispensed: false
    });"""
content = content.replace(old_state, new_state)

# 3. Update handleOpenAddModal
old_add_modal = """        setDrugForm({
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
            is_active: 1
        });"""

new_add_modal = """        setDrugForm({
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
            package_type: '',
            inventory_qty: '',
            inventory_min: '',
            inventory_max: '',
            is_auto_dispensed: false
        });"""
content = content.replace(old_add_modal, new_add_modal)

# 4. Update handleOpenEditModal
old_edit_modal = """        setDrugForm({
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
            is_active: drug.is_active !== undefined ? drug.is_active : 1
        });"""

new_edit_modal = """        setDrugForm({
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
            package_type: drug.package_type || '',
            inventory_qty: drug.inventory_qty !== null && drug.inventory_qty !== undefined ? drug.inventory_qty.toString() : '',
            inventory_min: drug.inventory_min !== null && drug.inventory_min !== undefined ? drug.inventory_min.toString() : '',
            inventory_max: drug.inventory_max !== null && drug.inventory_max !== undefined ? drug.inventory_max.toString() : '',
            is_auto_dispensed: drug.is_auto_dispensed === 1 || drug.is_auto_dispensed === true
        });"""
content = content.replace(old_edit_modal, new_edit_modal)


# 5. Update payload in handleFormSubmit
old_payload = """        const payload = {
            ...drugForm,
            drug_code: drugForm.drug_code.toUpperCase().trim() || null,
            drug_name: drugForm.drug_name.toUpperCase().trim(),
            standard_dose_value: drugForm.standard_dose_value === '' ? null : parseFloat(drugForm.standard_dose_value),
            max_dose_cap: drugForm.max_dose_cap === '' ? null : parseFloat(drugForm.max_dose_cap),
            max_bsa_cap: drugForm.max_bsa_cap === '' ? null : parseFloat(drugForm.max_bsa_cap),
            max_gfr_cap: drugForm.max_gfr_cap === '' ? null : parseInt(drugForm.max_gfr_cap, 10),
            is_active: parseInt(drugForm.is_active, 10)
        };"""

new_payload = """        const payload = {
            ...drugForm,
            drug_code: drugForm.drug_code.toUpperCase().trim() || null,
            drug_name: drugForm.drug_name.toUpperCase().trim(),
            standard_dose_value: drugForm.standard_dose_value === '' ? null : parseFloat(drugForm.standard_dose_value),
            max_dose_cap: drugForm.max_dose_cap === '' ? null : parseFloat(drugForm.max_dose_cap),
            max_bsa_cap: drugForm.max_bsa_cap === '' ? null : parseFloat(drugForm.max_bsa_cap),
            max_gfr_cap: drugForm.max_gfr_cap === '' ? null : parseInt(drugForm.max_gfr_cap, 10),
            is_active: parseInt(drugForm.is_active, 10),
            dose_per_pack: drugForm.dose_per_pack === '' ? null : parseFloat(drugForm.dose_per_pack),
            package_type: drugForm.package_type,
            inventory_qty: drugForm.inventory_qty === '' ? 0 : parseFloat(drugForm.inventory_qty),
            inventory_min: drugForm.inventory_min === '' ? 0 : parseFloat(drugForm.inventory_min),
            inventory_max: drugForm.inventory_max === '' ? 0 : parseFloat(drugForm.inventory_max),
            is_auto_dispensed: drugForm.is_auto_dispensed ? 1 : 0
        };"""
content = content.replace(old_payload, new_payload)

# 6. Add Combo Box at the top of the form
old_form_start = """                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">"""
                            
new_form_start = """                        <form onSubmit={handleFormSubmit} className="space-y-4">
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

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">"""
content = content.replace(old_form_start, new_form_start)

# 7. Add Inventory fields section at the end of the form
old_form_end = """                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">"""

new_form_end = """                                </div>
                            </div>

                            {/* Inventory Section */}
                            <h4 className="font-black text-sm mt-6 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                                <Package size={16} className="text-emerald-500" />
                                ข้อมูลคลังยาและบรรจุภัณฑ์ (Inventory Information)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ภาชนะบรรจุ</label>
                                    <input type="text" className="form-control text-sm" placeholder="เช่น Vial, Ampoule" value={drugForm.package_type} onChange={e => setDrugForm({...drugForm, package_type: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ขนาดยา / ภาชนะบรรจุ</label>
                                    <input type="number" step="0.01" className="form-control text-sm" placeholder="เช่น 50" value={drugForm.dose_per_pack} onChange={e => setDrugForm({...drugForm, dose_per_pack: e.target.value})} />
                                </div>
                                <div className="flex items-center gap-2 mt-6 md:col-span-2 bg-slate-50 dark:bg-slate-800/50 px-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                    <input type="checkbox" id="auto_dispense" checked={drugForm.is_auto_dispensed} onChange={e => setDrugForm({...drugForm, is_auto_dispensed: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500 cursor-pointer" />
                                    <label htmlFor="auto_dispense" className="text-sm font-bold cursor-pointer select-none">ตัดสต๊อกอัตโนมัติ (Auto INV.) เมื่อมีการสั่งจ่ายยา</label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">สต๊อกปัจจุบัน (Inv)</label>
                                    <input type="number" step="0.01" className="form-control text-sm font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30" placeholder="0" value={drugForm.inventory_qty} onChange={e => setDrugForm({...drugForm, inventory_qty: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">จุดสั่งซื้อ (Min)</label>
                                    <input type="number" step="0.01" className="form-control text-sm" placeholder="0" value={drugForm.inventory_min} onChange={e => setDrugForm({...drugForm, inventory_min: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">สต๊อกสูงสุด (Max)</label>
                                    <input type="number" step="0.01" className="form-control text-sm" placeholder="0" value={drugForm.inventory_max} onChange={e => setDrugForm({...drugForm, inventory_max: e.target.value})} />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">"""
content = content.replace(old_form_end, new_form_end)

with open('client/src/components/DrugsInfo.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied.")
