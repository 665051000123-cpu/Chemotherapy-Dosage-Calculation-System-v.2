import codecs

f = codecs.open('client/src/components/DashboardAnalytics.jsx', 'r', 'utf-8').read()

# Add import
import1 = "import { Activity, TrendingUp, Users, Package } from 'lucide-react';"
import2 = "import { Activity, TrendingUp, Users, Package, Download } from 'lucide-react';\nimport * as XLSX from 'xlsx';"
f = f.replace(import1, import2)

# Add function
ret1 = '    return (\n'
export_fn = '''    const handleExportExcel = () => {
        const dashboardData = [
            { 'หัวข้อ': 'Total Orders (30 Days)', 'จำนวน': data.totalOrders },
            { 'หัวข้อ': 'Unique Patients', 'จำนวน': data.uniquePatients },
            { 'หัวข้อ': 'Top Drugs Types', 'จำนวน': data.topDrugs.length }
        ];
        
        const topDrugsData = data.topDrugs.map(d => ({
            'ชื่อยา': d.name,
            'จำนวนที่ใช้': d.count
        }));

        const wb = XLSX.utils.book_new();
        
        const wsSummary = XLSX.utils.json_to_sheet(dashboardData);
        wsSummary['!cols'] = [{wch: 30}, {wch: 15}];
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
        
        const wsDrugs = XLSX.utils.json_to_sheet(topDrugsData);
        wsDrugs['!cols'] = [{wch: 30}, {wch: 15}];
        XLSX.utils.book_append_sheet(wb, wsDrugs, 'Top Drugs');

        XLSX.writeFile(wb, `Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };'''
export_fn = export_fn.replace('f"Dashboard_Report_', '`Dashboard_Report_${new Date().toISOString().split(\'T\')[0]}.xlsx`')
export_fn = export_fn.replace('.xlsx");', ';')

f = f.replace(ret1, export_fn + '\n' + ret1)

# Add button
title1 = '''            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
                <Activity className="text-sky-500" size={32} />
                Executive Analytics Dashboard
            </h1>'''
title2 = '''            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <Activity className="text-sky-500" size={32} />
                    Executive Analytics Dashboard
                </h1>
                <button
                    onClick={handleExportExcel}
                    className="py-2.5 px-5 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all duration-300 whitespace-nowrap bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                >
                    <Download size={18} /> Export Report (Excel)
                </button>
            </div>'''
f = f.replace(title1, title2)

codecs.open('client/src/components/DashboardAnalytics.jsx', 'w', 'utf-8').write(f)
print('Dashboard patch complete')
