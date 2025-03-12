import UserModel from '../../models/user.model';
import MatchModel from '../../models/match.model';
import StatisticsModel from '../../models/statistics.model';
import { IUser, ITechnicalSkill } from '../../types/user.interface';
import { IMatch } from '../../types/match.interface';

interface IMatchResult {
  user: IUser;
  matchScore: number;
}

export class MatchService {
  /**
   * Calculate match score between two users based on technical skills
   */
  private calculateMatchScore(user: IUser, potentialMatch: IUser): number {
    let score = 0;
    const maxScore = 100;
    
    // Compare skills user has that potential match desires
    user.technicalSkillsOwned.forEach(userSkill => {
      potentialMatch.technicalSkillsDesired.forEach(desiredSkill => {
        if (userSkill.name.toLowerCase() === desiredSkill.name.toLowerCase()) {
          // Add points for each matching skill
          score += 10;
          
          // Bonus points for higher proficiency
          const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
          const userProfIndex = proficiencyLevels.indexOf(userSkill.proficiencyLevel);
          const desiredProfIndex = proficiencyLevels.indexOf(desiredSkill.proficiencyLevel);
          
          if (userProfIndex >= desiredProfIndex) {
            score += 5; // Bonus for meeting or exceeding desired proficiency
          }
        }
      });
    });
    
    // Compare skills potential match has that user desires
    potentialMatch.technicalSkillsOwned.forEach(matchSkill => {
      user.technicalSkillsDesired.forEach(desiredSkill => {
        if (matchSkill.name.toLowerCase() === desiredSkill.name.toLowerCase()) {
          // Add points for each matching skill
          score += 10;
          
          // Bonus points for higher proficiency
          const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
          const matchProfIndex = proficiencyLevels.indexOf(matchSkill.proficiencyLevel);
          const desiredProfIndex = proficiencyLevels.indexOf(desiredSkill.proficiencyLevel);
          
          if (matchProfIndex >= desiredProfIndex) {
            score += 5; // Bonus for meeting or exceeding desired proficiency
          }
        }
      });
    });
    
    // Normalize score to be between 0 and 100
    return Math.min(score, maxScore);
  }

  /**
   * Find potential matches for a user
   */
  public async findMatches(userId: string): Promise<IMatchResult[]> {
    // Get current user
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Find all potential matches
    const potentialMatches = await UserModel.find({
      _id: { $ne: userId } // Exclude current user
    });
    
    // Calculate match scores
    const matchResults: IMatchResult[] = [];
    
    for (const potentialMatch of potentialMatches) {
      const matchScore = this.calculateMatchScore(user, potentialMatch);
      
      matchResults.push({
        user: potentialMatch.toObject(),
        matchScore
      });
    }
    
    // Sort by match score (highest first)
    return matchResults.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Expose contact information for a match
   */
  public async exposeContactInfo(userId: string, matchedUserId: string): Promise<IMatch> {
    // Check if match exists
    let match = await MatchModel.findOne({
      userId,
      matchedUserId
    });
    
    if (!match) {
      // Get user and matched user
      const [user, matchedUser] = await Promise.all([
        UserModel.findById(userId),
        UserModel.findById(matchedUserId)
      ]);
      
      if (!user || !matchedUser) {
        throw new Error('User or matched user not found');
      }
      
      // Calculate match score
      const matchScore = this.calculateMatchScore(user, matchedUser);
      
      // Create new match
      match = new MatchModel({
        userId,
        matchedUserId,
        matchScore,
        isContactInfoExposed: true,
        matchDate: new Date()
      });
    } else {
      // Update existing match
      match.isContactInfoExposed = true;
    }
    
    await match.save();
    
    // Update statistics
    await StatisticsModel.updateOne(
      {},
      { $inc: { totalContactInfoExposed: 1 } }
    );
    
    return match.toObject();
  }

  /**
   * Rate a match (1-5 survey)
   */
  public async rateMatch(userId: string, matchedUserId: string, rating: number): Promise<IMatch> {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    // Find and update match
    const match = await MatchModel.findOneAndUpdate(
      {
        userId,
        matchedUserId
      },
      {
        userRating: rating
      },
      { new: true }
    );
    
    if (!match) {
      throw new Error('Match not found');
    }
    
    return match.toObject();
  }
}

export default new MatchService();
