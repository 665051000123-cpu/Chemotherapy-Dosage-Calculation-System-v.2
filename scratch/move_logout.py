import sys
import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add logout button to the pill
old_profile_end = r'''                                    \{showUserMenu \? <ChevronLeft size=\{24\} className="text-slate-400" /> : <ChevronRight size=\{24\} className="text-slate-400" />\}
                                </div>
                            </div>
                        </div>'''

new_profile_end = '''                                    {showUserMenu ? <ChevronLeft size={24} className="text-slate-400" /> : <ChevronRight size={24} className="text-slate-400" />}
                                </div>
                            </div>
                        </div>

                        {/* Logout Button inside the main pill */}
                        <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <button
                            onClick={handleLogout}
                            className="p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 transition-colors flex items-center justify-center group"
                            title="ออกจากระบบ"
                        >
                            <LogOut size={24} className="group-hover:scale-110 transition-transform" />
                        </button>'''

content = re.sub(old_profile_end, new_profile_end, content, flags=re.DOTALL)

# 2. Remove logout button from the menu
old_logout_in_menu = r'''                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                          <button
                              onClick=\{handleLogout\}
                              className="flex items-center gap-1.5 px-5 py-3 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-lg font-bold text-red-600 dark:text-red-400 transition-colors whitespace-nowrap"
                          >
                              <LogOut size=\{20\} /> ออกจากระบบ
                          </button>'''

content = re.sub(old_logout_in_menu, '', content, flags=re.DOTALL)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved logout button to the main pill!")
