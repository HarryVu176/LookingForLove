import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { updateTechnicalSkills } from '../../store/profile/profileSlice';
import Button from '../../components/common/Button';
import SkillTag from '../../components/common/SkillTag';
import { AppDispatch, RootState } from '../../store';
import { MainNavigationProp } from '../../types/navigation';
import { ITechnicalSkill } from '../../types/user';

interface SkillsSelectionScreenProps {
  navigation: MainNavigationProp<'SkillsSelection'>;
}

// Sample skills list
const SAMPLE_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'React Native',
  'Node.js', 'Express', 'MongoDB', 'SQL', 'PostgreSQL',
  'Python', 'Django', 'Flask', 'Java', 'Spring',
  'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Ruby on Rails',
  'Swift', 'Kotlin', 'Flutter', 'Dart', 'Go', 'Rust',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'DevOps', 'CI/CD', 'Git', 'GitHub', 'GitLab',
  'Redux', 'GraphQL', 'REST API', 'Microservices',
  'Machine Learning', 'Artificial Intelligence', 'Data Science',
  'Blockchain', 'Smart Contracts', 'Ethereum', 'Solidity',
  'Unity', 'Game Development', 'WebGL', 'Three.js',
  'HTML', 'CSS', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop',
  'Testing', 'Jest', 'Cypress', 'Selenium', 'TDD',
];

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const SkillsSelectionScreen: React.FC<SkillsSelectionScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading } = useSelector((state: RootState) => state.profile);
  
  const [ownedSkills, setOwnedSkills] = useState<ITechnicalSkill[]>([]);
  const [desiredSkills, setDesiredSkills] = useState<ITechnicalSkill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'owned' | 'desired'>('owned');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedProficiency, setSelectedProficiency] = useState<string>('intermediate');
  
  useEffect(() => {
    if (profile) {
      setOwnedSkills(profile.technicalSkillsOwned || []);
      setDesiredSkills(profile.technicalSkillsDesired || []);
    }
  }, [profile]);
  
  const filteredSkills = SAMPLE_SKILLS.filter(skill => 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddSkill = (skillName: string) => {
    const newSkill: ITechnicalSkill = {
      name: skillName,
      proficiencyLevel: selectedProficiency as any,
    };
    
    if (activeTab === 'owned') {
      // Check if skill already exists
      if (!ownedSkills.some(skill => skill.name === skillName)) {
        setOwnedSkills([...ownedSkills, newSkill]);
      }
    } else {
      // Check if skill already exists
      if (!desiredSkills.some(skill => skill.name === skillName)) {
        setDesiredSkills([...desiredSkills, newSkill]);
      }
    }
    
    setSelectedSkill(null);
    setSearchQuery('');
  };
  
  const handleRemoveSkill = (skillToRemove: ITechnicalSkill) => {
    if (activeTab === 'owned') {
      setOwnedSkills(ownedSkills.filter(skill => skill.name !== skillToRemove.name));
    } else {
      setDesiredSkills(desiredSkills.filter(skill => skill.name !== skillToRemove.name));
    }
  };
  
  const handleSaveSkills = async () => {
    try {
      await dispatch(updateTechnicalSkills({
        skillsOwned: ownedSkills,
        skillsDesired: desiredSkills,
      })).unwrap();
      
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update skills:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'owned' && styles.activeTab]}
          onPress={() => setActiveTab('owned')}
        >
          <Text style={[styles.tabText, activeTab === 'owned' && styles.activeTabText]}>
            My Skills
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'desired' && styles.activeTab]}
          onPress={() => setActiveTab('desired')}
        >
          <Text style={[styles.tabText, activeTab === 'desired' && styles.activeTabText]}>
            Desired Skills
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for skills..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {selectedSkill && (
        <View style={styles.proficiencySelector}>
          <Text style={styles.proficiencyTitle}>
            Select proficiency level for "{selectedSkill}":
          </Text>
          <View style={styles.proficiencyOptions}>
            {PROFICIENCY_LEVELS.map(level => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.proficiencyOption,
                  selectedProficiency === level.value && styles.selectedProficiency
                ]}
                onPress={() => setSelectedProficiency(level.value)}
              >
                <Text style={[
                  styles.proficiencyText,
                  selectedProficiency === level.value && styles.selectedProficiencyText
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.proficiencyActions}>
            <Button
              title="Add Skill"
              onPress={() => handleAddSkill(selectedSkill)}
              style={styles.addButton}
            />
            <Button
              title="Cancel"
              onPress={() => setSelectedSkill(null)}
              type="outline"
            />
          </View>
        </View>
      )}
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'owned' ? 'My Technical Skills' : 'Desired Technical Skills'}
          </Text>
          <View style={styles.skillsList}>
            {activeTab === 'owned' ? (
              ownedSkills.length > 0 ? (
                ownedSkills.map((skill, index) => (
                  <View key={`${skill.name}-${index}`} style={styles.skillItemContainer}>
                    <SkillTag skill={skill} showLevel={true} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveSkill(skill)}
                    >
                      <MaterialIcons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No skills added yet.</Text>
              )
            ) : (
              desiredSkills.length > 0 ? (
                desiredSkills.map((skill, index) => (
                  <View key={`${skill.name}-${index}`} style={styles.skillItemContainer}>
                    <SkillTag skill={skill} showLevel={true} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveSkill(skill)}
                    >
                      <MaterialIcons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No desired skills added yet.</Text>
              )
            )}
          </View>
        </View>
        
        {searchQuery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <View style={styles.searchResults}>
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <TouchableOpacity
                    key={`search-${skill}-${index}`}
                    style={styles.searchResultItem}
                    onPress={() => {
                      setSelectedSkill(skill);
                    }}
                  >
                    <Text style={styles.searchResultText}>{skill}</Text>
                    <MaterialIcons name="add" size={20} color="#007bff" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No matching skills found.</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Save Skills"
          onPress={handleSaveSkills}
          loading={isLoading}
        />
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          type="outline"
          style={styles.cancelButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 4,
  },
  proficiencySelector: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  proficiencyTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  proficiencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  proficiencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedProficiency: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  proficiencyText: {
    color: '#495057',
  },
  selectedProficiencyText: {
    color: '#fff',
  },
  proficiencyActions: {
    flexDirection: 'row',
  },
  addButton: {
    flex: 1,
    marginRight: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eeeeee',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  searchResults: {
    marginBottom: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  searchResultText: {
    fontSize: 16,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#6c757d',
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  cancelButton: {
    marginTop: 8,
  },
});

export default SkillsSelectionScreen;
