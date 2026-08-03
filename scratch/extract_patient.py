import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find Patient Registration chunk
# Starts with <div id="patient-registration"
# Ends right before {/* Lab Results */}

start_idx = content.find('<div id="patient-registration"')
end_idx = content.find('{/* Lab Results */}', start_idx)

if start_idx != -1 and end_idx != -1:
    patient_chunk = content[start_idx:end_idx]
    
    # Identify props needed:
    # patient, setPatient, prevStats, setPrevStats, calculateAge, handleClearForm, theme, user
    
    component = f'''import React from 'react';
import {{ UserSquare, Trash2 }} from 'lucide-react';

export default function PatientForm({{
    patient,
    setPatient,
    calculateAge,
    theme,
    handleClearForm,
    prevStats,
    setPrevStats
}}) {{
    return (
        <>
            {patient_chunk}
        </>
    );
}}
'''
    with open('client/src/components/PatientForm.jsx', 'w', encoding='utf-8') as f2:
        f2.write(component)
        
    # Replace the chunk in App.jsx
    new_app = content[:start_idx] + '<PatientForm patient={patient} setPatient={setPatient} calculateAge={calculateAge} theme={theme} handleClearForm={handleClearForm} prevStats={prevStats} setPrevStats={setPrevStats} />\n                            ' + content[end_idx:]
    
    # Add import
    import_statement = "import PatientForm from './components/PatientForm';\n"
    new_app = new_app.replace("import CalculationHistory from './components/CalculationHistory';", "import CalculationHistory from './components/CalculationHistory';\n" + import_statement)
    
    with open('client/src/App.jsx', 'w', encoding='utf-8') as f3:
        f3.write(new_app)
        
    print(f"Extracted PatientForm! Chunk size: {len(patient_chunk.split(chr(10)))} lines")
else:
    print("Could not find boundaries")
