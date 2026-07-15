import sys

filepath = 'client/src/components/PrinterSettings.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_block_start = '                    <div className="space-y-6">'
target_block_end = '                        {/* Sticker Printer Setting */}'

replacement = '''                    <div className="space-y-6">
                        {/* Local Agent Toggle */}
                        <div className="bg-sky-50 p-5 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-sky-900 text-lg">เปิดใช้งาน Local Print Agent (พิมพ์ตรงจากเครื่องนี้)</h3>
                                <p className="text-sm text-sky-700">*ต้องเปิดโปรแกรมตัวจิ๋ว (Node.js) ทิ้งไว้ที่เครื่องนี้</p>
                                <a href="/Oncology-Local-Print-Agent.zip" download="Oncology-Local-Print-Agent.zip" className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold bg-sky-200 text-sky-800 px-3 py-1.5 rounded-lg hover:bg-sky-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                    ดาวน์โหลดโปรแกรมติดตั้งสำหรับเครื่องอื่น
                                </a>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={useLocalAgent} onChange={(e) => {
                                    const checked = e.target.checked;
                                    setUseLocalAgent(checked);
                                    fetchPrinters(checked);
                                }} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                            </label>
                        </div>

                        {/* Sticker Printer Setting */}'''

idx1 = content.find(target_block_start)
idx2 = content.find(target_block_end)

if idx1 != -1 and idx2 != -1 and not ('เปิดใช้งาน Local Print Agent' in content):
    content = content[:idx1] + replacement + content[idx2 + len(target_block_end):]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Modifications applied')
else:
    print('Target not found or already applied')
