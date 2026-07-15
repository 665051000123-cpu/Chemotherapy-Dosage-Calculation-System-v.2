import sys

filepath = 'client/src/components/PrinterSettings.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = '*ต้องเปิดโปรแกรมตัวจิ๋ว (Node.js) ทิ้งไว้ที่เครื่องนี้</p>'
if target in content:
    idx = content.find(target) + len(target)
    btn_html = '''
                                <a href="/Oncology-Local-Print-Agent.zip" download="Oncology-Local-Print-Agent.zip" className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold bg-sky-200 text-sky-800 px-3 py-1.5 rounded-lg hover:bg-sky-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                    ดาวน์โหลดโปรแกรมติดตั้งสำหรับเครื่องอื่น
                                </a>'''
    
    content = content[:idx] + btn_html + content[idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Inserted successfully')
else:
    print('Target not found')
