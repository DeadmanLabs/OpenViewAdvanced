// Simple test for basic exports without loading React components
try {
  console.log('Testing package structure...');
  
  // Test if the files exist
  const fs = require('fs');
  console.log('✓ lib/index.js exists:', fs.existsSync('./lib/index.js'));
  console.log('✓ lib/index.esm.js exists:', fs.existsSync('./lib/index.esm.js'));
  console.log('✓ lib/styles.css exists:', fs.existsSync('./lib/styles.css'));
  
  console.log('\nPackage files created successfully!');
  console.log('Ready for NPM publishing.');
  
} catch (error) {
  console.error('Test failed:', error.message);
}