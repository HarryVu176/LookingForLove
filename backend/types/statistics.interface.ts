export interface IStatistics {
  _id?: string;
  totalFreeMembers: number;
  totalPaidMembers: number;
  totalMatches: number;
  totalContactInfoExposed: number;
  lastUpdated: Date;
}

export interface IStatisticsDocument extends IStatistics, Document {
  // Any additional methods for statistics documents
}
