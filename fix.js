const fs = require('fs');
const path = require('path');

const backendSrc = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'techforbetter', 'smartwaste');

const deleteFile = (relPath) => {
    const fullPath = path.join(backendSrc, ...relPath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

// 1. Delete DataLoader.java
deleteFile(['DataLoader.java']);

// 2. Fix IndianDataSeeder.java
const seederPath = path.join(backendSrc, 'config', 'IndianDataSeeder.java');
if (fs.existsSync(seederPath)) {
    let content = fs.readFileSync(seederPath, 'utf8');
    content = content.replace('import com.techforbetter.smartwaste.entity.Role;', 'import com.techforbetter.smartwaste.enums.Role;');
    fs.writeFileSync(seederPath, content);
}

// 3. Fix AuthService.java
const authServicePath = path.join(backendSrc, 'service', 'AuthService.java');
if (fs.existsSync(authServicePath)) {
    let content = fs.readFileSync(authServicePath, 'utf8');
    content = content.replace('import com.techforbetter.smartwaste.dto.LoginRequest;', 'import com.techforbetter.smartwaste.dto.AuthRequest;');
    content = content.replace('public AuthResponse login(LoginRequest request)', 'public AuthResponse login(AuthRequest request)');
    content = content.replace('import com.techforbetter.smartwaste.security.JwtService;', 'import com.techforbetter.smartwaste.security.JwtUtil;');
    content = content.replace('private final JwtService jwtService;', 'private final JwtUtil jwtUtil;');
    content = content.replace(/jwtService\.generateToken/g, 'jwtUtil.generateToken');
    fs.writeFileSync(authServicePath, content);
}

console.log("Fixes applied successfully!");
