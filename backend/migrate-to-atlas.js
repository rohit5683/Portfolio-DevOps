const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrateData() {
  // Source: Local MongoDB
  const sourceUri = 'mongodb://localhost:27017/portfolio-devops';
  
  // Destination: MongoDB Atlas (from .env)
  const destUri = process.env.MONGO_URI;

  if (!destUri || destUri.includes('localhost')) {
    console.error('❌ Error: MONGO_URI in .env must be set to your MongoDB Atlas connection string');
    console.log('\nExample:');
    console.log('MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-devops?retryWrites=true&w=majority');
    process.exit(1);
  }

  const sourceClient = new MongoClient(sourceUri);
  const destClient = new MongoClient(destUri);

  try {
    console.log('🔄 Starting migration...\n');

    // Connect to both databases
    await sourceClient.connect();
    console.log('✅ Connected to local MongoDB');
    
    await destClient.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const sourceDb = sourceClient.db('portfolio-devops');
    const destDb = destClient.db('portfolio-devops');

    // Get all collections from source
    const collections = await sourceDb.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections to migrate:\n`);

    let totalDocuments = 0;

    // Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n📁 Migrating collection: ${collectionName}`);

      const sourceCollection = sourceDb.collection(collectionName);
      const destCollection = destDb.collection(collectionName);

      // Get all documents from source
      const documents = await sourceCollection.find({}).toArray();
      
      if (documents.length === 0) {
        console.log(`   ⚠️  Collection is empty, skipping...`);
        continue;
      }

      console.log(`   📊 Found ${documents.length} documents`);

      // Clear destination collection (optional - comment out if you want to keep existing data)
      const deleteResult = await destCollection.deleteMany({});
      if (deleteResult.deletedCount > 0) {
        console.log(`   🗑️  Cleared ${deleteResult.deletedCount} existing documents`);
      }

      // Insert documents into destination
      const insertResult = await destCollection.insertMany(documents);
      console.log(`   ✅ Migrated ${insertResult.insertedCount} documents`);
      
      totalDocuments += insertResult.insertedCount;
    }

    console.log('\n' + '='.repeat(50));
    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`\n📊 Summary:`);
    console.log(`   Collections migrated: ${collections.length}`);
    console.log(`   Total documents: ${totalDocuments}`);
    console.log('\n✅ Your data is now in MongoDB Atlas!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await sourceClient.close();
    await destClient.close();
    console.log('🔌 Disconnected from databases');
  }
}

// Run migration
console.log('🚀 MongoDB Migration Tool');
console.log('='.repeat(50));
console.log('Source: Local MongoDB (localhost:27017/portfolio-devops)');
console.log('Destination: MongoDB Atlas (from .env MONGO_URI)\n');

migrateData();
