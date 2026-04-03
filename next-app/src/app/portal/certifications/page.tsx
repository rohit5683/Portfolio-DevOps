import React from 'react';
import CertificationsEdit from '@/page-components/admin/CertificationsEdit';
import connectDB from '@/lib/db/mongoose';
import CertificationModel from '@/lib/models/Certification';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const certifications = await CertificationModel.find({}).sort({ date: -1 }).lean();

  return <CertificationsEdit initialData={JSON.parse(JSON.stringify(certifications))} />;
}
