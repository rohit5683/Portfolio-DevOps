const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkEducationDocs() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('portfolio-devops');
    const education = db.collection('educations');

    // Get the most recently updated education document
    const doc = await education.findOne({}, { sort: { updatedAt: -1 } });

    if (doc) {
      console.log('\nLatest Education Document:');
      console.log('ID:', doc._id);
      console.log('School:', doc.schoolCollege);
      console.log('Documents:', doc.documents);
    } else {
      console.log('⚠️  No education documents found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkEducationDocs();
