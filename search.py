import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_dir(d):
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith('.jsx') or f.endswith('.js'):
                p = os.path.join(root, f)
                try:
                    with open(p, 'r', encoding='utf-8') as file:
                        for i, l in enumerate(file):
                            if 'พิมพ์ผล' in l or 'พิมพ์ใบ' in l or 'พิมพ์สติ๊กเกอร์' in l:
                                print(f'{p}:{i+1}: {l.strip()}')
                except Exception as e:
                    print(e)

search_dir(r'd:\patien-system\client\src')
