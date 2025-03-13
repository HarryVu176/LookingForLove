import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'react-native-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { updateProfile, updateProfilePhoto } from '../../store/profile/profileSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AppDispatch, RootState } from '../../store';
import { MainNavigationProp } from '../../types/navigation';
import { IUser } from '../../types/user';
import profileService from '../../services/profileService';

interface EditProfileScreenProps {
  navigation: MainNavigationProp<'EditProfile'>;
}

const validationSchema = Yup.object().shape({
  salutation: Yup.string(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  nickname: Yup.string(),
  gender: Yup.string(),
  dateOfBirth: Yup.date(),
  'contactInfo.email': Yup.string().email('Invalid email'),
  'contactInfo.whatsAppId': Yup.string(),
});

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading } = useSelector((state: RootState) => state.profile);
  const [photo, setPhoto] = useState<string | undefined>(profile?.photoUrl);

  // Test function to directly call the API
  const testDirectApiCall = async () => {
    if (!profile) return;
    
    try {
      console.log('Testing direct API call...');
      const testData = {
        firstName: profile.firstName + ' (updated)',
        lastName: profile.lastName,
        contactInfo: {
          email: profile.contactInfo?.email,
          whatsAppId: profile.contactInfo?.whatsAppId
        }
      };
      
      console.log('Test data:', JSON.stringify(testData, null, 2));
      const response = await profileService.updateProfile(testData);
      console.log('Direct API call response:', JSON.stringify(response, null, 2));
      Alert.alert('API Test', 'Direct API call successful');
    } catch (error) {
      console.error('Direct API call error:', error);
      Alert.alert('API Test Error', 'Direct API call failed');
    }
  };

  useEffect(() => {
    if (profile) {
      setPhoto(profile.photoUrl);
    }
  }, [profile]);

  const handleSelectPhoto = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to select image');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const selectedPhoto = response.assets[0].uri;
        setPhoto(selectedPhoto);
        
        // In a real app, you would upload the image to a server here
        // and then update the profile with the returned URL
        // For this MVP, we'll just use the local URI
        if (selectedPhoto) {
          dispatch(updateProfilePhoto(selectedPhoto));
        }
      }
    });
  };

  const handleUpdateProfile = async (values: any) => {
    console.log('handleUpdateProfile called with values:', JSON.stringify(values, null, 2));
    try {
      // Format the update data according to our API expectations
      const updatedProfile = {
        salutation: values.salutation,
        firstName: values.firstName,
        lastName: values.lastName,
        nickname: values.nickname,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        contactInfo: {
          email: values.contactInfo.email,
          whatsAppId: values.contactInfo.whatsAppId
        }
      };

      console.log('Sending profile update:', JSON.stringify(updatedProfile, null, 2));
      
      const result = await dispatch(updateProfile(updatedProfile)).unwrap();
      console.log('Update profile result:', JSON.stringify(result, null, 2));
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const initialValues = {
    salutation: profile.salutation || '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    nickname: profile.nickname || '',
    gender: profile.gender || '',
    dateOfBirth: profile.dateOfBirth || new Date(),
    contactInfo: {
      email: profile.contactInfo?.email || '',
      whatsAppId: profile.contactInfo?.whatsAppId || '',
    },
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.photoContainer}>
          <Image
            source={
              photo
                ? { uri: photo }
                : require('../../assets/images/default-avatar.png')
            }
            style={styles.profilePhoto}
          />
          <TouchableOpacity
            style={styles.photoEditButton}
            onPress={handleSelectPhoto}
          >
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log('Formik onSubmit called with values:', JSON.stringify(values, null, 2));
            handleUpdateProfile(values);
          }}
          enableReinitialize
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View style={styles.formContainer}>
              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Input
                    label="Salutation"
                    value={values.salutation}
                    onChangeText={handleChange('salutation')}
                    onBlur={handleBlur('salutation')}
                    placeholder="e.g., Mr., Ms., Dr."
                    error={touched.salutation ? errors.salutation : undefined}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Input
                    label="First Name"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    placeholder="Your first name"
                    error={touched.firstName ? errors.firstName : undefined}
                  />
                </View>

                <View style={styles.formColumn}>
                  <Input
                    label="Last Name"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    placeholder="Your last name"
                    error={touched.lastName ? errors.lastName : undefined}
                  />
                </View>
              </View>

              <Input
                label="Nickname (Optional)"
                value={values.nickname}
                onChangeText={handleChange('nickname')}
                onBlur={handleBlur('nickname')}
                placeholder="How you'd like to be called"
                error={touched.nickname ? errors.nickname : undefined}
              />

              <Input
                label="Email"
                value={values.contactInfo.email}
                onChangeText={(text) => setFieldValue('contactInfo.email', text)}
                onBlur={handleBlur('contactInfo.email')}
                placeholder="Your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={
                  touched.contactInfo?.email
                    ? errors.contactInfo?.email
                    : undefined
                }
              />

              <Input
                label="WhatsApp ID (Optional)"
                value={values.contactInfo.whatsAppId}
                onChangeText={(text) => setFieldValue('contactInfo.whatsAppId', text)}
                onBlur={handleBlur('contactInfo.whatsAppId')}
                placeholder="Your WhatsApp number"
                keyboardType="phone-pad"
                error={
                  touched.contactInfo?.whatsAppId
                    ? errors.contactInfo?.whatsAppId
                    : undefined
                }
              />

              <Input
                label="Gender"
                value={values.gender}
                onChangeText={handleChange('gender')}
                onBlur={handleBlur('gender')}
                placeholder="Select your gender"
                error={touched.gender ? errors.gender : undefined}
              />

              <View style={styles.buttonContainer}>
                <Button
                  title="Save Changes"
                  onPress={() => {
                    console.log('Save Changes button pressed');
                    handleSubmit();
                  }}
                  loading={isLoading}
                />
                {/* <Button
                  title="Direct Submit"
                  onPress={() => {
                    console.log('Direct Submit button pressed');
                    if (profile) {
                      handleUpdateProfile({
                        salutation: profile.salutation,
                        firstName: profile.firstName + ' (updated)',
                        lastName: profile.lastName,
                        nickname: profile.nickname,
                        gender: profile.gender,
                        dateOfBirth: profile.dateOfBirth,
                        contactInfo: {
                          email: profile.contactInfo?.email,
                          whatsAppId: profile.contactInfo?.whatsAppId
                        }
                      });
                    }
                  }}
                  type="primary"
                  style={{ marginTop: 10 }}
                /> */}
                <Button
                  title="Cancel"
                  onPress={() => navigation.goBack()}
                  type="outline"
                  style={styles.cancelButton}
                />
                {/* <Button
                  title="Test Direct API Call"
                  onPress={testDirectApiCall}
                  type="secondary"
                  style={{ marginTop: 10 }}
                /> */}
              </View>

              <View style={styles.technicalSkillsContainer}>
                <Text style={styles.technicalSkillsTitle}>
                  Technical Skills
                </Text>
                <Text style={styles.technicalSkillsDescription}>
                  To edit your technical skills, please use the Skills Selection screen.
                </Text>
                <Button
                  title="Edit Technical Skills"
                  onPress={() => navigation.navigate('SkillsSelection')}
                  type="outline"
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: '30%',
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  formContainer: {},
  formRow: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  formColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
  technicalSkillsContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  technicalSkillsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  technicalSkillsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
});

export default EditProfileScreen;
