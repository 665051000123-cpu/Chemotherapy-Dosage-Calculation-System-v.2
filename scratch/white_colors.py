import sys

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 no-print flex flex-col items-start'
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

new_block = '''                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 no-print flex flex-col items-start gap-2 max-w-[calc(100vw-150px)] pointer-events-none">
                        
                        {/* Main User Pill (White Colorful Design) */}
                        <div className="flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 p-3 pl-4 pr-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-none border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] transition-all relative z-10 shrink-0 pointer-events-auto group">
                            
                            {/* Clickable Area */}
                            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform border border-sky-400/20">
                                    <User size={26} className="text-white" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-xs font-black uppercase tracking-widest block mb-0.5 text-left">
                                        <span className="bg-gradient-to-r from-sky-500 to-indigo-500 text-transparent bg-clip-text">{user.role === 'admin' ? 'Administrator' : 'Pharmacist'}</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xl font-black leading-none text-slate-800 dark:text-white">{user.name || user.username}</p>
                                        {showUserMenu ? <ChevronUp size={20} className="text-sky-500" /> : <ChevronDown size={20} className="text-slate-400 group-hover:text-sky-500 transition-colors" />}
                                    </div>
                                </div>
                            </div>

                            {/* Logout Divider & Button */}
                            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-colors"
                                title="ออกจากระบบ"
                            >
                                <LogOut size={24} className="hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Expandable Menu Container */}
                        <div className={`transition-all duration-300 ease-out overflow-hidden pointer-events-auto ${showUserMenu ? 'max-h-[600px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
                            <div className="flex flex-wrap items-center gap-2 bg-white/95 dark:bg-slate-900/95 p-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-none border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl ml-2">
                                <button
                                    onClick={() => setShowPrinterSettings(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sm font-bold text-sky-600 dark:text-sky-400 transition-colors whitespace-nowrap border border-sky-100 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-500/50 shadow-sm"
                                >
                                    <Printer size={18} className="text-sky-500" /> ตั้งค่าเครื่องพิมพ์
                                </button>
                                
                                <button
                                    onClick={() => setShowOfflinePrintHistory(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-colors whitespace-nowrap border border-indigo-100 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-sm"
                                >
                                    <Clock size={18} className="text-indigo-500" /> ประวัติออฟไลน์
                                </button>
                                
                                {step !== 'drugs-info' && (
                                    <button
                                        onClick={() => setStep('drugs-info')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-sm font-bold text-emerald-600 dark:text-emerald-400 transition-colors whitespace-nowrap border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-500/50 shadow-sm"
                                    >
                                        <Pill size={18} className="text-emerald-500" /> ข้อมูลยา (DRUGS)
                                    </button>
                                )}
                                
                                {step !== 'calculation-history' && (
                                    <button
                                        onClick={() => setStep('calculation-history')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-sm font-bold text-purple-600 dark:text-purple-400 transition-colors whitespace-nowrap border border-purple-100 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-sm"
                                    >
                                        <History size={18} className="text-purple-500" /> ประวัติการคำนวณ (HISTORY)
                                    </button>
                                )}
                                
                                {step !== 'admin-order-history' && (
                                    <button
                                        onClick={() => setStep('admin-order-history')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-sm font-bold text-rose-600 dark:text-rose-400 transition-colors whitespace-nowrap border border-rose-100 dark:border-rose-800/50 hover:border-rose-300 dark:hover:border-rose-500/50 shadow-sm"
                                    >
                                        <ClipboardList size={18} className="text-rose-500" /> บันทึกการสั่งยา (ORDERS)
                                    </button>
                                )}
                                
                                {user.role === 'admin' && step !== 'admin-users' && (
                                    <button
                                        onClick={() => setStep('admin-users')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-500/50 shadow-sm"
                                    >
                                        <Settings size={18} className="text-slate-500 dark:text-slate-400" /> จัดการผู้ใช้ (ADMIN)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
'''

new_content = content[:idx_start] + new_block + content[idx_end:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Applied bright colorful aesthetic to user pill and menu!")
