import sys
import re

filepath = 'client/src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. wrap with <div className="flex items-center gap-4">
target1 = '<div className="flex items-center gap-2"><p className={`text-2xl font-black leading-tight'
if target1 in content:
    content = content.replace(target1, '<div className="flex items-center gap-4">\n                              ' + target1)
else:
    print("Could not find target1")
    sys.exit(1)

# 2. replace the buttons container class
target2_regex = r"className=\{`flex items-center gap-3 flex-wrap transition-all duration-500 overflow-hidden \$\{showUserMenu \? 'opacity-100 max-h-20 max-w-6xl mt-1\.5' : 'opacity-0 max-h-0 max-w-0 mt-0 border-none'\}`\}"
new_target2 = "className={`flex items-center gap-3 flex-wrap transition-all duration-500 overflow-hidden ${showUserMenu ? 'opacity-100 max-w-6xl' : 'opacity-0 max-w-0 border-none'}`}"

if re.search(target2_regex, content):
    content = re.sub(target2_regex, new_target2, content)
else:
    print("Could not find target2")
    sys.exit(1)

# 3. insert closing </div> after the buttons block
# the buttons block ends with:
#                               </button>
#                           )}
#                       </div>
end_str = "                            )}&#10;                        </div>".replace("&#10;", "\n")
# let's just find the first match of:
# "                            )}\n                        </div>"
# after the location of new_target2

idx_new = content.find(new_target2)
idx_end = content.find(")}", idx_new)
idx_end_div = content.find("</div>", idx_end)

if idx_end_div != -1:
    idx_insert = idx_end_div + 6
    content = content[:idx_insert] + '\n                          </div>' + content[idx_insert:]
else:
    print("Could not find end of block")
    sys.exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Horizontal layout applied successfully")
