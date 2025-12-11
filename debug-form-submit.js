// Add this script to your page to intercept and log GraphQL mutations
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const [url, options] = args;

    // Check if this is a GraphQL request
    if (url && url.includes('/graphql')) {
      try {
        const body = options?.body;
        if (body) {
          let parsedBody;
          if (typeof body === 'string') {
            parsedBody = JSON.parse(body);
          } else {
            parsedBody = body;
          }

          // Check if it's a form submission
          if (parsedBody?.query?.includes('submitGfForm') || parsedBody?.operationName === 'submitGfForm') {
            console.log('🔍 INTERCEPTED FORM SUBMISSION');
            console.log('📋 Full Request Body:', JSON.stringify(parsedBody, null, 2));
            console.log('📝 Variables:', JSON.stringify(parsedBody.variables, null, 2));

            // Log each field value in detail
            if (parsedBody.variables?.fieldValues) {
              console.log('\n📊 Field Values Detail:');
              parsedBody.variables.fieldValues.forEach((field, index) => {
                console.log(`\nField ${index + 1}:`, {
                  id: field.id,
                  value: field.value,
                  emailValues: field.emailValues,
                  checkboxValues: field.checkboxValues,
                  addressValues: field.addressValues,
                  nameValues: field.nameValues,
                  listValues: field.listValues,
                  timeValues: field.timeValues,
                  keys: Object.keys(field)
                });
              });
            }
          }
        }
      } catch (e) {
        console.error('Error parsing request:', e);
      }
    }

    return originalFetch.apply(this, args);
  };

  console.log('✅ Form submission debugger installed');
})();
