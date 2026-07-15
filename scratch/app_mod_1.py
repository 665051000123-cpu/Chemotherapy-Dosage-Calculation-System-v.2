import sys

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
import_str = "import OfflinePrintHistoryModal from './components/OfflinePrintHistoryModal';\nimport { addOfflinePrintHistory } from './utils/offlinePrintHistory';\n"
if 'OfflinePrintHistoryModal' not in content:
    idx = content.find('import PrintPreviewModal')
    if idx != -1:
        content = content[:idx] + import_str + content[idx:]

# 1.5 Add Clock icon to lucide-react imports if not there
if 'Clock' not in content and 'lucide-react' in content:
    content = content.replace("import { Printer,", "import { Printer, Clock,")

# 2. Add state
state_str = "    const [showOfflinePrintHistory, setShowOfflinePrintHistory] = useState(false);\n"
if 'showOfflinePrintHistory' not in content:
    idx = content.find('const [showPrinterSettings, setShowPrinterSettings] = useState(false);')
    if idx != -1:
        content = content[:idx] + state_str + content[idx:]

# 3. Add button in Header
header_btn_str = '''                              <button
                                  onClick={() => setShowOfflinePrintHistory(true)}
                                  className="flex items-center gap-1.5 text-xs font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-widest text-left cursor-pointer border-r border-slate-700/50 pr-3 whitespace-nowrap"
                              >
                                  <Clock size={14} /> ประวัติออฟไลน์
                              </button>
'''
if 'ประวัติออฟไลน์' not in content:
    idx = content.find('<Printer size={14} /> ตั้งค่าเครื่องปริ้นท์')
    if idx != -1:
        # find the closing button tag after this text
        end_idx = content.find('</button>', idx)
        if end_idx != -1:
            end_idx += 9 # len('</button>')
            content = content[:end_idx] + '\n' + header_btn_str + content[end_idx:]

# 4. Render the modal
modal_str = '''
            <OfflinePrintHistoryModal
                show={showOfflinePrintHistory}
                onClose={() => setShowOfflinePrintHistory(false)}
                user={user}
                showNotification={showNotification}
            />
'''
if 'OfflinePrintHistoryModal show=' not in content:
    idx = content.find('<PrinterSettings')
    if idx != -1:
        content = content[:idx] + modal_str + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Phase 1 done')
