import codecs

content = codecs.open('oncology-backend/server.js', 'r', 'utf-8').read()

require_stmt = "const { startAutoBackup } = require('./autobackup');\nstartAutoBackup();\n\n"
target = "app.listen(PORT, () => {"

if require_stmt not in content:
    content = content.replace(target, require_stmt + target)
    codecs.open('oncology-backend/server.js', 'w', 'utf-8').write(content)
    print("Injected backup logic")
else:
    print("Already injected")
