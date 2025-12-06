const { MongoClient } = require('mongodb');
require('dotenv').config();

async function disableMFA() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('portfolio-devops');
    const users = db.collection('users');

    const result = await users.updateOne(
      { email: 'rohit.vishwakarma5683@gmail.com' },
      { $set: { mfaEnabled: false } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ MFA disabled for user');
    } else {
      console.log('⚠️  User not found or MFA already disabled');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

disableMFA();
