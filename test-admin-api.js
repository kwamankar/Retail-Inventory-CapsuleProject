const http = require('http');

// Test data
const loginData = 'username=admin&password=admin123';

// First login to get session
const loginReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (loginRes) => {
  console.log('Login Response Status:', loginRes.statusCode);
  
  let body = '';
  loginRes.on('data', (chunk) => {
    body += chunk;
  });
  
  loginRes.on('end', () => {
    console.log('Login Response:', body);
    
    // Extract cookies from login response
    const cookies = loginRes.headers['set-cookie'];
    if (cookies) {
      const sessionCookie = cookies.find(cookie => cookie.startsWith('connect.sid'));
      
      if (sessionCookie) {
        console.log('Session Cookie:', sessionCookie.split(';')[0]);
        
        // Now test the admin dashboard API
        const apiReq = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/dashboard-stats',
          method: 'GET',
          headers: {
            'Cookie': sessionCookie.split(';')[0]
          }
        }, (apiRes) => {
          console.log('\nAdmin API Response Status:', apiRes.statusCode);
          
          let apiBody = '';
          apiRes.on('data', (chunk) => {
            apiBody += chunk;
          });
          
          apiRes.on('end', () => {
            console.log('Admin API Response:', apiBody);
            process.exit(0);
          });
        });
        
        apiReq.on('error', (err) => {
          console.error('API Request Error:', err);
          process.exit(1);
        });
        
        apiReq.end();
      } else {
        console.log('No session cookie found');
        process.exit(1);
      }
    } else {
      console.log('No cookies in login response');
      process.exit(1);
    }
  });
});

loginReq.on('error', (err) => {
  console.error('Login Request Error:', err);
  process.exit(1);
});

loginReq.write(loginData);
loginReq.end();
