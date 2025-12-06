const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkData() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const db = client.db('portfolio-devops');
    
    // Check all collections
    const collections = ['profiles', 'users', 'skills', 'projects', 'educations', 'experiences'];
    
    for (const collName of collections) {
      const coll = db.collection(collName);
      const count = await coll.countDocuments();
      console.log(`📊 ${collName}: ${count} documents`);
      
      if (count > 0) {
        const sample = await coll.findOne();
        console.log(`   Sample ID: ${sample._id}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkData();
