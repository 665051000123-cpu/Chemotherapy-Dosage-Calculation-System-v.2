# รูปเล่มรายงานโครงการ
## ระบบคำนวณและตรวจสอบขนาดยาเคมีบำบัด
### (Oncology Dose Verification & Management System)

**จัดทำโดย:** ทีมพัฒนาสารสนเทศการเภสัชกรรม (Antigravity & Pharmacy IT Section) 
**หน่วยงาน:** แผนกเภสัชกรรมมะเร็งวิทยา ร่วมมือกับฝ่ายสารสนเทศทางการแพทย์ (IT)

---

## คำนำ

เอกสารฉบับนี้เป็นรายงานและคู่มือการพัฒนาระบบ (Project Handbook) สำหรับ **ระบบคำนวณและตรวจสอบขนาดยาเคมีบำบัด (Oncology Dose Verification & Management System)** ซึ่งจัดทำขึ้นเพื่อบันทึกกระบวนการพัฒนา โครงสร้างเชิงเทคนิค และตรรกะทางการแพทย์ที่ใช้ในระบบ[cite: 1]

คณะผู้จัดทำหวังเป็นอย่างยิ่งว่า ระบบและรายงานฉบับนี้จะเป็นประโยชน์ต่อบุคลากรทางการแพทย์ในแผนกเภสัชกรรมมะเร็งวิทยา และฝ่ายสารสนเทศทางการแพทย์ ในการนำไปใช้งาน บำรุงรักษา หรือพัฒนาต่อยอดเพื่อเพิ่มความปลอดภัยสูงสุดให้แก่ผู้ป่วยต่อไป

**ทีมพัฒนาสารสนเทศการเภสัชกรรม**  
*มิถุนายน 2569*

---

## สารบัญ

1. บทนำ (Introduction)
2. ขอบเขตการทำงาน (System Scope)
3. สถาปัตยกรรมทางเทคนิค (Technical Architecture)
4. โครงสร้างฐานข้อมูล (Database Schema)
5. ตรรกะและสูตรการคิดคำนวณ (Calculation Logic)
6. คู่มือการติดตั้งและเปิดใช้งาน (Deployment & Manual)

---

## 1. บทนำ (Introduction)

### 1.1 ความเป็นมาของโครงการ
การบริหารจัดการขนาดยาเคมีบำบัดในแผนกมะเร็งวิทยา (Oncology) มีความสำคัญสูงสุดต่อความปลอดภัยของผู้ป่วย เนื่องจากยามีความเข้มข้นสูงและมีความเป็นพิษต่อระบบร่างกายค่อนข้างรุนแรง[cite: 1] การคิดคำนวณแบบเดิมที่ใช้กระดาษหรือการคำนวณด้วยมือ มีความเสี่ยงต่อความคลาดเคลื่อนทางคณิตศาสตร์ (Calculation Errors) และความล่าช้าในการตรวจสอบประวัติผู้ป่วย[cite: 1]

แผนกเภสัชกรรมจึงได้พัฒนาระบบ **Oncology Dose Verification System** นี้ขึ้น เพื่อช่วยคำนวณ ตรวจสอบขนาดการจ่ายยา และบันทึกประวัติผู้ป่วยอย่างเป็นระบบด้วยมาตรฐานความปลอดภัยทางดิจิทัลแบบเรียลไทม์[cite: 1]

### 1.2 วัตถุประสงค์
* เพื่อคำนวณหาค่าพื้นที่ผิวร่างกาย (Body Surface Area - BSA) และปริมาณการใช้ยาเคมีบำบัด (Chemotherapy Dose) ได้อย่างรวดเร็วและแม่นยำสูง[cite: 1]
* เพื่อช่วยตรวจสอบระดับขนาดยาป้องกันการใช้ยาเกินขนาด (Dose Cap Check) เช่น ขนาดยาจำกัดสูงสุด (Max Dose Cap) ของ Vincristine หรือขีดจำกัดการกรองของไตสูงสุด (Max GFR Cap) ใน Calvert Formula ของ Carboplatin[cite: 1]
* เพื่อจัดเก็บข้อมูลประวัติการคำนวณยาของผู้ป่วย (Dosage Logs) และตรวจสอบพฤติกรรมการจ่ายยารวมถึงประวัติความปลอดภัย (Activity Audit Logs) สำหรับระบบไอทีทางการแพทย์[cite: 1]

---

## 2. ขอบเขตการทำงาน (System Scope)

### 2.1 ส่วนของเภสัชกร (Pharmacist View)
* **Patient Check-in:** การลงทะเบียนระบุน้ำหนัก ส่วนสูง อายุ เพศ และรหัสผู้ป่วย (HN)[cite: 1]
* **BSA Calculation:** คำนวณพื้นที่ผิวตามสูตร Mosteller หรือ DuBois & DuBois พร้อมรองรับการตัดแต่งน้ำหนัก/BSA กรณีผู้ป่วยสูญเสียอวัยวะ (Amputee Level Adjustment)[cite: 1]
* **Chemotherapy Dose Calculation:** ระบบคำนวณยาเดี่ยว (Single Drug) และสูตรยาร่วม (Regimens: CV, BC)[cite: 1]
* **Save & Record:** การบันทึกข้อมูลผลลัพธ์เพื่อเก็บเป็นประวัติการรักษา[cite: 1]
* **Drug Information Tab:** หน้าแสดงคู่มือค่าวิชาการและขีดจำกัดยาแต่ละชนิด[cite: 1]

### 2.2 ส่วนของผู้ดูแลระบบ (Admin View)
* **Pharmacist Account Management:** จัดทำ เปิด-ปิดการใช้งาน (Suspend) และรีเซ็ตรหัสผ่านของผู้ใช้งานเภสัชกร[cite: 1]
* **Audit Logging:** เข้าตรวจสอบประวัติการเข้าสู่ระบบ (Login History) และกิจกรรมการอัปเดตระบบ (Modification logs)[cite: 1]
* **Drug Config Management:** จัดการฐานข้อมูลสูตรยา เพิ่มสูตรการจ่ายยา ปรับแก้ Dose Cap หรือค่าคงที่สำหรับสูตร Calvert Formula[cite: 1]

---

## 3. สถาปัตยกรรมทางเทคนิค (Technical Architecture)

ระบบถูกออกแบบในรูปแบบ **Full-stack Web Application (Client-Server)** ที่มีน้ำหนักเบา รวดเร็ว และสามารถรันแบบ Local ภายในเครือข่ายโรงพยาบาลได้โดยง่าย:[cite: 1]

* **Frontend SPA:** React 18 + Vite (รวดเร็ว, มีประสิทธิภาพสูงในการประมวลผลหน้าบ้าน)[cite: 1]
* **Styling System:** Tailwind CSS 3 (การจัดแต่งระบบการ์ดพรีเมียมรองรับ Dark/Light Mode)[cite: 1]
* **Backend Server:** Node.js + Express 5 (จัดการ API Bridge ส่งผ่านข้อมูลที่รวดเร็ว)[cite: 1]
* **ORM Layer:** Sequelize (จัดโครงสร้างและซิงค์ Model เข้า MySQL ปลอดภัยจาก SQL Injection)[cite: 1]
* **Database:** MySQL Server 8+ (เก็บข้อมูลผู้ใช้งาน ยา และประวัติการจ่ายยา)[cite: 1]

---

## 4. โครงสร้างฐานข้อมูล (Database Schema)

### 4.1 ตารางผู้ใช้และแอดมิน (`login` Table)
ใช้เก็บข้อมูลสิทธิ์และรหัสพนักงาน[cite: 1] ประกอบด้วยฟิลด์ `id`, `employee_id`, `username`, `password`, `role`, `must_change_password` และ `is_active`[cite: 1]

### 4.2 ตารางข้อมูลตัวยาเคมีบำบัด (`drugs` Table)
ใช้เก็บโครงสร้างสูตรการคำนวณและ Cap Limits ของยาแต่ละตัว[cite: 1] ประกอบด้วยฟิลด์ `drug_id`, `drug_name`, `calculation_type`, `default_weight_type`, `standard_dose_value`, `standard_dose_unit`, `max_dose_cap`, `max_bsa_cap`, `max_gfr_cap` และ `is_active`[cite: 1]

### 4.3 ตารางประวัติการคำนวณยา (`dosage_logs` Table)
เก็บประวัติการบันทึกสูตรการจ่ายยาทั้งหมดของผู้ป่วย[cite: 1] ประกอบด้วยฟิลด์ `id`, `timestamp`, `hn`, `patient_name`, `gender`, `age`, `calculated_bsa`, `formula_used`, `prescribed_dose` และ `user_name`[cite: 1]

---

## 5. ตรรกะและสูตรการคิดคำนวณ (Calculation Logic)

### 5.1 สูตรคำนวณหาค่า BSA
1. **สูตร Mosteller (นิยมที่สุด):**
   $$\text{BSA (m}^2\text{)} = \sqrt{\frac{\text{ส่วนสูง (cm)} \times \text{น้ำหนัก (kg)}}{3600}}$$[cite: 1]
2. **สูตร DuBois & DuBois:**
   $$\text{BSA (m}^2\text{)} = 0.007184 \times \text{ส่วนสูง (cm)}^{0.725} \times \text{น้ำหนัก (kg)}^{0.425}$$[cite: 1]

### 5.2 การปรับปรุงผู้ป่วยสูญเสียอวัยวะ (Amputee Adjustment)
* **Below Knee Amputation:** ลดน้ำหนักจริงลง 6% หรือ ลดพื้นที่ผิวที่คำนวณได้ลง 9%[cite: 1]
* **Above Knee Amputation:** ลดน้ำหนักจริงลง 15% หรือ ลดพื้นที่ผิวที่คำนวณได้ลง 18%[cite: 1]

### 5.3 Calvert Formula สำหรับ Carboplatin
$$\text{Carboplatin Dose (mg)} = \text{Target AUC} \times (\text{GFR} + 25)$$[cite: 1]
* **การคำนวณ GFR:** หากแอดมินกดเปิด Auto Gfr จะใช้สูตร **Cockcroft-Gault Equation** ในการคิดค่า GFR ให้ทันที:[cite: 1]
  $$\text{GFR (ชาย)} = \frac{(140 - \text{อายุ}) \times \text{น้ำหนัก (kg)}}{72 \times \text{Scr (mg/dL)}}$$[cite: 1]
  $$\text{GFR (หญิง)} = \text{GFR (ชาย)} \times 0.85$$[cite: 1]
* *(โดย GFR จะจำกัดสูงสุดไม่เกิน 125 ml/min เสมอตามเกณฑ์ความปลอดภัยมาตรฐาน)*[cite: 1]

---

## 6. คู่มือการติดตั้งและเปิดใช้งาน (Deployment & Manual)

### 6.1 การเตรียมไฟล์การตั้งค่า (Environment Variables)
สร้างไฟล์ `.env` ไว้ในโฟลเดอร์ `oncology-backend/`[cite: 1]
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=oncology_db