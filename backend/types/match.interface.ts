export interface IMatch {
  _id?: string;
  userId: string;
  matchedUserId: string;
  matchScore: number;
  isContactInfoExposed: boolean;
  matchDate: Date;
  userRating?: number; // 1-5 rating from survey
}

export interface IMatchDocument extends IMatch, Document {
  // Any additional methods for match documents
}
