import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { IMatchResult } from '../../types/match';
import SkillTag from '../../components/common/SkillTag';

interface MatchCardProps {
  match: IMatchResult;
  onPress: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
  const { user, matchScore } = match;
  
  // Show only first 3 skills with a +X more indicator if there are more
  const visibleSkills = user.technicalSkillsOwned.slice(0, 3);
  const remainingSkillsCount = user.technicalSkillsOwned.length - visibleSkills.length;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreValue}>{matchScore}%</Text>
        <Text style={styles.scoreLabel}>Match</Text>
      </View>
      
      <Image
        source={
          user.photoUrl
            ? { uri: user.photoUrl }
            : require('../../assets/images/default-avatar.png')
        }
        style={styles.avatar}
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.name}>
          {user.salutation} {user.firstName} {user.lastName}
        </Text>
        
        <View style={styles.skillsContainer}>
          {visibleSkills.map((skill, index) => (
            <SkillTag 
              key={`${skill.name}-${index}`} 
              skill={skill} 
              showLevel={false} 
            />
          ))}
          
          {remainingSkillsCount > 0 && (
            <View style={styles.moreSkillsContainer}>
              <Text style={styles.moreSkillsText}>+{remainingSkillsCount} more</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  scoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scoreValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moreSkillsContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  moreSkillsText: {
    fontSize: 12,
    color: '#666',
  },
});

export default React.memo(MatchCard);
