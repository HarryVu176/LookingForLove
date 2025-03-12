export interface IStatistics {
  totalFreeMembers: number;
  totalPaidMembers: number;
  totalMatches: number;
  totalContactInfoExposed: number;
  lastUpdated: Date;
}

export interface IMatchQualityStatistics {
  averageRating: number;
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  totalRatings: number;
}
