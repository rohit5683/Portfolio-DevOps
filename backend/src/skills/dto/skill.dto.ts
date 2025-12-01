export class CreateSkillDto {
  name: string;
  iconUrl?: string;
  category?: string;
  proficiency?: number;
  yearsOfExperience?: number;
  featured?: boolean;
}

export class UpdateSkillDto {
  name?: string;
  iconUrl?: string;
  category?: string;
  proficiency?: number;
  yearsOfExperience?: number;
  featured?: boolean;
}
