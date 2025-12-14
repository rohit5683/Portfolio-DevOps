import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProfileService } from './profile/profile.service';
import { ProjectsService } from './projects/projects.service';
import { ExperienceService } from './experience/experience.service';
import { EducationService } from './education/education.service';
import { SkillsService } from './skills/skills.service';
import { CertificationsService } from './certifications/certifications.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const profileService = app.get(ProfileService);
  const projectsService = app.get(ProjectsService);
  const experienceService = app.get(ExperienceService);
  const educationService = app.get(EducationService);
  const skillsService = app.get(SkillsService);
  const certificationsService = app.get(CertificationsService);

  // Seed User
  const email = 'admin@example.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 12);

  let user = await usersService.findOne(email);
  if (!user) {
    user = await usersService.create({
      email,
      passwordHash,
      role: 'admin',
      mfaEnabled: true,
    } as any);
    console.log('User created');
  } else {
    console.log('User already exists');
  }

  // Seed Profile - Delete existing and create new
  const existingProfile = await profileService.findOne();
  if (existingProfile) {
    // Delete the old profile to recreate with new schema
    await (existingProfile as any).deleteOne();
    console.log('Deleted old profile');
  }

  await profileService.create({
    ownerId: (user as any)._id,
    name: 'Rohit Vishwakarma',
    role: 'DevOps Engineer',
    tagline: 'Building scalable infrastructure and automating deployments',
    headline: 'AWS Certified Cloud Practitioner / AWS DevOps Engineer',
    about:
      'DevOps Engineer with a passion for cloud infrastructure and automation.',
    photoUrl: '',
    contact: {
      email: 'rohit.vishwakarma@example.com',
      phone: '+91 XXX XXX XXXX',
      github: 'https://github.com/rohit-vishwakarma',
      linkedin: 'https://linkedin.com/in/rohit-vishwakarma',
      twitter: 'https://twitter.com/rohitvishwa',
    },
    roles: [
      'DevOps Engineer',
      'Cloud Architect',
      'Infrastructure Automation Expert',
      'CI/CD Specialist',
    ],
    stats: [
      { label: 'Years Experience', value: '3+', icon: '💼' },
      { label: 'Projects Completed', value: '25+', icon: '🚀' },
      { label: 'Cloud Deployments', value: '50+', icon: '☁️' },
      { label: 'Certifications', value: '5+', icon: '📜' },
    ],
    highlights: [
      {
        icon: '🏆',
        title: 'AWS Certified',
        description: 'Solutions Architect & DevOps Professional',
      },
      {
        icon: '🔧',
        title: 'Infrastructure as Code',
        description: 'Expert in Terraform & Ansible',
      },
      {
        icon: '🐳',
        title: 'Container Orchestration',
        description: 'Kubernetes & Docker specialist',
      },
      {
        icon: '📊',
        title: 'CI/CD Pipelines',
        description: 'Jenkins, GitHub Actions, GitLab CI',
      },
    ],
    animatedStats: [
      { label: 'Years Experience', value: 5, icon: '💼' },
      { label: 'Projects Completed', value: 25, icon: '🚀' },
      { label: 'Cloud Deployments', value: 50, icon: '☁️' },
      { label: 'Certifications', value: 5, icon: '📜' },
    ],
    aboutSubtitle:
      'DevOps Engineer passionate about automation and cloud infrastructure',
    location: 'India',
    availability: {
      status: 'available',
      message: 'Open to opportunities',
    },
    settings: {
      theme: 'dark',
      prefersReducedMotion: false,
    },
  });
  console.log('Profile created with all skills!');

  // Seed Projects
  const projects = [
    {
      title: '3-Tier AWS Architecture',
      description:
        'Designed and deployed a highly available 3-tier architecture on AWS using Terraform. Implemented auto-scaling, load balancing, and multi-AZ deployment for high availability.',
      techStack: ['AWS', 'Terraform', 'EC2', 'RDS', 'ALB', 'VPC'],
      images: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
      ],
      link: 'https://example.com/aws-architecture',
      githubLink: 'https://github.com/yourusername/aws-3tier-architecture',
      status: 'completed',
      featured: true,
      category: 'cloud',
      completionDate: new Date('2024-03-15'),
    },
    {
      title: 'Dockerized Application',
      description:
        'Containerized a legacy Node.js application and deployed it to AWS ECS with CI/CD pipeline. Reduced deployment time by 70% and improved scalability.',
      techStack: ['Docker', 'ECS', 'AWS', 'Node.js', 'GitHub Actions'],
      images: [
        'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
        'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
      ],
      link: 'https://example.com/docker-app',
      githubLink: 'https://github.com/yourusername/dockerized-app',
      status: 'completed',
      featured: false,
      category: 'devops',
      completionDate: new Date('2024-01-20'),
    },
    {
      title: 'CI/CD Pipeline',
      description:
        'Built a comprehensive CI/CD pipeline using Jenkins and GitHub Actions with automated testing, security scanning, and deployment to multiple environments.',
      techStack: ['Jenkins', 'GitHub Actions', 'SonarQube', 'Trivy', 'Docker'],
      images: [
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      ],
      link: 'https://example.com/cicd-pipeline',
      githubLink: 'https://github.com/yourusername/cicd-pipeline',
      status: 'in-progress',
      featured: true,
      category: 'devops',
      completionDate: new Date('2024-02-10'),
    },
  ];

  // Delete old projects and create new ones with updated schema
  const existingProjects = await projectsService.findAll();
  if (existingProjects.length > 0) {
    for (const project of existingProjects) {
      await projectsService.remove((project as any)._id);
    }
    console.log('Deleted old projects');
  }

  for (const project of projects) {
    await projectsService.create(project);
  }
  console.log('Projects seeded with new schema!');

  // Seed Experience
  const experiences = [
    {
      title: 'DevOps Engineer',
      company: 'Artiqulus Technologies Private Limited',
      companyLogo: '',
      location: 'Pune, Maharashtra, India',
      startDate: new Date('2025-06-01'),
      endDate: null,
      techStack: [
        'EC2',
        'S3',
        'IAM',
        'RDS',
        'VPC',
        'ELB',
        'EBS',
        'Route53',
        'ACM',
        'CodePipeline',
        'CloudWatch',
        'CloudFront',
        'ASG',
        'ECS',
        'EKS',
        'Docker',
        'Ansible',
        'Kubernetes',
        'Bash Scripting',
        'Terraform',
        'Jenkins',
        'Prometheus & Grafana',
        'Argo CD',
        'Nexus',
        'SonarQube',
        'Helm',
        'Maven',
        'OWASP',
        'Trivy',
      ],
      achievements: [
        'Automated CI/CD pipelines using Jenkins, Maven, Nexus, and SonarQube, reducing manual deployment time by 60%',
        'Deployed and managed over 10 containerized applications using Docker and Kubernetes, improving deployment consistency and scalability.',
      ],
      challenges: [
        'Optimizing resource utilization in EKS clusters to reduce costs.',
        'Migrating legacy pipelines to a modern, container-based approach.',
      ],
      description:
        'Hands-on experience in CI/CD, cloud deployment, and infrastructure automation, contributing to the delivery of 5+ real-world DevOps projects.',
      roleDescription:
        'As a DevOps Engineer at Artiqulus, I am responsible for designing and implementing scalable cloud infrastructure on AWS. I work closely with development teams to streamline the CI/CD process, ensuring rapid and reliable software delivery. My role involves automating manual tasks, monitoring system health, and ensuring the security and compliance of our production environments.',
    },
  ];

  // Delete old experience entries and create new ones
  const existingExperience = await experienceService.findAll();
  if (existingExperience.length > 0) {
    for (const exp of existingExperience) {
      await experienceService.remove((exp as any)._id);
    }
    console.log('Deleted old experience entries');
  }

  for (const exp of experiences) {
    await experienceService.create(exp);
  }
  console.log('Experience seeded with new schema!');

  // Seed Education
  const education = [
    {
      schoolCollege: 'ABC University',
      boardUniversity: 'State University Board',
      degree: 'Bachelor of Technology',
      fieldOfStudy: 'Computer Science',
      startDate: '2018',
      endDate: '2022',
      grade: '92',
      gradeType: 'Percentage',
      description:
        'Focused on software engineering, data structures, and cloud computing.',
      documents: [],
      level: 'undergraduate',
      status: 'completed',
      featured: true,
    },
    {
      schoolCollege: 'XYZ High School',
      boardUniversity: 'Central Board of Secondary Education',
      degree: 'Higher Secondary Certificate',
      fieldOfStudy: 'Science',
      startDate: '2016',
      endDate: '2018',
      grade: '3.8',
      gradeType: 'GPA',
      description: 'Specialized in Mathematics, Physics, and Computer Science.',
      documents: [],
      level: 'high-school',
      status: 'completed',
      featured: false,
    },
  ];

  // Delete old education entries and create new ones with updated schema
  const existingEducation = await educationService.findAll();
  if (existingEducation.length > 0) {
    for (const edu of existingEducation) {
      await educationService.delete((edu as any)._id);
    }
    console.log('Deleted old education entries');
  }
  for (const edu of education) {
    await educationService.create(edu);
  }
  console.log('Education seeded');

  // Seed Skills - Migrate from profile skills
  const profileSkills = [
    {
      name: 'JavaScript ES6',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      category: 'programming',
      proficiency: 90,
      yearsOfExperience: 5,
      featured: false,
    },
    {
      name: 'Python',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      category: 'programming',
      proficiency: 85,
      yearsOfExperience: 4,
      featured: true,
    },
    {
      name: 'Node.js',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      category: 'programming',
      proficiency: 88,
      yearsOfExperience: 5,
      featured: false,
    },
    {
      name: 'Bash Scripting',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
      category: 'devops',
      proficiency: 80,
      yearsOfExperience: 4,
      featured: false,
    },
    {
      name: 'MongoDB',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      category: 'database',
      proficiency: 85,
      yearsOfExperience: 4,
      featured: false,
    },
    {
      name: 'MySQL',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      category: 'database',
      proficiency: 80,
      yearsOfExperience: 3,
      featured: false,
    },
    {
      name: 'PostgreSQL',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      category: 'database',
      proficiency: 75,
      yearsOfExperience: 2,
      featured: false,
    },
    {
      name: 'Docker',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      category: 'devops',
      proficiency: 90,
      yearsOfExperience: 5,
      featured: true,
    },
    {
      name: 'Kubernetes',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      category: 'devops',
      proficiency: 85,
      yearsOfExperience: 3,
      featured: true,
    },
    {
      name: 'AWS',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
      category: 'cloud',
      proficiency: 92,
      yearsOfExperience: 5,
      featured: true,
    },
    {
      name: 'Terraform',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
      category: 'devops',
      proficiency: 88,
      yearsOfExperience: 4,
      featured: true,
    },
    {
      name: 'Jenkins',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
      category: 'devops',
      proficiency: 85,
      yearsOfExperience: 4,
      featured: true,
    },
    {
      name: 'Git',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      category: 'tools',
      proficiency: 95,
      yearsOfExperience: 6,
      featured: false,
    },
    {
      name: 'GitHub',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      category: 'tools',
      proficiency: 90,
      yearsOfExperience: 6,
      featured: false,
    },
    {
      name: 'React',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      category: 'programming',
      proficiency: 85,
      yearsOfExperience: 4,
      featured: false,
    },
  ];

  // Delete old skills and create new ones
  const existingSkills = await skillsService.findAll();
  if (existingSkills.length > 0) {
    for (const skill of existingSkills) {
      await skillsService.remove((skill as any)._id);
    }
    console.log('Deleted old skills');
  }

  for (const skill of profileSkills) {
    await skillsService.create(skill);
  }
  console.log('Skills seeded');

  // Seed Certifications
  const certifications = [
    {
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: new Date('2024-01-15'),
      credentialUrl: 'https://aws.amazon.com/verification',
      fileUrl:
        'https://via.placeholder.com/800x600/1a1a2e/ffffff?text=AWS+Certified+Solutions+Architect',
      description:
        'Validated advanced technical skills and experience in designing distributed applications and systems on the AWS platform.',
      type: 'Certification',
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'The Linux Foundation',
      date: new Date('2023-11-20'),
      credentialUrl: 'https://www.cncf.io/certification/cka/',
      fileUrl:
        'https://via.placeholder.com/800x600/16213e/ffffff?text=Kubernetes+Administrator+CKA',
      description:
        'Demonstrated competence in hands-on command-line manipulation of Kubernetes clusters.',
      type: 'Certification',
    },
    {
      name: 'DevOps Intern',
      issuer: 'TechCorp Solutions',
      date: new Date('2023-05-01'),
      credentialUrl: '',
      fileUrl:
        'https://via.placeholder.com/800x600/0f3460/ffffff?text=DevOps+Internship+Certificate',
      description:
        'Completed a 6-month internship focusing on CI/CD pipelines, Docker, and cloud infrastructure.',
      type: 'Internship',
    },
    {
      name: 'HashiCorp Certified: Terraform Associate',
      issuer: 'HashiCorp',
      date: new Date('2023-08-10'),
      credentialUrl:
        'https://www.hashicorp.com/certification/terraform-associate',
      fileUrl:
        'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=800&q=80', // Placeholder image
      description:
        'Verified basic infrastructure automation skills and knowledge of Terraform Cloud and Enterprise.',
    },
  ];

  // Delete old certifications and create new ones
  const existingCertifications = await certificationsService.findAll();
  if (existingCertifications.length > 0) {
    for (const cert of existingCertifications) {
      await certificationsService.remove((cert as any)._id);
    }
    console.log('Deleted old certifications');
  }

  for (const cert of certifications) {
    await certificationsService.create(cert);
  }
  console.log('Certifications seeded');

  await app.close();
}

bootstrap();
