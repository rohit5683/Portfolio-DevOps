import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = 'admin@example.com'; // Replace with actual admin email if different
  const user = await usersService.findOne(email);

  if (user) {
    await usersService.update((user as any)._id, { mfaEnabled: true });
    console.log(`MFA enabled for user: ${email}`);
  } else {
    console.log(`User not found: ${email}`);
  }

  await app.close();
}
bootstrap();
