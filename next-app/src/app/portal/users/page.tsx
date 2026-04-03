import React from 'react';
import UserManagement from '@/page-components/admin/UserManagement';
import connectDB from '@/lib/db/mongoose';
import UserModel from '@/lib/models/User';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const users = await UserModel.find({}).sort({ email: 1 }).lean();

  return <UserManagement initialData={JSON.parse(JSON.stringify(users))} />;
}
