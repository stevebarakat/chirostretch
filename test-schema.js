const https = require('https');

// Query to inspect the SubmitGfFormInput schema
const query = `
{
  __type(name: "SubmitGfFormInput") {
    name
    kind
    inputFields {
      name
      type {
        name
        kind
        ofType {
          name
          kind
        }
      }
      description
    }
  }
}
`;

const data = JSON.stringify({ query });

const options = {
  hostname: 'chirostretch-copy.local',
  port: 443,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  },
  rejectUnauthorized: false
};

console.log('🔍 Querying SubmitGfFormInput schema...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(responseData);

      if (json.data?.__type?.inputFields) {
        console.log('✅ SubmitGfFormInput fields:\n');
        json.data.__type.inputFields.forEach((field) => {
          const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
          const typeKind = field.type.kind || field.type.ofType?.kind || '';
          console.log(`  ${field.name}: ${typeName} (${typeKind})`);
          if (field.description) {
            console.log(`    Description: ${field.description}`);
          }
        });
      } else {
        console.log('❌ Could not find SubmitGfFormInput type');
        console.log(JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.log('Raw response:', responseData);
      console.log('❌ Failed to parse JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(data);
req.end();
