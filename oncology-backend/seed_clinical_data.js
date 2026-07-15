const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('oncology_db', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const Drug = sequelize.define('Drug', {
    drug_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    drug_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    myelosuppression: DataTypes.STRING(255),
    side_effect_info: DataTypes.TEXT,
    stability_info: DataTypes.TEXT,
    drug_interactions: DataTypes.TEXT,
    usual_dosage: DataTypes.TEXT
}, {
    tableName: 'drugs',
    timestamps: false
});

const clinicalData = {
    '5-FU': {
        myelosuppression: 'ปานกลาง (Moderate)',
        side_effect_info: 'เยื่อบุช่องปากอักเสบ (Mucositis), ท้องเสีย, กลุ่มอาการมือและเท้า (Hand-foot syndrome), พิษต่อหัวใจ (Cardiotoxicity)',
        stability_info: 'เก็บที่อุณหภูมิห้อง (15-25°C) ป้องกันแสง มีความคงตัวใน NS หรือ D5W',
        drug_interactions: '- เพิ่มความเป็นพิษ: Leucovorin (เพิ่มผล/พิษของยา)\n- Warfarin: อาจทำให้ค่า INR เพิ่มขึ้น',
        usual_dosage: 'IV bolus: 400-500 mg/m2\nหยดยาต่อเนื่อง: 1000-1200 mg/m2/day เป็นเวลา 2-4 วัน'
    },
    'DOXORUBICIN': {
        myelosuppression: 'รุนแรง (Severe)',
        side_effect_info: 'พิษต่อหัวใจ (ขึ้นอยู่กับขนาดยาสะสม), ผมร่วง, ปัสสาวะสีแดง, คลื่นไส้/อาเจียน',
        stability_info: 'เก็บในตู้เย็น (2-8°C) ป้องกันแสง หลังผสมมีความคงตัว 7 วันที่อุณหภูมิห้อง, 15 วันในตู้เย็น',
        drug_interactions: '- Trastuzumab: เพิ่มความเสี่ยงต่อพิษต่อหัวใจ\n- Paclitaxel: บริหารยา Doxorubicin ก่อนเพื่อจำกัดความเป็นพิษ',
        usual_dosage: 'IV: 60-75 mg/m2 ทุก 21 วัน\nขนาดยาสะสมสูงสุด: 450-550 mg/m2 (เนื่องจากพิษต่อหัวใจ)'
    },
    'PACLITAXEL': {
        myelosuppression: 'รุนแรง (Severe)',
        side_effect_info: 'ปฏิกิริยาแพ้ยา (Hypersensitivity), ปลายประสาทอักเสบ, ผมร่วง, ปวดกล้ามเนื้อ',
        stability_info: 'เก็บที่อุณหภูมิ 20-25°C เจือจางใน NS หรือ D5W ให้ได้ความเข้มข้น 0.3-1.2 mg/mL ใช้ภาชนะแก้วหรือภาชนะที่ไม่ใช่ PVC',
        drug_interactions: '- Cisplatin: บริหารยา Paclitaxel ก่อน Cisplatin เพื่อหลีกเลี่ยงภาวะกดไขกระดูกที่เพิ่มขึ้น\n- CYP3A4 inhibitors (เช่น Ketoconazole): อาจเพิ่มความเป็นพิษ',
        usual_dosage: 'IV: 175 mg/m2 นาน 3 ชั่วโมง ทุก 3 สัปดาห์ (ต้องให้ยาแก้แพ้และสเตียรอยด์ก่อนให้ยา)'
    },
    'CISPLATIN': {
        myelosuppression: 'เล็กน้อยถึงปานกลาง (Mild to Moderate)',
        side_effect_info: 'พิษต่อไต (Nephrotoxicity), คลื่นไส้/อาเจียนรุนแรง, พิษต่อหู (Ototoxicity), ปลายประสาทอักเสบ',
        stability_info: 'เก็บที่อุณหภูมิ 15-25°C ห้ามแช่เย็น (อาจตกตะกอน) เจือจางในสารละลายที่มีคลอไรด์ (เช่น NS)',
        drug_interactions: '- Aminoglycosides: เพิ่มความเสี่ยงต่อพิษต่อไตและหู\n- Paclitaxel: บริหารยา Paclitaxel ก่อน',
        usual_dosage: 'IV: 50-100 mg/m2 ทุก 3-4 สัปดาห์ (ต้องให้น้ำเกลืออย่างเต็มที่ก่อนและหลังให้ยา)'
    },
    'CARBOPLATIN': {
        myelosuppression: 'รุนแรง (เกล็ดเลือดต่ำแบบจำกัดขนาดยา)',
        side_effect_info: 'คลื่นไส้/อาเจียน, ปฏิกิริยาแพ้ยา, พิษต่อไต (น้อยกว่า Cisplatin)',
        stability_info: 'เก็บที่อุณหภูมิ 20-25°C ป้องกันแสง เจือจางใน D5W หรือ NS มีความคงตัว 8 ชั่วโมงที่อุณหภูมิห้อง',
        drug_interactions: '- ยาที่เป็นพิษต่อไต (Nephrotoxic drugs): เพิ่มความเสี่ยงต่อความเป็นพิษ',
        usual_dosage: 'IV: กำหนดเป้าหมาย AUC 4-6 โดยใช้สมการ Calvert (ขนาดยา = AUC x (GFR + 25))'
    },
    'CYCLOPHOSPHAMIDE': {
        myelosuppression: 'รุนแรง (เม็ดเลือดขาวต่ำ)',
        side_effect_info: 'กระเพาะปัสสาวะอักเสบมีเลือดปน (Hemorrhagic cystitis), ผมร่วง, คลื่นไส้/อาเจียน, มะเร็งทุติยภูมิ',
        stability_info: 'เก็บที่อุณหภูมิห้องหรือตู้เย็นขึ้นอยู่กับรูปแบบยา ละลายด้วย NS มีความคงตัว 24 ชั่วโมงที่อุณหภูมิห้อง หรือ 6 วันในตู้เย็น',
        drug_interactions: '- Allopurinol: อาจเพิ่มภาวะกดไขกระดูก\n- Doxorubicin: เพิ่มความเสี่ยงต่อพิษต่อหัวใจ',
        usual_dosage: 'IV: 500-1000 mg/m2 ทุก 3-4 สัปดาห์ (ต้องได้รับน้ำอย่างเพียงพอ; ใช้ Mesna สำหรับยาขนาดสูง)'
    },
    'BLEOMYCIN': {
        myelosuppression: 'เล็กน้อย (พบน้อยที่เป็นแบบจำกัดขนาดยา)',
        side_effect_info: 'พิษต่อปอด (พังผืด), ไข้, หนาวสั่น, สีผิวคล้ำขึ้น',
        stability_info: 'เก็บในตู้เย็น (2-8°C) ละลายด้วย NS มีความคงตัว 24 ชั่วโมงที่อุณหภูมิห้อง',
        drug_interactions: '- ออกซิเจน: การให้ FiO2 สูงระหว่างการผ่าตัดเพิ่มความเสี่ยงต่อพิษต่อปอด\n- Cisplatin: เพิ่มความเสี่ยงต่อพิษต่อปอด',
        usual_dosage: 'IV/IM/SC: 10-20 units/m2 ทุกสัปดาห์หรือสองครั้งต่อสัปดาห์\nขนาดยาสะสมสูงสุดตลอดชีพ: 400 units (เนื่องจากความเสี่ยงต่อพิษต่อปอด)'
    },
    'METHOTREXATE': {
        myelosuppression: 'รุนแรง (Severe)',
        side_effect_info: 'เยื่อบุช่องปากอักเสบ, พิษต่อตับ, พิษต่อไต (เมื่อใช้ยาขนาดสูง), ปอดอักเสบ',
        stability_info: 'เก็บที่อุณหภูมิห้อง ป้องกันแสง เจือจางใน D5W หรือ NS',
        drug_interactions: '- NSAIDs, Penicillins, PPIs: อาจลดการขับออกและเพิ่มความเป็นพิษของ MTX',
        usual_dosage: 'แตกต่างกันไปตามสูตรยา ขนาดต่ำ: 15-30 mg/m2 IV/IM/PO ขนาดสูง (>500 mg/m2) ต้องใช้ Leucovorin rescue และทำปัสสาวะให้เป็นด่าง'
    },
    'VINCRISTINE': {
        myelosuppression: 'เล็กน้อย (Mild)',
        side_effect_info: 'ปลายประสาทอักเสบ, ท้องผูก, ระคายเคืองต่อหลอดเลือด (ยารั่วซึมทำให้เนื้อเยื่อตาย)',
        stability_info: 'เก็บในตู้เย็น (2-8°C) ป้องกันแสง',
        drug_interactions: '- CYP3A4 inhibitors (เช่น Itraconazole): เพิ่มพิษต่อระบบประสาท',
        usual_dosage: 'IV: 1.4 mg/m2 (โดยทั่วไปจะจำกัดขนาดยาสูงสุดที่ 2 mg เพื่อป้องกันพิษต่อระบบประสาท)'
    },
    'DOCETAXEL': {
        myelosuppression: 'รุนแรง (เม็ดเลือดขาวชนิดนิวโทรฟิลต่ำ)',
        side_effect_info: 'คั่งน้ำ (Fluid retention), ปฏิกิริยาแพ้ยา, ปลายประสาทอักเสบ, ผมร่วง',
        stability_info: 'เก็บที่อุณหภูมิ 2-25°C ป้องกันแสง ใช้ภาชนะที่ไม่ใช่ PVC',
        drug_interactions: '- CYP3A4 inhibitors: อาจเพิ่มระดับยา Docetaxel ในเลือด',
        usual_dosage: 'IV: 75-100 mg/m2 ทุก 3 สัปดาห์ (ต้องให้คอร์ติโคสเตียรอยด์ก่อนให้ยาเพื่อป้องกันภาวะคั่งน้ำ)'
    },
    'ASPARAGINASE': {
        myelosuppression: 'เล็กน้อย (Mild)',
        side_effect_info: 'ภาวะภูมิแพ้รุนแรง (Anaphylaxis), ตับอ่อนอักเสบ, ความผิดปกติของการแข็งตัวของเลือด, พิษต่อตับ',
        stability_info: 'เก็บในตู้เย็น (2-8°C) ละลายด้วย NS สำหรับ I.M. หรือ I.V.',
        drug_interactions: '- Methotrexate: ลดผลของ MTX หากให้ก่อน MTX',
        usual_dosage: 'I.M. (ลดความเสี่ยงต่อภาวะภูมิแพ้รุนแรง) เป็นวิธีที่แนะนำมากกว่า I.V. ขนาด 6000 IU/m2 วันเว้นวัน เป็นเวลา 3-4 สัปดาห์'
    }
};

const defaultData = {
    myelosuppression: 'ต้องติดตามอาการอย่างใกล้ชิด (Requires monitoring)',
    side_effect_info: 'โปรดดูคู่มือยาเฉพาะสำหรับข้อมูลผลข้างเคียงทั้งหมด ที่พบบ่อย: คลื่นไส้, อ่อนเพลีย, เม็ดเลือดต่ำ',
    stability_info: 'ปฏิบัติตามคำแนะนำของผู้ผลิตสำหรับการเก็บรักษา, การละลาย, และการเจือจาง',
    drug_interactions: 'ปรึกษาเภสัชกรคลินิกหรือฐานข้อมูลปฏิกิริยาระหว่างยาก่อนบริหารยา',
    usual_dosage: 'ขนาดยาขึ้นอยู่กับสูตรการรักษาเฉพาะทาง โปรดยืนยันกับแพทย์ผู้ทำการรักษา'
};

async function seedData() {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB");

        const drugs = await Drug.findAll();
        
        for (const drug of drugs) {
            const data = clinicalData[drug.drug_name.toUpperCase()] || defaultData;
            
            await drug.update({
                myelosuppression: data.myelosuppression,
                side_effect_info: data.side_effect_info,
                stability_info: data.stability_info,
                drug_interactions: data.drug_interactions,
                usual_dosage: data.usual_dosage
            });
            console.log(`Updated: ${drug.drug_name}`);
        }

        console.log("Successfully seeded clinical data for all drugs!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seedData();
