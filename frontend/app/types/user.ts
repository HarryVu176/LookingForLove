export interface ITechnicalSkill {
  name: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface IContactInfo {
  email: string;
  whatsAppId?: string;
}

export interface IUser {
  _id?: string;
  salutation: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  photoUrl?: string;
  contactInfo: IContactInfo;
  memberType: 'free' | 'paid' | 'product';
  technicalSkillsOwned: ITechnicalSkill[];
  technicalSkillsDesired: ITechnicalSkill[];
  subscriptionDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserProfile extends Omit<IUser, 'password'> {}

export interface IRegisterRequest {
  salutation: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  contactInfo: IContactInfo;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: IUserProfile;
}
