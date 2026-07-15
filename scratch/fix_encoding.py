import sys
import subprocess

# Read original App.jsx from git directly in binary mode
result = subprocess.run(['git', 'show', 'HEAD:client/src/App.jsx'], capture_output=True)
if result.returncode != 0:
    print("git show failed")
    sys.exit(1)

head_content = result.stdout.decode('utf-8')

# Find the valid rest of the app from HEAD
head_theme_start = head_content.find('<button onClick={() => setTheme')
head_modal_start = head_content.find('<PrintPreviewModal', head_theme_start)
if head_theme_start == -1 or head_modal_start == -1:
    print("Could not find boundaries in git HEAD")
    sys.exit(1)

valid_rest_of_app = head_content[head_theme_start:head_modal_start]

# Read current garbled App
with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Find the end of our new pill block in App.jsx
pill_end_marker = "                      </div>\n                  </div>\n              )}\n"
pill_end_idx = app_content.find(pill_end_marker)
if pill_end_idx == -1:
    print("Could not find pill end marker")
    sys.exit(1)
pill_end_idx += len(pill_end_marker)

# Find where the PrintPreviewModal starts in garbled App
app_modal_start = app_content.find('<PrintPreviewModal', pill_end_idx)

# Reconstruct
restored_content = app_content[:pill_end_idx] + "\n            " + valid_rest_of_app + app_content[app_modal_start:]

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(restored_content)

print("Restored cleanly without mojibake!")
