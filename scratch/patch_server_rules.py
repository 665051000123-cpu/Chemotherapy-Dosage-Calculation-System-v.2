import re
import json

with open('oncology-backend/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add DrugRule model
drug_rule_model = """
const DrugRule = sequelize.define('DrugRule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    drugName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    keywords: {
        type: DataTypes.JSON,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'drug_rules',
    timestamps: false
});
"""

if "const DrugRule =" not in content:
    content = content.replace("const Drug =", drug_rule_model + "\nconst Drug =")

# 2. Add API endpoints
api_endpoints = """
// --- Drug Rules APIs ---
app.get('/api/drug_rules', async (req, res) => {
    try {
        const rules = await DrugRule.findAll();
        // convert keywords back to array if it is returned as string by mysql json
        const formattedRules = rules.map(r => {
            let kw = r.keywords;
            if (typeof kw === 'string') {
                try { kw = JSON.parse(kw); } catch(e) { kw = []; }
            }
            return {
                id: r.id,
                drugName: r.drugName,
                keywords: kw || [],
                title: r.title,
                desc: r.desc
            };
        });
        res.json(formattedRules);
    } catch (error) {
        console.error('Error fetching drug rules:', error);
        res.status(500).json({ error: 'Failed to fetch drug rules' });
    }
});

app.post('/api/drug_rules', async (req, res) => {
    try {
        const { drugName, keywords, title, desc } = req.body;
        const newRule = await DrugRule.create({ drugName, keywords, title, desc });
        res.status(201).json(newRule);
    } catch (error) {
        console.error('Error creating drug rule:', error);
        res.status(500).json({ error: 'Failed to create drug rule' });
    }
});

app.put('/api/drug_rules/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { drugName, keywords, title, desc } = req.body;
        const rule = await DrugRule.findByPk(id);
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        await rule.update({ drugName, keywords, title, desc });
        res.json(rule);
    } catch (error) {
        console.error('Error updating drug rule:', error);
        res.status(500).json({ error: 'Failed to update drug rule' });
    }
});

app.delete('/api/drug_rules/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await DrugRule.findByPk(id);
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        await rule.destroy();
        res.json({ message: 'Rule deleted successfully' });
    } catch (error) {
        console.error('Error deleting drug rule:', error);
        res.status(500).json({ error: 'Failed to delete drug rule' });
    }
});
// -----------------------
"""

if "/api/drug_rules" not in content:
    # Find a good place to insert APIs, e.g., before app.listen
    content = content.replace("app.listen(port,", api_endpoints + "\napp.listen(port,")

with open('oncology-backend/server.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("server.js patched for drug rules.")
