import sys

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 no-print flex flex-col items-start gap-2 max-w-[calc(100vw-150px)] pointer-events-none">'
theme_marker = '<button onClick={() => setTheme(theme === \'dark\' ? \'light\' : \'dark\')}'

idx_start = content.find(start_marker)
if idx_start == -1:
    print("Could not find start marker")
    sys.exit(1)

idx_theme = content.find(theme_marker)
if idx_theme == -1:
    print("Could not find theme marker")
    sys.exit(1)

idx_end = content.rfind('              )}', 0, idx_theme)

if idx_end == -1:
    print("Could not find end marker")
    sys.exit(1)

new_block = '''                    {/* Profile & Menu Container */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 no-print flex flex-col items-start gap-2 max-w-[calc(100vw-150px)] pointer-events-none">
                        
                        {/* Main User Pill (Premium Dark Design) */}
                        <div className="flex items-center gap-4 bg-slate-900/95 p-3 pl-4 pr-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-700/50 backdrop-blur-xl hover:shadow-[0_8px_40px_rgb(0,0,0,0.5)] transition-all relative z-10 shrink-0 pointer-events-auto">
                            
                            {/* Clickable Area */}
                            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform border border-sky-400/20">
                                    <User size={26} className="text-white" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-xs font-black uppercase tracking-widest block mb-0.5 text-left">
                                        <span className="bg-gradient-to-r from-sky-400 to-indigo-400 text-transparent bg-clip-text">{user.role === 'admin' ? 'Administrator' : 'Pharmacist'}</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-black leading-none text-white">{user.name || user.username}</p>
                                        {showUserMenu ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Logout Divider & Button */}
                            <div className="w-px h-10 bg-slate-700 mx-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors group"
                                title="ออกจากระบบ"
                            >
                                <LogOut size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Expandable Menu Container */}
                        <div className={`transition-all duration-300 ease-out overflow-hidden pointer-events-auto ${showUserMenu ? 'max-h-[600px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
                            <div className="flex flex-wrap items-center gap-2 bg-slate-900/95 p-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-700/50 backdrop-blur-xl ml-2">
                                <button
                                    onClick={() => setShowPrinterSettings(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap border border-slate-700/50 hover:border-sky-500/50 group"
                                >
                                    <Printer size={18} className="text-sky-400 group-hover:scale-110 transition-transform" /> ตั้งค่าเครื่องพิมพ์
                                </button>
                                
                                <button
                                    onClick={() => setShowOfflinePrintHistory(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap border border-slate-700/50 hover:border-indigo-500/50 group"
                                >
                                    <Clock size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" /> ประวัติออฟไลน์
                                </button>
                                
                                {step !== 'drugs-info' && (
                                    <button
                                        onClick={() => setStep('drugs-info')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap border border-slate-700/50 hover:border-emerald-500/50 group"
                                    >
                                        <Pill size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" /> ข้อมูลยา (DRUGS)
                                    </button>
                                )}
                                
                                {step !== 'calculation-history' && (
                                    <button
                                        onClick={() => setStep('calculation-history')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap border border-slate-700/50 hover:border-purple-500/50 group"
                                    >
                                        <History size={18} className="text-purple-400 group-hover:scale-110 transition-transform" /> ประวัติการคำนวณ (HISTORY)
                                    </button>
                                )}
                                
                                {step !== 'admin-order-history' && (
                                    <button
                                        onClick={() => setStep('admin-order-history')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap border border-slate-700/50 hover:border-rose-500/50 group"
                                    >
                                        <ClipboardList size={18} className="text-rose-400 group-hover:scale-110 transition-transform" /> บันทึกการสั่งยา (ORDERS)
                                    </button>
                                )}
                                
                                {user.role === 'admin' && step !== 'admin-users' && (
                                    <button
                                        onClick={() => setStep('admin-users')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sm font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap border border-slate-700/50 hover:border-slate-400/50 group"
                                    >
                                        <Settings size={18} className="text-slate-400 group-hover:scale-110 transition-transform" /> จัดการผู้ใช้ (ADMIN)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
'''

new_content = content[:idx_start] + new_block + content[idx_end:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Applied dark premium aesthetic to user pill and menu!")
