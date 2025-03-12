import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { exposeContactInfo } from '../../store/matches/matchesSlice';
import { AppDispatch, RootState } from '../../store';
import Button from '../../components/common/Button';
import SkillsList from '../../components/profile/SkillsList';
import { MainRouteProp, MainNavigationProp } from '../../types/navigation';

interface MatchDetailScreenProps {
  route: MainRouteProp<'MatchDetail'>;
  navigation: MainNavigationProp<'MatchDetail'>;
}

const MatchDetailScreen: React.FC<MatchDetailScreenProps> = ({ route, navigation }) => {
  const { user, matchScore } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.matches);
  
  const isPaidMember = currentUser?.memberType === 'paid';
  
  const handleContactMatch = async () => {
    if (!isPaidMember) {
      Alert.alert(
        'Paid Membership Required',
        'You need to upgrade to a paid membership to contact matches.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Upgrade Now', 
            onPress: () => navigation.navigate('UpgradeMembership') 
          }
        ]
      );
      return;
    }
    
    try {
      await dispatch(exposeContactInfo(user._id!)).unwrap();
      Alert.alert(
        'Contact Information',
        `You can now contact ${user.firstName} at:\n\nEmail: ${user.contactInfo.email}\nWhatsApp: ${user.contactInfo.whatsAppId || 'Not provided'}`,
        [
          { text: 'OK' },
          { 
            text: 'Rate Match', 
            onPress: () => navigation.navigate('RateMatch', { 
              matchedUserId: user._id!, 
              matchId: user._id!
            }) 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get contact information. Please try again.');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={
            user.photoUrl
              ? { uri: user.photoUrl }
              : require('../../assets/images/default-avatar.png')
          }
          style={styles.profileImage}
        />
        
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {user.salutation} {user.firstName} {user.lastName}
          </Text>
          {user.nickname && (
            <Text style={styles.nickname}>{user.nickname}</Text>
          )}
        </View>
        
        <View style={styles.matchScoreContainer}>
          <Text style={styles.matchScoreLabel}>Match Score</Text>
          <Text style={styles.matchScore}>{matchScore}%</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <SkillsList skills={user.technicalSkillsOwned} showLevel={true} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Looking For</Text>
        <SkillsList skills={user.technicalSkillsDesired} showLevel={true} />
      </View>
      
      <View style={styles.actionContainer}>
        <Button
          title={isPaidMember ? "Get Contact Information" : "Upgrade to Contact"}
          onPress={handleContactMatch}
          loading={isLoading}
        />
        
        <Button
          title="Back to Matches"
          onPress={() => navigation.goBack()}
          type="outline"
          style={styles.backButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nickname: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  matchScoreContainer: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  matchScoreLabel: {
    color: '#ffffff',
    fontSize: 12,
  },
  matchScore: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionContainer: {
    padding: 16,
    marginBottom: 24,
  },
  backButton: {
    marginTop: 12,
  },
});

export default MatchDetailScreen;
