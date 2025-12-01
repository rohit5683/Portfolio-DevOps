import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProfileService } from './profile/profile.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const profileService = app.get(ProfileService);

  try {
    const profile = await profileService.findOne();
    if (!profile) {
      console.log('No profile found!');
      process.exit(1);
    }

    console.log('Updating profile with About page data...');

    const updatedProfile = await profileService.update(
      (profile as any)._id.toString(),
      {
        highlights: [
          {
            icon: '🏆',
            title: 'AWS Certified',
            description: 'Certified Cloud Practitioner',
          },
          {
            icon: '💻',
            title: 'Infrastructure as Code',
            description: 'Terraform & Ansible Expert',
          },
          {
            icon: '🐳',
            title: 'Container Orchestration',
            description: 'Kubernetes & Docker Swarm',
          },
          {
            icon: '🚀',
            title: 'CI/CD Pipelines',
            description: 'Jenkins, GitLab CI, GitHub Actions',
          },
        ],
        animatedStats: [
          { label: 'Years Experience', value: 5, icon: '⏳' },
          { label: 'Projects Delivered', value: 25, icon: '✅' },
          { label: 'Deployments', value: 50, icon: '🚀' },
          { label: 'Certifications', value: 5, icon: '📜' },
        ],
        aboutSubtitle:
          'Passionate DevOps Engineer dedicated to automating infrastructure and optimizing deployment workflows.',
        location: 'India',
        availability: {
          status: 'available',
          message: 'Open to opportunities',
        },
      },
    );

    console.log('✅ About page data populated successfully!');
    if (updatedProfile) {
      console.log('Highlights:', updatedProfile.highlights?.length || 0);
      console.log('Animated Stats:', updatedProfile.animatedStats?.length || 0);
      console.log('Subtitle:', updatedProfile.aboutSubtitle);
      console.log('Location:', updatedProfile.location);
      console.log('Availability:', updatedProfile.availability);
    }

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
