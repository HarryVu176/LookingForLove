import { IUser } from './user';

export interface IMatch {
  _id?: string;
  userId: string;
  matchedUserId: string;
  matchScore: number;
  isContactInfoExposed: boolean;
  matchDate: Date;
  userRating?: number;
}

export interface IMatchResult {
  user: IUser;
  matchScore: number;
}

export interface IRateMatchRequest {
  matchedUserId: string;
  rating: number;
}
