import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/auth/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { AppDispatch, RootState } from '../../store';
import { AuthNavigationProp } from '../../types/navigation';
import { IRegisterRequest } from '../../types/user';

interface RegisterScreenProps {
  navigation: AuthNavigationProp<'Register'>;
}

const validationSchema = Yup.object().shape({
  salutation: Yup.string().required('Salutation is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  contactInfo: Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    whatsAppId: Yup.string()
  })
});

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

const salutationOptions = [
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Ms.', value: 'Ms.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Dr.', value: 'Dr.' },
  { label: 'Prof.', value: 'Prof.' },
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedSalutation, setSelectedSalutation] = useState('');

  const handleRegister = async (values: IRegisterRequest) => {
    try {
      // Format the registration data according to our API expectations
      const userData = {
        ...values,
      };
      
      await dispatch(register(userData)).unwrap();
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err) {
      // Error is already handled by the Redux action
      console.error('Registration failed:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join our tech-focused dating community
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Formik
          initialValues={{
            salutation: '',
            firstName: '',
            lastName: '',
            nickname: '',
            dateOfBirth: new Date(),
            gender: 'male' as 'male' | 'female' | 'non-binary' | 'prefer-not-to-say',
            contactInfo: {
              email: '',
              whatsAppId: ''
            }
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
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
                    error={touched.salutation && errors.salutation}
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
                    error={touched.firstName && errors.firstName}
                  />
                </View>

                <View style={styles.formColumn}>
                  <Input
                    label="Last Name"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    placeholder="Your last name"
                    error={touched.lastName && errors.lastName}
                  />
                </View>
              </View>

              <Input
                label="Nickname (Optional)"
                value={values.nickname}
                onChangeText={handleChange('nickname')}
                onBlur={handleBlur('nickname')}
                placeholder="How you'd like to be called"
              />

              <Input
                label="Email"
                value={values.contactInfo.email}
                onChangeText={(text) => setFieldValue('contactInfo.email', text)}
                onBlur={() => handleBlur('contactInfo.email')}
                placeholder="Your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.contactInfo?.email && errors.contactInfo?.email}
              />

              <Input
                label="WhatsApp ID (Optional)"
                value={values.contactInfo.whatsAppId}
                onChangeText={(text) => setFieldValue('contactInfo.whatsAppId', text)}
                onBlur={() => handleBlur('contactInfo.whatsAppId')}
                placeholder="Your WhatsApp number"
                keyboardType="phone-pad"
              />

              <Input
                label="Gender"
                value={values.gender}
                onChangeText={handleChange('gender')}
                onBlur={handleBlur('gender')}
                placeholder="Select your gender"
                error={touched.gender && errors.gender}
              />

              <Button
                title="Register"
                onPress={handleSubmit}
                loading={isLoading}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            type="outline"
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#721c24',
  },
  formContainer: {
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  formColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  loginContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    marginBottom: 8,
    color: '#666',
  },
  loginButton: {
    width: '100%',
  },
});

export default RegisterScreen;
