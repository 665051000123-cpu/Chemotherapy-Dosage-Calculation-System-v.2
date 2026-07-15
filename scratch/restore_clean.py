import sys

# Read HEAD
with open('scratch/App_head.jsx', 'r', encoding='utf-16') as f:
    head_content = f.read()

# Find the valid rest of the app from HEAD
head_theme_start = head_content.find('<button onClick={() => setTheme')
head_modal_start = head_content.find('<PrintPreviewModal', head_theme_start)
valid_rest_of_app = head_content[head_theme_start:head_modal_start]

# Read current broken App
with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Find the end of our new pill block in App.jsx
pill_end_marker = "                      </div>\n                  </div>\n              )}\n"
pill_end_idx = app_content.find(pill_end_marker)
if pill_end_idx == -1:
    print("Could not find pill end marker")
    # let's try a fallback
    pill_end_marker2 = "(ADMIN)\n                                  </button>\n                              </>\n                          )}\n                      </div>\n                  </div>\n              )}"
    idx2 = app_content.find(pill_end_marker2)
    if idx2 != -1:
        pill_end_idx = idx2 + len(pill_end_marker2)
    else:
        sys.exit(1)
else:
    pill_end_idx += len(pill_end_marker)

# Find where the PrintPreviewModal starts in broken App
app_modal_start = app_content.find('<PrintPreviewModal', pill_end_idx)

# Reconstruct
restored_content = app_content[:pill_end_idx] + "\n            " + valid_rest_of_app + app_content[app_modal_start:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(restored_content)

print("Restored cleanly!")
