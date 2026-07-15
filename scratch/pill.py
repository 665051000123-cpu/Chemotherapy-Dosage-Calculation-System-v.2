import sys

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's locate the user block
start_str = '{user && user.must_change_password !== 1 && ('
end_str = '''                              )}
                          </div>
                      </div>
                  </div>
              )}'''
              
# wait, the end_str might be slightly different now. Let's find the exact block.
idx_start = content.find(start_str)
if idx_start == -1:
    print("Could not find start")
    sys.exit(1)

# Find the end of the condition block. It ends before `              <PrintPreviewModal`
idx_end = content.find('<PrintPreviewModal', idx_start)
if idx_end == -1:
    print("Could not find end")
    sys.exit(1)
    
# We will just replace everything between idx_start and idx_end (minus some whitespace)
# Let's see what is exactly in there.
original_block = content[idx_start:idx_end]

# We construct a completely new block for the user menu
new_block = '''{user && user.must_change_password !== 1 && (
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 p-1.5 pr-4 rounded-full shadow-md border border-slate-200 dark:border-slate-800 z-50 no-print backdrop-blur-xl">
                      {/* Clickable Profile Area */}
                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowUserMenu(!showUserMenu)}>
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                              <User size={16} className="text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                              <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{user.name || user.username}</p>
                              {showUserMenu ? <ChevronLeft size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                          </div>
                      </div>

                      {/* Buttons Area - Absolute positioned so it doesn't affect pill height/width, and wraps nicely if screen is narrow */}
                      <div className={`absolute left-full top-0 ml-2 bg-white/95 dark:bg-slate-900/95 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex gap-2 flex-wrap items-center transition-all duration-300 transform origin-left w-max max-w-[calc(100vw-250px)] ${showUserMenu ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                          <button
                              onClick={() => setShowPrinterSettings(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/30 text-xs font-bold text-sky-600 dark:text-sky-400 transition-colors whitespace-nowrap"
                          >
                              <Printer size={14} /> ตั้งค่าเครื่องพิมพ์
                          </button>
                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                          <button
                              onClick={() => setShowOfflinePrintHistory(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-colors whitespace-nowrap"
                          >
                              <Clock size={14} /> ประวัติออฟไลน์
                          </button>
                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                          <button
                              onClick={handleLogout}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-xs font-bold text-red-600 dark:text-red-400 transition-colors whitespace-nowrap"
                          >
                              <LogOut size={14} /> ออกจากระบบ
                          </button>
                          {step !== 'drugs-info' && (
                              <>
                                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                                  <button
                                      onClick={() => setStep('drugs-info')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors whitespace-nowrap"
                                  >
                                      <Pill size={14} /> ข้อมูลยา (DRUGS)
                                  </button>
                              </>
                          )}
                          {step !== 'calculation-history' && (
                              <>
                                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                                  <button
                                      onClick={() => setStep('calculation-history')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 text-xs font-bold text-purple-600 dark:text-purple-400 transition-colors whitespace-nowrap"
                                  >
                                      <History size={14} /> ประวัติการคำนวณ (HISTORY)
                                  </button>
                              </>
                          )}
                          {step !== 'orders-history' && (
                              <>
                                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                                  <button
                                      onClick={() => setStep('orders-history')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors whitespace-nowrap"
                                  >
                                      <ClipboardList size={14} /> บันทึกการสั่งยา (ORDERS)
                                  </button>
                              </>
                          )}
                          {user.role === 'admin' && step !== 'admin' && (
                              <>
                                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                                  <button
                                      onClick={() => setStep('admin')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/30 text-xs font-bold text-sky-600 dark:text-sky-400 transition-colors whitespace-nowrap"
                                  >
                                      <Settings size={14} /> จัดการผู้ใช้ (ADMIN)
                                  </button>
                              </>
                          )}
                      </div>
                  </div>
              )}
              '''
              
# We will just replace it!
content = content[:idx_start] + new_block + content[idx_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Pill layout applied successfully")
