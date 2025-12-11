const https = require('https');

// Query to inspect field value input types
const query = `
{
  fieldValue: __type(name: "FieldValueInput") {
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
  checkboxInput: __type(name: "CheckboxFieldInput") {
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

console.log('🔍 Querying Field Value Input schemas...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(responseData);

      if (json.data?.fieldValue?.inputFields) {
        console.log('✅ FieldValueInput fields:\n');
        json.data.fieldValue.inputFields.forEach((field) => {
          const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
          const typeKind = field.type.kind || field.type.ofType?.kind || '';
          console.log(`  ${field.name}: ${typeName} (${typeKind})`);
          if (field.description) {
            console.log(`    ${field.description}`);
          }
        });
      }

      if (json.data?.checkboxInput?.inputFields) {
        console.log('\n✅ CheckboxFieldInput fields:\n');
        json.data.checkboxInput.inputFields.forEach((field) => {
          const typeName = field.type.name || field.type.ofType?.name || 'Unknown';
          const typeKind = field.type.kind || field.type.ofType?.kind || '';
          console.log(`  ${field.name}: ${typeName} (${typeKind})`);
          if (field.description) {
            console.log(`    ${field.description}`);
          }
        });
      }

      if (!json.data?.fieldValue && !json.data?.checkboxInput) {
        console.log('Response:', JSON.stringify(json, null, 2));
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
