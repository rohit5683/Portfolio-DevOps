import React from 'react';
import Home from '@/page-components/public/Home';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import SchemaOrg from '@/components/common/SchemaOrg';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | DevOps Engineer Portfolio`,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage }],
    type: 'website',
  },
};

export default function Page() {
  return (
    <>
      <SchemaOrg type="Person" />
      <Home />
    </>
  );
}
