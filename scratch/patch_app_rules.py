import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove import
content = content.replace("import { DRUG_SOLVENT_RULES } from './drugRules';\n", "")

# 2. Replace the check logic to use state
old_check = "const rule = DRUG_SOLVENT_RULES.find(r => dName.includes(r.drugName.toLowerCase()));"
new_check = "const rule = drugRules.find(r => dName.includes(r.drugName.toLowerCase()));"
content = content.replace(old_check, new_check)

# 3. Add state and fetch in App component
# Find where other states are declared
state_declaration = """    const [showPrinterSettings, setShowPrinterSettings] = useState(false);"""
new_state_declaration = """    const [showPrinterSettings, setShowPrinterSettings] = useState(false);
    const [drugRules, setDrugRules] = useState([]);"""
content = content.replace(state_declaration, new_state_declaration)

# Find where useEffect is (e.g. check for persisted session)
use_effect_code = """    // Check for persisted session
    useEffect(() => {"""
new_use_effect_code = """    // Check for persisted session
    useEffect(() => {
        axios.get(`${API_BASE}/drug_rules`).then(res => setDrugRules(res.data)).catch(err => console.error(err));"""
content = content.replace(use_effect_code, new_use_effect_code)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("App.jsx patched for drug rules fetching.")
