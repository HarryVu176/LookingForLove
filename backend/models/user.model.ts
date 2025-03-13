import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from '../types/user.interface';

const TechnicalSkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  proficiencyLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true 
  },
  yearsOfExperience: { type: Number }
});

const ContactInfoSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  whatsAppId: { type: String }
});

const UserSchema: Schema = new Schema({
  salutation: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: { type: String },
  dateOfBirth: { type: Date, required: true },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
    required: true 
  },
  photoUrl: { type: String },
  contactInfo: ContactInfoSchema,
  memberType: { 
    type: String, 
    enum: ['free', 'paid', 'product'],
    default: 'free',
    required: true 
  },
  technicalSkillsOwned: [TechnicalSkillSchema],
  technicalSkillsDesired: [TechnicalSkillSchema],
  subscriptionDate: { type: Date }
}, {
  timestamps: true
});

// Create indexes for efficient querying
UserSchema.index({ firstName: 1, lastName: 1 });
UserSchema.index({ memberType: 1 });
UserSchema.index({ 'technicalSkillsOwned.name': 1 });
UserSchema.index({ 'technicalSkillsDesired.name': 1 });

const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
