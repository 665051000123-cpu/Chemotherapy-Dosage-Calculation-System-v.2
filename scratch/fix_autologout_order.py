import codecs

content = codecs.open('client/src/App.jsx', 'r', 'utf-8').read()

auto_logout_code = """
    // --- Auto Logout System ---
    useEffect(() => {
        if (!user) return; // Only track when logged in

        let timeoutId;
        
        const resetTimer = () => {
            clearTimeout(timeoutId);
            // 15 minutes = 15 * 60 * 1000 = 900000 ms
            timeoutId = setTimeout(() => {
                handleLogout();
                alert('ระบบได้ทำการออกจากระบบอัตโนมัติ เนื่องจากไม่มีการใช้งานเกิน 15 นาที เพื่อความปลอดภัยของข้อมูลครับ');
            }, 900000); 
        };

        // Listen for user interactions
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        resetTimer(); // Initialize

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [user]);
    // --------------------------
"""

# Remove the old one
content = content.replace(auto_logout_code, "")
# And with the extra newline just in case
content = content.replace(auto_logout_code + "\n    ", "")

# Find where to put it:
target = """    const [isDateEditable, setIsDateEditable] = useState(false);"""

content = content.replace(target, target + "\n" + auto_logout_code)
codecs.open('client/src/App.jsx', 'w', 'utf-8').write(content)
print("Auto-logout moved")
