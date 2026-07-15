import sys

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "import { Moon, Sun, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Printer, Trash2, History, User, Info, LogOut, ArrowUpDown, ChevronUp, ChevronDown, Filter, X, Settings, Pill, Search, Calendar, ClipboardList, AlertTriangle, AlertCircle, CheckCircle, Syringe, Package, Clock } from 'lucide-react';"
new_import = "import { Moon, Sun, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Printer, Trash2, History, User, Info, LogOut, ArrowUpDown, ChevronUp, ChevronDown, Filter, X, Settings, Pill, Search, Calendar, ClipboardList, AlertTriangle, AlertCircle, CheckCircle, Syringe, Package, Clock, Activity, Paperclip } from 'lucide-react';"

if import_statement in content:
    content = content.replace(import_statement, new_import)
else:
    # Try another way
    idx = content.find("from 'lucide-react';")
    if idx != -1:
        start_idx = content.rfind("import {", 0, idx)
        if start_idx != -1:
            old_import = content[start_idx:idx + 20]
            # Just append Activity, Paperclip to it
            inner = content[start_idx+8:idx-1].strip()
            # remove trailing comma if any
            if inner.endswith(','):
                inner = inner[:-1]
            new_import_full = f"import {{ {inner}, Activity, Paperclip }} from 'lucide-react';"
            content = content.replace(old_import, new_import_full)
        else:
            print("Could not parse lucide import")
            sys.exit(1)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added Activity and Paperclip to lucide-react imports!")
