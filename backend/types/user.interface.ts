export interface ITechnicalSkill {
  name: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface IContactInfo {
  email: string;
  whatsAppId?: string;
}

export interface IUserBase {
  salutation: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  photoUrl?: string;
  contactInfo: IContactInfo;
}

export interface IUser extends IUserBase {
  _id?: string;
  memberType: 'free' | 'paid' | 'product';
  technicalSkillsOwned: ITechnicalSkill[];
  technicalSkillsDesired: ITechnicalSkill[];
  createdAt: Date;
  updatedAt: Date;
  subscriptionDate?: Date;
}

export interface IUserDocument extends IUser, Document {
  // Any additional methods for user documents
}
