const { MongoClient } = require('mongodb');
require('dotenv').config();

async function enableMFA() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('portfolio-devops');
    const users = db.collection('users');

    const result = await users.updateOne(
      { email: 'rohit.vishwakarma5683@gmail.com' },
      { $set: { mfaEnabled: true } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ MFA enabled for user');
    } else {
      console.log('⚠️  User not found or MFA already enabled');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

enableMFA();
