import codecs

content = codecs.open('oncology-backend/server.js', 'r', 'utf-8').read()

target = "app.get('/api/patients', async (req, res) => {"

new_route = """app.get('/api/toxicity/:hn', async (req, res) => {
    try {
        // Return empty array for now since toxicity tracking is not yet implemented in DB
        res.json([]);
    } catch (err) {
        console.error("Error fetching toxicity:", err);
        res.status(500).json({ error: err.message });
    }
});

"""

content = content.replace(target, new_route + target)
codecs.open('oncology-backend/server.js', 'w', 'utf-8').write(content)
print('Fixed toxicity route')
