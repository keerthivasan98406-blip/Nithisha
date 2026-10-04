const http = require('http');

function post(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(path, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('Testing Admin Login...');
  const loginRes = await post('/api/auth/login', { username: 'admin', password: 'LurelleAdmin2025!' });
  console.log('Login Status:', loginRes.status, 'Token exists:', !!loginRes.data.token);

  const token = loginRes.data.token;

  console.log('Testing Dashboard Stats with Token...');
  const statsRes = await get('/api/sales/dashboard-stats', token);
  console.log('Dashboard Stats Status:', statsRes.status);
  console.log('Stats Summary:', {
    products: statsRes.data.products,
    today: statsRes.data.today,
    monthly: statsRes.data.monthly
  });

  console.log('Testing Settings...');
  const settingsRes = await get('/api/settings');
  console.log('Shop Name:', settingsRes.data.shop_name, 'WhatsApp:', settingsRes.data.whatsapp_number);
}

runTests().catch(console.error);
