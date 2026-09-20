const fs = require('fs');
let f = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
f = f.replace(/\{usr\.userType === 'SCHOOL'[\s\S]*?\}/, "{usr.userType === 'SCHOOL' ? '🏫 School' : usr.userType === 'COMMERCIAL' ? '🏢 Commercial' : usr.userType === 'RESIDENTIAL' ? '🏠 Residential' : 'N/A'}");
fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', f);
