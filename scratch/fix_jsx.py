import sys
import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the malformed closing part
old_bad_part = '''                                )}
                            </div>
                        </div>
                    </div>
              )}
                            </div>
                        </div>
                    </div>
            )}'''

new_good_part = '''                                )}
                            </div>
                        </div>
                    </div>
            )}'''

content = content.replace(old_bad_part, new_good_part)

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed the JSX syntax issue!")
