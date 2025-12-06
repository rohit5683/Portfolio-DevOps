const mongoose = require('mongoose');
require('dotenv').config();

async function populateAboutData() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio-devops';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const Profile = mongoose.model('Profile', new mongoose.Schema({}, { strict: false }));
    
    const profile = await Profile.findOne();
    if (!profile) {
      console.log('No profile found!');
      process.exit(1);
    }

    console.log('Updating profile with About page data...');
    
    profile.highlights = [
      { icon: '🏆', title: 'AWS Certified', description: 'Solutions Architect & DevOps Professional' },
      { icon: '🔧', title: 'Infrastructure as Code', description: 'Expert in Terraform & Ansible' },
      { icon: '🐳', title: 'Container Orchestration', description: 'Kubernetes & Docker specialist' },
      { icon: '📊', title: 'CI/CD Pipelines', description: 'Jenkins, GitHub Actions, GitLab CI' }
    ];

    profile.animatedStats = [
      { label: 'Years Experience', value: 5, icon: '💼' },
      { label: 'Projects Completed', value: 25, icon: '🚀' },
      { label: 'Cloud Deployments', value: 50, icon: '☁️' },
      { label: 'Certifications', value: 5, icon: '📜' }
    ];

    profile.aboutSubtitle = 'DevOps Engineer passionate about automation and cloud infrastructure';
    profile.location = 'India';
    profile.availability = {
      status: 'available',
      message: 'Open to opportunities'
    };

    await profile.save();
    console.log('✅ About page data populated successfully!');
    console.log('Highlights:', profile.highlights.length);
    console.log('Animated Stats:', profile.animatedStats.length);
    console.log('Subtitle:', profile.aboutSubtitle);
    console.log('Location:', profile.location);
    console.log('Availability:', profile.availability);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

populateAboutData();
