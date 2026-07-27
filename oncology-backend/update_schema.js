const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'oncology_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'admin',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql'
    }
);

async function alterTable() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        
        // Add stability_info if not exists
        try {
            await queryInterface.addColumn('drugs', 'stability_info', {
                type: DataTypes.TEXT
            });
            console.log('Added stability_info');
        } catch (e) { console.log('stability_info may already exist'); }

        // Add storage_condition if not exists
        try {
            await queryInterface.addColumn('drugs', 'storage_condition', {
                type: DataTypes.STRING(255)
            });
            console.log('Added storage_condition');
        } catch (e) { console.log('storage_condition may already exist'); }

        // Add protect_from_light if not exists
        try {
            await queryInterface.addColumn('drugs', 'protect_from_light', {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            });
            console.log('Added protect_from_light');
        } catch (e) { console.log('protect_from_light may already exist'); }

        // Add emetogenic_risk if not exists
        try {
            await queryInterface.addColumn('drugs', 'emetogenic_risk', {
                type: DataTypes.STRING(50)
            });
            console.log('Added emetogenic_risk');
        } catch (e) { console.log('emetogenic_risk may already exist'); }

        console.log('Schema update complete.');
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        await sequelize.close();
    }
}

alterTable();
