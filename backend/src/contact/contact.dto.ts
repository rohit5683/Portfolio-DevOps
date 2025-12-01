import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ContactDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  subject: string;

  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters' })
  message: string;
}
