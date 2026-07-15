import re

with open('client/src/components/DrugsInfo.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update drugForm state
old_state = """        inventory_max: '',
        is_auto_dispensed: false
    });"""

new_state = """        inventory_max: '',
        is_auto_dispensed: false,
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
        note: ''
    });"""
content = content.replace(old_state, new_state)

# 2. Update handleOpenAddModal
old_add_modal = """            inventory_max: '',
            is_auto_dispensed: false
        });"""
new_add_modal = """            inventory_max: '',
            is_auto_dispensed: false,
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
            note: ''
        });"""
content = content.replace(old_add_modal, new_add_modal)

# 3. Update handleOpenEditModal
old_edit_modal = """            inventory_max: drug.inventory_max !== null && drug.inventory_max !== undefined ? drug.inventory_max.toString() : '',
            is_auto_dispensed: drug.is_auto_dispensed === 1 || drug.is_auto_dispensed === true
        });"""
new_edit_modal = """            inventory_max: drug.inventory_max !== null && drug.inventory_max !== undefined ? drug.inventory_max.toString() : '',
            is_auto_dispensed: drug.is_auto_dispensed === 1 || drug.is_auto_dispensed === true,
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
            alert_concentration_max: drug.alert_concentration_max || '',
            diluent_incompat: drug.diluent_incompat || '',
            note: drug.note || ''
        });"""
content = content.replace(old_edit_modal, new_edit_modal)

# 4. Update handleFormSubmit payload
old_payload = """            inventory_max: drugForm.inventory_max === '' ? 0 : parseFloat(drugForm.inventory_max),
            is_auto_dispensed: drugForm.is_auto_dispensed ? 1 : 0
        };"""
new_payload = """            inventory_max: drugForm.inventory_max === '' ? 0 : parseFloat(drugForm.inventory_max),
            is_auto_dispensed: drugForm.is_auto_dispensed ? 1 : 0,
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
        };"""
content = content.replace(old_payload, new_payload)

# 5. Insert new UI fields before Inventory section
old_form_middle = """                            {/* Inventory Section */}"""

new_form_middle = """                            {/* Additional Drug Details Section */}
                            <h4 className="font-black text-sm mt-6 mb-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                                <FlaskConical size={16} className="text-amber-500" />
                                ข้อมูลทางเทคนิคและข้อควรระวัง (Technical & Warnings)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">รายละเอียดวิธีการผสมยา</label>
                                    <input type="text" className="form-control text-sm" value={drugForm.prep_instructions} onChange={e => setDrugForm({...drugForm, prep_instructions: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ตัวทำละลาย (Solvent)</label>
                                    <input type="text" className="form-control text-sm" value={drugForm.solvent} onChange={e => setDrugForm({...drugForm, solvent: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">วิธีบริหารยา (Route)</label>
                                    <input type="text" className="form-control text-sm" placeholder="เช่น IV, PO" value={drugForm.admin_route} onChange={e => setDrugForm({...drugForm, admin_route: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">ความเข้มข้น/ปริมาตร (Per ml.)</label>
                                    <input type="number" step="0.01" className="form-control text-sm" value={drugForm.concentration_per_ml} onChange={e => setDrugForm({...drugForm, concentration_per_ml: e.target.value})} />
                                </div>
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">คำเตือน (Warning)</label>
                                    <input type="text" className="form-control text-sm" value={drugForm.warning_msg} onChange={e => setDrugForm({...drugForm, warning_msg: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">การเก็บรักษา (Storage)</label>
                                    <input type="text" className="form-control text-sm" value={drugForm.storage_instruction} onChange={e => setDrugForm({...drugForm, storage_instruction: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">อัตราเร็วในการให้ยา</label>
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
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1 text-rose-500">แจ้งเตือนความเข้มข้น > (mg/ml.)</label>
                                    <input type="number" step="0.01" className="form-control text-sm" value={drugForm.alert_concentration_max} onChange={e => setDrugForm({...drugForm, alert_concentration_max: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">Diluent Incompatibility</label>
                                    <input type="text" className="form-control text-sm" value={drugForm.diluent_incompat} onChange={e => setDrugForm({...drugForm, diluent_incompat: e.target.value})} />
                                </div>
                            </div>

                            {/* Inventory Section */}"""
content = content.replace(old_form_middle, new_form_middle)

# 6. Insert Note field at the bottom before submit button
old_form_bottom = """                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">"""

new_form_bottom = """                            {/* Note Section */}
                            <div className="mt-4">
                                <label className="block text-xs font-black opacity-70 mb-1.5 uppercase ml-1">Note (หมายเหตุ)</label>
                                <textarea className="form-control text-sm min-h-[80px]" placeholder="เพิ่มหมายเหตุข้อมูลยาเพิ่มเติม..." value={drugForm.note} onChange={e => setDrugForm({...drugForm, note: e.target.value})}></textarea>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">"""
content = content.replace(old_form_bottom, new_form_bottom)

with open('client/src/components/DrugsInfo.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied for new fields.")
