import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title,
  description,
  keywords = [],
  image = "/profile-transparent.png",
  url = window.location.href,
  type = "website",
}: SEOProps) => {
  const siteTitle = "Rohit Vishwakarma | DevOps Engineer";
  const fullTitle = title === "Home" ? siteTitle : `${title} | ${siteTitle}`;
  const defaultKeywords = [
    "DevOps Engineer",
    "Cloud Architect",
    "AWS",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "CI/CD",
    "Rohit Vishwakarma",
    "Portfolio",
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(
    ", ",
  );

  // Structured Data for Person
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohit Vishwakarma",
    url: "https://rvdevops.com",
    image: "https://rohit-devops.com/profile.jpg",
    jobTitle: "DevOps Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Artiqulus Technologies",
    },
    sameAs: [
      "https://www.linkedin.com/in/rohitvishwakarma568347",
      "https://github.com/rohit5683",
    ],
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
    </Helmet>
  );
};

export default SEO;
