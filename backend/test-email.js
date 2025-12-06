const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email configuration...\n');
  
  // Display configuration (hiding password)
  console.log('SMTP Configuration:');
  console.log('User:', process.env.SMTP_USER);
  console.log('Password:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  console.log('');

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ ERROR: SMTP credentials not found in .env file');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log('Testing SMTP connection...');
  
  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Portfolio Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: 'Test Email from Portfolio Backend',
      text: 'This is a test email to verify the email service is working correctly.',
      html: '<p>This is a <strong>test email</strong> to verify the email service is working correctly.</p>',
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nPlease check your inbox at:', process.env.SMTP_USER);
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. Possible issues:');
      console.error('   1. App Password is incorrect');
      console.error('   2. App Password has spaces (should be removed)');
      console.error('   3. 2-Factor Authentication not enabled on Gmail');
      console.error('   4. App Password not generated from Google Account settings');
      console.error('\n📝 To fix:');
      console.error('   1. Go to https://myaccount.google.com/apppasswords');
      console.error('   2. Generate a new App Password');
      console.error('   3. Update SMTP_PASS in .env (remove all spaces)');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n⚠️  Connection failed. Check your internet connection.');
    }
  }
}

testEmail();
