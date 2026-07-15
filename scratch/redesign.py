import sys
import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the whole user block to make it beautiful
old_block = r'''                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 p-4 pr-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 no-print backdrop-blur-xl hover:shadow-\[0_20px_60px_rgba\(8,_112,_184,_0\.4\)\] transition-all">.*?</button>\s*</>\s*\)\}\s*</div>\s*</div>'''

new_block = '''                    {/* Profile & Menu Container */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 no-print flex items-center gap-3">
                        
                        {/* Main User Pill */}
                        <div className="flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 p-3 pl-4 pr-5 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl hover:shadow-2xl transition-all h-full">
                            
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
                                        {showUserMenu ? <ChevronLeft size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Logout Divider & Button */}
                            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 transition-colors group"
                                title="ออกจากระบบ"
                            >
                                <LogOut size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Expandable Horizontal Menu */}
                        <div className={`flex gap-3 items-center transition-all duration-500 ease-out overflow-hidden ${showUserMenu ? 'max-w-[800px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-10 pointer-events-none'}`}>
                            <div className="flex flex-wrap items-center gap-3 bg-white/95 dark:bg-slate-900/95 p-3 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                                <button
                                    onClick={() => setShowPrinterSettings(true)}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-base font-bold text-sky-600 dark:text-sky-400 transition-colors whitespace-nowrap shadow-sm"
                                >
                                    <Printer size={20} /> ตั้งค่าเครื่องพิมพ์
                                </button>
                                
                                <button
                                    onClick={() => setShowOfflinePrintHistory(true)}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-base font-bold text-indigo-600 dark:text-indigo-400 transition-colors whitespace-nowrap shadow-sm"
                                >
                                    <Clock size={20} /> ประวัติออฟไลน์
                                </button>
                                
                                {step !== 'drugs-info' && (
                                    <button
                                        onClick={() => setStep('drugs-info')}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-base font-bold text-emerald-600 dark:text-emerald-400 transition-colors whitespace-nowrap shadow-sm"
                                    >
                                        <Pill size={20} /> ข้อมูลยา (DRUGS)
                                    </button>
                                )}
                                
                                {step !== 'calculation-history' && (
                                    <button
                                        onClick={() => setStep('calculation-history')}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-base font-bold text-purple-600 dark:text-purple-400 transition-colors whitespace-nowrap shadow-sm"
                                    >
                                        <History size={20} /> ประวัติการคำนวณ (HISTORY)
                                    </button>
                                )}
                                
                                {step !== 'admin-order-history' && (
                                    <button
                                        onClick={() => setStep('admin-order-history')}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-base font-bold text-rose-600 dark:text-rose-400 transition-colors whitespace-nowrap shadow-sm"
                                    >
                                        <ClipboardList size={20} /> บันทึกการสั่งยา (ORDERS)
                                    </button>
                                )}
                                
                                {user.role === 'admin' && step !== 'admin-users' && (
                                    <button
                                        onClick={() => setStep('admin-users')}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-base font-bold text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap shadow-sm"
                                    >
                                        <Settings size={20} /> จัดการผู้ใช้ (ADMIN)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>'''

content = re.sub(old_block, new_block, content, flags=re.DOTALL)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Redesigned user pill and menu!")
