import mongoose, { Schema } from 'mongoose';
import { IMatchDocument } from '../types/match.interface';

const MatchSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  matchedUserId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  matchScore: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100 
  },
  isContactInfoExposed: { 
    type: Boolean, 
    default: false 
  },
  matchDate: { 
    type: Date, 
    default: Date.now 
  },
  userRating: { 
    type: Number,
    min: 1,
    max: 5
  }
});

// Create indexes for efficient querying
MatchSchema.index({ userId: 1, matchedUserId: 1 }, { unique: true });
MatchSchema.index({ matchScore: -1 });
MatchSchema.index({ matchDate: -1 });

const MatchModel = mongoose.model<IMatchDocument>('Match', MatchSchema);

export default MatchModel;
