import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const connection = app.get<Connection>(getConnectionToken());

  console.log('\n🔍 Database Connection Debug Info:');
  console.log('================================');
  console.log(`Host: ${connection.host}`);
  console.log(`Database Name: ${connection.name}`);
  console.log(`Collections:`);

  if (!connection.db) {
    console.log('❌ Connection.db is undefined');
    await app.close();
    return;
  }

  const collections = await connection.db.listCollections().toArray();
  for (const col of collections) {
    const count = await connection.db.collection(col.name).countDocuments();
    console.log(` - ${col.name}: ${count} documents`);
  }

  console.log('================================\n');
  await app.close();
}

bootstrap();
