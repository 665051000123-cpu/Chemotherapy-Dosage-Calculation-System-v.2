import codecs

content = codecs.open('client/src/App.jsx', 'r', 'utf-8').read()

target1 = """        // Fetch toxicity logs
        axios.get(`${API_BASE}/toxicity/${patient.hn}`)
            .then(res => {
                if (res.data) setPastToxicities(res.data);
            })
            .catch(err => console.error('Failed to fetch toxicity', err));"""
            
replacement1 = """        // Fetch toxicity logs - disabled temporarily
        // axios.get(`${API_BASE}/toxicity/${patient.hn}`)
        //     .then(res => {
        //         if (res.data) setPastToxicities(res.data);
        //     })
        //     .catch(err => console.error('Failed to fetch toxicity', err));"""

target2 = """            const toxRes = await axios.get(`${API_BASE}/toxicity/${patient.hn}`);
            if (toxRes.data) setPastToxicities(toxRes.data);"""
            
replacement2 = """            // const toxRes = await axios.get(`${API_BASE}/toxicity/${patient.hn}`);
            // if (toxRes.data) setPastToxicities(toxRes.data);"""

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)

codecs.open('client/src/App.jsx', 'w', 'utf-8').write(content)
print("Removed toxicity fetches")
