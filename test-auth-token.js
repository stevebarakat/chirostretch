/**
 * Test script to verify JWT authentication with WordPress
 * Run with: node test-auth-token.js <your-jwt-token>
 */

const https = require('https');

const token = process.argv[2];

if (!token) {
  console.error('Usage: node test-auth-token.js <jwt-token>');
  console.error('\nTo get your token, open browser console on https://localhost:3000 and run:');
  console.error('document.cookie.split("; ").find(c => c.startsWith("wp-auth-token="))?.split("=")[1]');
  process.exit(1);
}

const query = `
  query TestAuth {
    viewer {
      id
      databaseId
      email
      username
    }
    customer {
      id
      databaseId
      email
      username
    }
  }
`;

const postData = JSON.stringify({
  query,
});

const options = {
  hostname: 'chirostretch-copy.local',
  port: 443,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': `Bearer ${token}`,
  },
  rejectUnauthorized: false, // Accept self-signed certificates
};

console.log('Testing authentication with WordPress GraphQL...\n');
console.log('Endpoint:', `https://${options.hostname}${options.path}`);
console.log('Token (first 50 chars):', token.substring(0, 50) + '...\n');

const req = https.request(options, (res) => {
  console.log('HTTP Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\n--- Response Body ---');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));

      if (parsed.data) {
        console.log('\n--- Analysis ---');
        if (parsed.data.viewer && parsed.data.viewer.id) {
          console.log('✅ viewer query successful - User is authenticated!');
          console.log('   User ID:', parsed.data.viewer.databaseId);
          console.log('   Username:', parsed.data.viewer.username);
        } else {
          console.log('❌ viewer is null - Token not recognized by WordPress');
        }

        if (parsed.data.customer && parsed.data.customer.databaseId) {
          console.log('✅ customer query successful - WooCommerce customer found!');
        } else {
          console.log('❌ customer returned as guest - No WooCommerce customer data');
        }
      }

      if (parsed.errors) {
        console.log('\n--- GraphQL Errors ---');
        parsed.errors.forEach(err => {
          console.log('Error:', err.message);
        });
      }
    } catch (e) {
      console.log('Raw response:', data);
      console.log('\nFailed to parse JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request failed:', e.message);
});

req.write(postData);
req.end();
