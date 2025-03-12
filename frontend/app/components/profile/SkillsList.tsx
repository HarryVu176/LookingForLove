import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SkillTag from '../common/SkillTag';
import { ITechnicalSkill } from '../../types/user';

interface SkillsListProps {
  skills: ITechnicalSkill[];
  showLevel?: boolean;
  onSkillPress?: (skill: ITechnicalSkill) => void;
  emptyText?: string;
}

const SkillsList: React.FC<SkillsListProps> = ({
  skills,
  showLevel = true,
  onSkillPress,
  emptyText = 'No skills added yet.'
}) => {
  if (skills.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <SkillTag
            key={`${skill.name}-${index}`}
            skill={skill}
            showLevel={showLevel}
            onPress={onSkillPress ? () => onSkillPress(skill) : undefined}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
});

export default React.memo(SkillsList);
