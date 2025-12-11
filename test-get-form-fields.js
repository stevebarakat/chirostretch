const https = require('https');

// Query to get all fields from form 16
const query = `
query GetForm {
  gfForm(id: 16, idType: DATABASE_ID) {
    databaseId
    title
    formFields {
      nodes {
        id
        databaseId
        type
        ... on TextField {
          label
          isRequired
          adminLabel
        }
        ... on EmailField {
          label
          isRequired
          adminLabel
        }
        ... on PhoneField {
          label
          isRequired
          adminLabel
        }
        ... on RadioField {
          label
          isRequired
          adminLabel
        }
        ... on SelectField {
          label
          adminLabel
        }
        ... on TextAreaField {
          label
          isRequired
          adminLabel
        }
        ... on NumberField {
          label
          adminLabel
        }
        ... on CheckboxField {
          label
          isRequired
          adminLabel
          inputs {
            id
            label
          }
        }
        ... on HiddenField {
          label
        }
      }
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

console.log('🔍 Querying Form 16 fields...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(responseData);

      if (json.data?.gfForm?.formFields?.nodes) {
        const fields = json.data.gfForm.formFields.nodes;

        console.log(`✅ Form: ${json.data.gfForm.title} (ID: ${json.data.gfForm.databaseId})`);
        console.log(`\nTotal fields: ${fields.length}\n`);

        fields.forEach((field, index) => {
          const required = field.isRequired ? ' [REQUIRED]' : '';
          const adminLabel = field.adminLabel ? ` (${field.adminLabel})` : '';

          console.log(`${index + 1}. Field ID: ${field.databaseId}`);
          console.log(`   Type: ${field.type}${required}`);
          console.log(`   Label: ${field.label}${adminLabel}`);

          if (field.type === 'CHECKBOX' && field.inputs) {
            console.log(`   Inputs: ${field.inputs.map(i => `${i.id}: ${i.label}`).join(', ')}`);
          }

          console.log('');
        });

        // List required fields
        const requiredFields = fields.filter(f => f.isRequired);
        if (requiredFields.length > 0) {
          console.log('\n📋 Required fields:');
          requiredFields.forEach(field => {
            console.log(`   - Field ${field.databaseId}: ${field.label} (${field.type})`);
          });
        }
      } else {
        console.log('❌ Could not find form or fields');
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
