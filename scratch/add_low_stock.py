import codecs

filepath = 'client/src/App.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

# 1. Add state for lowStockAlerts
target_state = "    const [calculationDetails, setCalculationDetails] = useState(null);"
replacement_state = """    const [calculationDetails, setCalculationDetails] = useState(null);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);"""
content = content.replace(target_state, replacement_state)

# 2. Add useEffect to fetch inventory
target_effect = """    useEffect(() => {
        const fetchPatients = async () => {"""
replacement_effect = """    useEffect(() => {
        const fetchInventoryAlerts = async () => {
            try {
                const res = await axios.get('/api/inventory');
                if (res.data.success) {
                    const lowStock = res.data.inventory.filter(item => 
                        item.reorder_point > 0 && item.total_quantity <= item.reorder_point
                    );
                    setLowStockAlerts(lowStock);
                }
            } catch (err) {
                console.error("Failed to fetch inventory for alerts", err);
            }
        };
        fetchInventoryAlerts();
        
        const fetchPatients = async () => {"""
content = content.replace(target_effect, replacement_effect)

# 3. Add Banner before Medical Record View
target_banner = """                        {/* Medical Record View */}
                        <div className="w-full premium-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">"""
replacement_banner = """                        {/* Low Stock Alerts */}
                        {lowStockAlerts.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex items-center justify-between no-print animate-pulse-slow">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-xl text-red-600 dark:text-red-400">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-red-800 dark:text-red-300 font-bold text-sm">แจ้งเตือน: มียาใกล้หมดคลัง {lowStockAlerts.length} รายการ</h3>
                                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">กรุณาตรวจสอบหน้าจัดการคลังยาเพื่อทำการสั่งซื้อเพิ่ม</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setStep('inventory')}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 transition-colors"
                                >
                                    จัดการคลังยา
                                </button>
                            </div>
                        )}
                        
                        {/* Medical Record View */}
                        <div className="w-full premium-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">"""
content = content.replace(target_banner, replacement_banner)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)
print("Low stock alert patched!")
