import sys

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

wrapper_start_text = '<div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-4 bg-white/95'
idx_wrapper = content.find(wrapper_start_text)

end_marker = '            <button onClick={() => setTheme(theme === \'dark\' ? \'light\' : \'dark\')}'
idx_end = content.find(end_marker)

if idx_wrapper == -1 or idx_end == -1:
    print(f"Could not find markers. wrapper:{idx_wrapper} end:{idx_end}")
    sys.exit(1)

new_block = '''                    {/* Profile & Menu Container */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 no-print flex flex-col items-start gap-2 max-w-[calc(100vw-150px)] pointer-events-none">
                        
                        {/* Main User Pill */}
                        <div className="flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 p-3 pl-4 pr-5 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl hover:shadow-2xl transition-all relative z-10 shrink-0 pointer-events-auto">
                            
                            {/* Clickable Area */}
                            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                                    <User size={26} className="text-white" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-xs font-black uppercase tracking-widest block mb-0.5 text-left">
                                        <span className="bg-gradient-to-r from-sky-500 to-indigo-500 text-transparent bg-clip-text">{user.role === 'admin' ? 'Administrator' : 'Pharmacist'}</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xl font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{user.name || user.username}</p>
                                        {showUserMenu ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Logout Divider & Button */}
                            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 transition-colors group"
                                title="ออกจากระบบ"
                            >
                                <LogOut size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Expandable Menu Container (Flows DOWNWARDS to avoid overlapping right buttons) */}
                        <div className={`transition-all duration-300 ease-out overflow-hidden pointer-events-auto ${showUserMenu ? 'max-h-[600px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
                            <div className="flex flex-wrap items-center gap-2 bg-white/95 dark:bg-slate-900/95 p-3 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl ml-2">
                                <button
                                    onClick={() => setShowPrinterSettings(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sm font-bold text-sky-600 dark:text-sky-400 transition-colors whitespace-nowrap"
                                >
                                    <Printer size={18} /> ตั้งค่าเครื่องพิมพ์
                                </button>
                                
                                <button
                                    onClick={() => setShowOfflinePrintHistory(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-colors whitespace-nowrap"
                                >
                                    <Clock size={18} /> ประวัติออฟไลน์
                                </button>
                                
                                {step !== 'drugs-info' && (
                                    <button
                                        onClick={() => setStep('drugs-info')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-sm font-bold text-emerald-600 dark:text-emerald-400 transition-colors whitespace-nowrap"
                                    >
                                        <Pill size={18} /> ข้อมูลยา (DRUGS)
                                    </button>
                                )}
                                
                                {step !== 'calculation-history' && (
                                    <button
                                        onClick={() => setStep('calculation-history')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-sm font-bold text-purple-600 dark:text-purple-400 transition-colors whitespace-nowrap"
                                    >
                                        <History size={18} /> ประวัติการคำนวณ (HISTORY)
                                    </button>
                                )}
                                
                                {step !== 'admin-order-history' && (
                                    <button
                                        onClick={() => setStep('admin-order-history')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-sm font-bold text-rose-600 dark:text-rose-400 transition-colors whitespace-nowrap"
                                    >
                                        <ClipboardList size={18} /> บันทึกการสั่งยา (ORDERS)
                                    </button>
                                )}
                                
                                {user.role === 'admin' && step !== 'admin-users' && (
                                    <button
                                        onClick={() => setStep('admin-users')}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
                                    >
                                        <Settings size={18} /> จัดการผู้ใช้ (ADMIN)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
'''

new_content = content[:idx_wrapper] + new_block + content[idx_end:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Applied beautifully redesigned vertical dropdown menu!")
