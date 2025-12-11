const https = require('https');

// Test GraphQL mutation for form submission
const mutation = `
mutation SubmitForm($input: SubmitGfFormInput!) {
  submitGfForm(input: $input) {
    confirmation {
      message
    }
    errors {
      id
      message
    }
    entry {
      id
      formId
      dateCreated
    }
  }
}
`;

// Test data with correct field IDs from form 16
const variables = {
  input: {
    id: 16,  // Form ID - use 'id' not 'formId'
    clientMutationId: "test-submission-" + Date.now(),
    fieldValues: [
      // Page 1: Contact Information (all required)
      { id: 1, value: "Test" },              // First Name
      { id: 2, value: "User" },              // Last Name
      { id: 3, emailValues: { value: "test@example.com" } }, // Email
      { id: 4, value: "(555) 555-5555" },    // Phone
      { id: 5, value: "Email" },             // Preferred Contact Method (radio)
      { id: 6, value: "USA" },               // Country
      { id: 7, value: "CA" },                // State / Province
      { id: 8, value: "Los Angeles" },       // City
      // Field 9 (lead_source) is optional
      // Field 10 is PAGE field (skipped)

      // Page 5: Motivation & Fit
      { id: 30, value: "Testing motivation - interested in franchise" }, // Motivation (required)
      { id: 31, value: "Testing strengths - business experience" },   // Strengths (required)

      // Field 34 is PAGE field (skipped)

      // Page 6: Final Review
      { id: 35, checkboxValues: [
        { inputId: 1, value: "not_binding" },
        { inputId: 2, value: "contact_agreement" }
      ] } // Agreements (required checkbox)
    ]
  }
};

const data = JSON.stringify({
  query: mutation,
  variables: variables
});

const options = {
  hostname: 'chirostretch-copy.local',
  port: 443,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  },
  rejectUnauthorized: false // For local SSL
};

console.log('🔄 Testing form submission...\n');
console.log('Mutation:', mutation);
console.log('\nVariables:', JSON.stringify(variables, null, 2));
console.log('\n📡 Sending request to:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('\n📥 Response Status:', res.statusCode);
    console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
    console.log('\n📄 Response Body:');

    try {
      const json = JSON.parse(responseData);
      console.log(JSON.stringify(json, null, 2));

      if (json.errors) {
        console.log('\n❌ GraphQL Errors Found:');
        json.errors.forEach((error, i) => {
          console.log(`\nError ${i + 1}:`);
          console.log('  Message:', error.message);
          console.log('  Path:', error.path);
          console.log('  Locations:', error.locations);
          if (error.extensions) {
            console.log('  Extensions:', JSON.stringify(error.extensions, null, 2));
          }
        });
      } else if (json.data?.submitGfForm?.errors) {
        console.log('\n⚠️ Form Validation Errors:');
        json.data.submitGfForm.errors.forEach((error) => {
          console.log(`  Field ${error.id}: ${error.message}`);
        });
      } else if (json.data?.submitGfForm?.entry) {
        console.log('\n✅ Form submitted successfully!');
        console.log('Entry ID:', json.data.submitGfForm.entry.id);
      }
    } catch (e) {
      console.log('Raw response:', responseData);
      console.log('\n❌ Failed to parse JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(data);
req.end();
