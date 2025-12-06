const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

async function resetPassword() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db('portfolio-devops');
    const users = db.collection('users');

    const email = 'rohit.vishwakarma5683@gmail.com';
    const newPassword = 'admin123';

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const result = await users.updateOne(
      { email },
      { $set: { passwordHash } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Password reset successfully!');
      console.log('');
      console.log('Login credentials:');
      console.log('  Email:', email);
      console.log('  Password:', newPassword);
      console.log('  MFA Method: email');
      console.log('');
      console.log('You can now login and receive OTP via email.');
    } else {
      console.log('⚠️  No changes were made');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

resetPassword();
