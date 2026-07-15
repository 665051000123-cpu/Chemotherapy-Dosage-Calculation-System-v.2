import re

with open('oncology-backend/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_drug_fields = """    dose_per_pack: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    package_type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    inventory_qty: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    inventory_min: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    inventory_max: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    is_auto_dispensed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: DataTypes.DATE
}, {"""

new_drug_fields = """    dose_per_pack: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    package_type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    inventory_qty: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    inventory_min: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    inventory_max: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    is_auto_dispensed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    prep_instructions: DataTypes.TEXT,
    solvent: DataTypes.STRING(100),
    admin_route: DataTypes.STRING(50),
    concentration_per_ml: DataTypes.DECIMAL(10, 2),
    cost_price: DataTypes.DECIMAL(10, 2),
    expire_after_mix_days: DataTypes.INTEGER,
    expire_after_mix_hours: DataTypes.INTEGER,
    expire_after_recon_days: DataTypes.INTEGER,
    warning_msg: DataTypes.TEXT,
    storage_instruction: DataTypes.STRING(255),
    infusion_rate: DataTypes.STRING(100),
    alert_cumulative_dose: DataTypes.DECIMAL(10, 2),
    alert_cumulative_dose_unit: DataTypes.STRING(20),
    alert_concentration_max: DataTypes.DECIMAL(10, 2),
    diluent_incompat: DataTypes.TEXT,
    note: DataTypes.TEXT,
    created_at: DataTypes.DATE
}, {"""

content = content.replace(old_drug_fields, new_drug_fields)

# Also update sequelize.sync() to { alter: true }
content = content.replace("await sequelize.sync();", "await sequelize.sync({ alter: true });")

with open('oncology-backend/server.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("server.js patched successfully.")
