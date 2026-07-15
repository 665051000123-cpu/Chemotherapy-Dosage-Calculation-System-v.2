import re

with open('client/src/components/DrugsInfo.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if "import DrugRulesManager" not in content:
    content = content.replace("import { Search, Plus, X, Save, Printer, Pill, AlertCircle, Activity, ShieldAlert, FlaskConical, Package } from 'lucide-react';", 
                              "import { Search, Plus, X, Save, Printer, Pill, AlertCircle, Activity, ShieldAlert, FlaskConical, Package, Shield } from 'lucide-react';\nimport DrugRulesManager from './DrugRulesManager';")

# 2. Add state
if "const [showRulesManager" not in content:
    content = content.replace("const [showFormModal, setShowFormModal] = useState(false);", 
                              "const [showFormModal, setShowFormModal] = useState(false);\n    const [showRulesManager, setShowRulesManager] = useState(false);")

# 3. Add Button
button_target = """{isAdmin && (
                        <button
                            onClick={handleOpenAddModal}
                            className="btn-primary text-sm py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
                        >
                            <Plus size={16} /> เพิ่มยาใหม่
                        </button>
                    )}"""
new_buttons = """{isAdmin && (
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
                    )}"""
content = content.replace(button_target, new_buttons)

# 4. Add Component Render
if "<DrugRulesManager" not in content:
    content = content.replace("        </div>\n    );\n}", "            <DrugRulesManager isOpen={showRulesManager} onClose={() => setShowRulesManager(false)} isDark={isDark} />\n        </div>\n    );\n}")

with open('client/src/components/DrugsInfo.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("DrugsInfo.jsx patched to include DrugRulesManager.")
