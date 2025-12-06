const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testContactEmail() {
  console.log('Testing Contact Email Endpoint...\n');
  
  try {
    const response = await axios.post(`${BASE_URL}/contact`, {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Contact Form',
      message: 'This is a test message from the contact form to verify email service is working.',
    });

    console.log('✅ Contact email endpoint response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n📧 Check your email inbox for the contact form submission!');
  } catch (error) {
    console.error('❌ Contact email test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testMfaEmail() {
  console.log('\nTesting MFA Email (Login Flow)...\n');
  
  try {
    // First, attempt login to trigger MFA email
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com', // Default admin user
      password: 'admin123',
    });

    console.log('✅ Login response (should trigger MFA):');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n📧 Check your email inbox for the MFA OTP!');
  } catch (error) {
    console.error('❌ MFA email test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('EMAIL SERVICE INTEGRATION TEST');
  console.log('='.repeat(60));
  console.log('');
  
  // Wait for backend to be ready
  console.log('Checking if backend is running...');
  try {
    await axios.get(`${BASE_URL}`);
    console.log('✅ Backend is running\n');
  } catch (error) {
    console.error('❌ Backend is not running. Please start it with: npm run start:dev');
    process.exit(1);
  }

  await testContactEmail();
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  await testMfaEmail();
  
  console.log('\n' + '='.repeat(60));
  console.log('Test completed!');
  console.log('='.repeat(60));
}

runTests();
