import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IUser } from './user';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main Stack
export type MainStackParamList = {
  ProfileTabs: undefined;
  EditProfile: undefined;
  SkillsSelection: undefined;
  MatchDetail: { matchId: string; user: IUser; matchScore: number };
  RateMatch: { matchId: string; matchedUserId: string };
  UpgradeMembership: undefined;
};

// Tab Navigator
export type TabParamList = {
  Profile: undefined;
  Matches: undefined;
  Statistics: undefined;
};

// Navigation Props
export type AuthNavigationProp<T extends keyof AuthStackParamList> = 
  StackNavigationProp<AuthStackParamList, T>;

export type MainNavigationProp<T extends keyof MainStackParamList> = 
  StackNavigationProp<MainStackParamList, T>;

export type AuthRouteProp<T extends keyof AuthStackParamList> = 
  RouteProp<AuthStackParamList, T>;

export type MainRouteProp<T extends keyof MainStackParamList> = 
  RouteProp<MainStackParamList, T>;
