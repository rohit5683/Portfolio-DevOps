require('dotenv').config();
const { Resend } = require('resend');

async function testEmail() {
  const apiKey = process.env.RESEND_API_KEY;
  console.log('Checking RESEND_API_KEY...');
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing in .env file');
    return;
  }
  
  console.log(`✅ Key found (length: ${apiKey.length})`);
  
  const resend = new Resend(apiKey);
  const recipient = 'rohit.vishwakarma5683@gmail.com'; // Hardcoded based on previous logs for testing
  
  console.log(`Attempting to send test email to ${recipient}...`);

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipient,
      subject: 'Test Email from Debug Script',
      html: '<p>If you see this, Resend is working correctly!</p>'
    });

    if (error) {
      console.error('❌ Resend API returned error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', data.id);
    }
  } catch (err) {
    console.error('❌ Exception occurred:', err);
    if (err.cause) console.error('Cause:', err.cause);
  }

  console.log('\n--- Testing Raw Fetch ---');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: recipient,
        subject: 'Raw Fetch Test',
        html: '<p>Raw fetch works!</p>'
      })
    });
    
    console.log('Raw Fetch Status:', response.status);
    const text = await response.text();
    console.log('Raw Fetch Body:', text);
  } catch (fetchErr) {
    console.error('❌ Raw Fetch Failed:', fetchErr);
    if (fetchErr.cause) console.error('Cause:', fetchErr.cause);
  }
}

testEmail();
