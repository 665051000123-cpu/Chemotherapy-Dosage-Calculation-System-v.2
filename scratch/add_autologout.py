import codecs

content = codecs.open('client/src/App.jsx', 'r', 'utf-8').read()

# We need to insert a useEffect for auto logout
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

target = "const [theme, setTheme] = useState("

if target in content:
    content = content.replace(target, auto_logout_code + "\n    " + target)
    codecs.open('client/src/App.jsx', 'w', 'utf-8').write(content)
    print("Auto-logout added")
else:
    print("Could not find target")
