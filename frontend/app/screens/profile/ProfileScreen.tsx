import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { getProfile } from '../../store/profile/profileSlice';
import Button from '../../components/common/Button';
import SkillsList from '../../components/profile/SkillsList';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { AppDispatch, RootState } from '../../store';
import { MainNavigationProp } from '../../types/navigation';

interface ProfileScreenProps {
  navigation: MainNavigationProp<'ProfileTabs'>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, isLoading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleEditSkills = () => {
    navigation.navigate('SkillsSelection');
  };

  const handleUpgradeMembership = () => {
    navigation.navigate('UpgradeMembership');
  };

  if (isLoading && !profile) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={() => dispatch(getProfile())}
          type="outline"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profile?.photoUrl
                ? { uri: profile.photoUrl }
                : require('../../assets/images/default-avatar.png')
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editPhotoButton}
            onPress={handleEditProfile}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>
          {profile?.salutation} {profile?.firstName} {profile?.lastName}
        </Text>
        {profile?.nickname && (
          <Text style={styles.nickname}>{profile.nickname}</Text>
        )}

        {profile?.memberType === 'free' && (
          <View style={styles.membershipBadge}>
            <Text style={styles.membershipText}>Free Member</Text>
          </View>
        )}

        {profile?.memberType === 'paid' && (
          <View style={[styles.membershipBadge, styles.paidMembershipBadge]}>
            <Text style={styles.membershipText}>Paid Member</Text>
          </View>
        )}

        {profile?.memberType === 'product' && (
          <View style={[styles.membershipBadge, styles.productMembershipBadge]}>
            <Text style={styles.membershipText}>Product Manager</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            type="outline"
            style={styles.button}
          />
          {profile?.memberType === 'free' && (
            <Button
              title="Upgrade to Paid"
              onPress={handleUpgradeMembership}
              style={styles.button}
            />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Technical Skills</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditSkills}
          >
            <MaterialIcons name="edit" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
        <SkillsList
          skills={profile?.technicalSkillsOwned || []}
          emptyText="Add your technical skills to help others find you."
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Skills I'm Looking For</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditSkills}
          >
            <MaterialIcons name="edit" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
        <SkillsList
          skills={profile?.technicalSkillsDesired || []}
          emptyText="Add the technical skills you're looking for in a match."
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        <View style={styles.contactItem}>
          <MaterialIcons name="email" size={20} color="#666" />
          <Text style={styles.contactText}>
            {profile?.contactInfo?.email || 'No email provided'}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <MaterialIcons name="chat" size={20} color="#666" />
          <Text style={styles.contactText}>
            {profile?.contactInfo?.whatsAppId || 'No WhatsApp ID provided'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nickname: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  membershipBadge: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  paidMembershipBadge: {
    backgroundColor: '#28a745',
  },
  productMembershipBadge: {
    backgroundColor: '#9370db',
  },
  membershipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
