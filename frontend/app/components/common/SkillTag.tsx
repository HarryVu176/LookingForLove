import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ITechnicalSkill } from '../../types/user';

interface SkillTagProps {
  skill: ITechnicalSkill;
  onPress?: () => void;
  showLevel?: boolean;
  selected?: boolean;
}

const SkillTag: React.FC<SkillTagProps> = ({
  skill,
  onPress,
  showLevel = true,
  selected = false,
}) => {
  const proficiencyColor = useMemo(() => {
    switch (skill.proficiencyLevel) {
      case 'beginner':
        return '#28a745';
      case 'intermediate':
        return '#17a2b8';
      case 'advanced':
        return '#fd7e14';
      case 'expert':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }, [skill.proficiencyLevel]);

  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[
        styles.container,
        { borderColor: proficiencyColor },
        selected && { backgroundColor: `${proficiencyColor}20` }
      ]}
      onPress={onPress}
    >
      <Text style={styles.name}>{skill.name}</Text>
      {showLevel && (
        <View style={[styles.levelBadge, { backgroundColor: proficiencyColor }]}>
          <Text style={styles.levelText}>
            {skill.proficiencyLevel.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    marginRight: 4,
  },
  levelBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default React.memo(SkillTag);
