import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update patient initialization
patient_init_old = "const [patient, setPatient] = useState({ hn: '', title: '', name: '', height: '', weight: '', gender: '', dob: '', age: '', allergies: '', ward: '', doctor: '', cycle: '' });"
patient_init_new = "const [patient, setPatient] = useState(savedWorkspace.patient || { hn: '', title: '', name: '', height: '', weight: '', gender: '', dob: '', age: '', allergies: '', ward: '', doctor: '', cycle: '' });"
content = content.replace(patient_init_old, patient_init_new)

# 2. Add patient to useEffect dependency array and workspaceData
use_effect_old = """        const workspaceData = {
            formula, selectedDrugs, singleDrugResults, drugParams, amputation, ampDetails,
            selectedRegimen, useAutoGfr, patientScr, wbc, neutrophils, bands, adminRows,
            anc, plt, tbili, ast, alt, alp, multipleDoses, enableHematology, enableLiver,
            enableTbili, enableRenal, autoGfrValue, toxicitySymptoms, toxicityGrade, toxicityNotes
        };"""
use_effect_new = """        const workspaceData = {
            patient, formula, selectedDrugs, singleDrugResults, drugParams, amputation, ampDetails,
            selectedRegimen, useAutoGfr, patientScr, wbc, neutrophils, bands, adminRows,
            anc, plt, tbili, ast, alt, alp, multipleDoses, enableHematology, enableLiver,
            enableTbili, enableRenal, autoGfrValue, toxicitySymptoms, toxicityGrade, toxicityNotes
        };"""
content = content.replace(use_effect_old, use_effect_new)

deps_old = """        }, 500); // 500ms debounce
        return () => clearTimeout(timeoutId);
    }, [
        formula, selectedDrugs, singleDrugResults, drugParams, amputation, ampDetails,
        selectedRegimen, useAutoGfr, patientScr, wbc, neutrophils, bands, adminRows,
        anc, plt, tbili, ast, alt, alp, multipleDoses, enableHematology, enableLiver,
        enableTbili, enableRenal, autoGfrValue
    ]);"""
deps_new = """        }, 500); // 500ms debounce
        return () => clearTimeout(timeoutId);
    }, [
        patient, formula, selectedDrugs, singleDrugResults, drugParams, amputation, ampDetails,
        selectedRegimen, useAutoGfr, patientScr, wbc, neutrophils, bands, adminRows,
        anc, plt, tbili, ast, alt, alp, multipleDoses, enableHematology, enableLiver,
        enableTbili, enableRenal, autoGfrValue
    ]);"""
content = content.replace(deps_old, deps_new)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Auto-save patch complete")
