import mongoose, { Schema } from 'mongoose';
import { IStatisticsDocument } from '../types/statistics.interface';

const StatisticsSchema: Schema = new Schema({
  totalFreeMembers: { 
    type: Number, 
    required: true,
    default: 0 
  },
  totalPaidMembers: { 
    type: Number, 
    required: true,
    default: 0 
  },
  totalMatches: { 
    type: Number, 
    required: true,
    default: 0 
  },
  totalContactInfoExposed: { 
    type: Number, 
    required: true,
    default: 0 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

const StatisticsModel = mongoose.model<IStatisticsDocument>('Statistics', StatisticsSchema);

export default StatisticsModel;
