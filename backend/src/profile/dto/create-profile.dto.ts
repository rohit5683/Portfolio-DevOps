export class CreateProfileDto {
  name: string;
  role: string;
  tagline: string;
  headline: string;
  about: string;
  photoUrl: string;
  contact: {
    email: string;
    phone?: string;
    github: string;
    linkedin?: string;
    twitter?: string;
  };
  roles: string[];
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  animatedStats: Array<{
    label: string;
    value: number;
    icon: string;
  }>;
  aboutSubtitle: string;
  location: string;
  availability: {
    status: string;
    message: string;
  };
  settings: {
    theme: string;
    prefersReducedMotion: boolean;
  };
}
