const { MongoClient } = require('mongodb');

async function switchToEmailMFA() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db('portfolio-devops');
    const users = db.collection('users');

    // Find the user
    const user = await users.findOne({ email: 'rohit.vishwakarma5683@gmail.com' });
    
    if (!user) {
      console.error('❌ User not found');
      return;
    }

    console.log('Current user configuration:');
    console.log('Email:', user.email);
    console.log('MFA Enabled:', user.mfaEnabled);
    console.log('MFA Method:', user.mfaMethod);
    console.log('');

    if (user.mfaMethod === 'email') {
      console.log('✅ User is already configured for email MFA');
      return;
    }

    // Update to email MFA
    const result = await users.updateOne(
      { email: 'rohit.vishwakarma5683@gmail.com' },
      { 
        $set: { 
          mfaMethod: 'email',
          // Clear TOTP secret since we're switching to email
          totpSecret: null
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully switched MFA method to email');
      console.log('');
      console.log('You can now login and receive OTP codes via email at:');
      console.log('   ', user.email);
    } else {
      console.log('⚠️  No changes were made');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

switchToEmailMFA();
