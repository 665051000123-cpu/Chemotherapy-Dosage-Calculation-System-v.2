import sys

# 1. Read App_head.jsx to extract the missing body
with open('scratch/App_head.jsx', 'r', encoding='utf-16') as f:
    head_content = f.read()

# Find where the user block ends in HEAD
# In HEAD, the user block starts with `{user && user.must_change_password !== 1 && (`
head_user_start = head_content.find('{user && user.must_change_password !== 1 && (')
head_modal_start = head_content.find('<PrintPreviewModal', head_user_start)

# But wait, we need the exact end of the user block in HEAD
# The user block ends with:
#                               </button>
#                           )}
#                       </div>
#                   </div>
#               </div>
#           )}
head_user_end_str = "              )}\n"
head_user_end_idx = head_content.find(head_user_end_str, head_user_start)
if head_user_end_idx != -1:
    head_user_end_idx += len(head_user_end_str)
else:
    # fallback to find the next div
    head_user_end_idx = head_content.find('<div className="max-w-5xl', head_user_start)

# The missing block is from head_user_end_idx to head_modal_start
missing_block = head_content[head_user_end_idx:head_modal_start]

# 2. Read broken App.jsx
with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

# In broken App.jsx, the user block ends, and then immediately <PrintPreviewModal
app_modal_start = app_content.find('<PrintPreviewModal')

# Insert the missing block right before <PrintPreviewModal
restored_content = app_content[:app_modal_start] + missing_block + app_content[app_modal_start:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(restored_content)

print("Restored missing content successfully.")
