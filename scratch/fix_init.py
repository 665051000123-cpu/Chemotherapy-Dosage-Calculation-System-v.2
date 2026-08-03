import codecs

content = codecs.open('client/src/App.jsx', 'r', 'utf-8').read()

saved_workspace_str = """    const savedWorkspace = useMemo(() => {
        try {
            const saved = localStorage.getItem('workspace_form_data');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    }, []);\n"""

# Remove the old savedWorkspace
content = content.replace(saved_workspace_str, "")

# Insert it before patient
content = content.replace("    const [patient, setPatient]", saved_workspace_str + "    const [patient, setPatient]")

codecs.open('client/src/App.jsx', 'w', 'utf-8').write(content)
print("Initialization fix complete")
