const http = require('http');
const fs = require('fs');

function doPost(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: body });
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

(async () => {
  const out = [];

  try {
    out.push('=== Test 1: successful registration ===');
    const r1 = await doPost('/register', { username: 'alice', password: 'pass123' });
    out.push('Status: ' + r1.statusCode);
    out.push('Body: ' + r1.body);

    out.push('\n=== Test 2: missing password ===');
    const r2 = await doPost('/register', { username: 'bob' });
    out.push('Status: ' + r2.statusCode);
    out.push('Body: ' + r2.body);
  } catch (e) {
    out.push('Error during tests: ' + e.message);
  }

  try {
    out.push('\n=== Test 3: duplicate username ===');
    const r3 = await doPost('/register', { username: 'alice', password: 'another' });
    out.push('Status: ' + r3.statusCode);
    out.push('Body: ' + r3.body);
  } catch (e) {
    out.push('Error during duplicate test: ' + e.message);
  }

  const output = out.join('\n');
  fs.writeFileSync('register_responses.txt', output, 'utf8');
  console.log('Wrote register_responses.txt');
})();
