import React from 'react';
import { SITE_CONFIG } from '@/constants/metadata';

interface SchemaOrgProps {
  type?: 'Person' | 'WebSite' | 'ProfessionalService';
  data?: any;
}

const SchemaOrg: React.FC<SchemaOrgProps> = ({ type = 'Person', data = {} }) => {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  // Default Person Schema if no specific data provided for Person type
  const personSchema = type === 'Person' ? {
    name: SITE_CONFIG.name,
    jobTitle: [
      'DevOps Engineer',
      'Cloud Architect',
      'DevSecOps Specialist',
      'DevOps Freelancer',
      'Azure & AWS Cloud Expert'
    ],
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "India"
    },
    sameAs: [
      SITE_CONFIG.links.github,
      SITE_CONFIG.links.linkedin,
    ],
    knowsAbout: SITE_CONFIG.keywords,
    ...data
  } : null;

  const finalSchema = type === 'Person' ? personSchema : baseSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
    />
  );
};

export default SchemaOrg;
