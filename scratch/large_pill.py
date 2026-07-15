import sys
import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. replace outer div of the pill
content = re.sub(
    r'<div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-white/95[^>]*>',
    '<div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 p-4 pr-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 no-print backdrop-blur-xl hover:shadow-[0_20px_60px_rgba(8,_112,_184,_0.4)] transition-all">',
    content
)

# 2. replace inner clickable profile area
old_profile = r'''<div className="flex items-center gap-3 cursor-pointer group" onClick=\{\(\) => setShowUserMenu\(!showUserMenu\)\}>.*?<div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
\s*<User size=\{16\} className="text-white" />
\s*</div>
\s*<div className="flex items-center gap-2">
\s*<p className=\{`text-sm font-black \$\{theme === 'dark' \? 'text-white' : 'text-slate-800'\}`\}>\{user\.name \|\| user\.username\}</p>
\s*\{showUserMenu \? <ChevronLeft size=\{16\} className="text-slate-400" /> : <ChevronRight size=\{16\} className="text-slate-400" />\}
\s*</div>
\s*</div>'''

new_profile = '''<div className="flex items-center gap-4 cursor-pointer group" onClick={() => setShowUserMenu(!showUserMenu)}>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                                <User size={26} className="text-white" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-xs font-black uppercase tracking-widest block mb-0.5 text-left">
                                    <span className="bg-gradient-to-r from-sky-500 to-indigo-500 text-transparent bg-clip-text">{user.role === 'admin' ? 'Administrator' : 'Pharmacist'}</span>
                                </p>
                                <div className="flex items-center gap-3">
                                    <p className={`text-2xl font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{user.name || user.username}</p>
                                    {showUserMenu ? <ChevronLeft size={24} className="text-slate-400" /> : <ChevronRight size={24} className="text-slate-400" />}
                                </div>
                            </div>
                        </div>'''

content = re.sub(old_profile, new_profile, content, flags=re.DOTALL)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied large pill!")
