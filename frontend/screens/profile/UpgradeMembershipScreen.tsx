import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { upgradeMembership } from '../../store/auth/authSlice';
import Button from '../../components/common/Button';
import { AppDispatch, RootState } from '../../store';
import { MainNavigationProp } from '../../types/navigation';

interface UpgradeMembershipScreenProps {
  navigation: MainNavigationProp<'UpgradeMembership'>;
}

const UpgradeMembershipScreen: React.FC<UpgradeMembershipScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
  const handleUpgrade = async () => {
    // Simulate payment processing
    setIsPaymentProcessing(true);
    
    // Wait for 2 seconds to simulate payment processing
    setTimeout(async () => {
      setIsPaymentProcessing(false);
      
      try {
        await dispatch(upgradeMembership()).unwrap();
        
        Alert.alert(
          'Upgrade Successful',
          'Congratulations! You are now a paid member and can contact your matches.',
          [
            {
              text: 'Find Matches',
              onPress: () => navigation.navigate('ProfileTabs'),
            },
          ]
        );
      } catch (error) {
        Alert.alert(
          'Upgrade Failed',
          'There was an error processing your payment. Please try again later.'
        );
      }
    }, 2000);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upgrade to Paid Membership</Text>
        <Text style={styles.subtitle}>
          Connect with your technical matches and find your perfect IT partner
        </Text>
      </View>
      
      <Image
        source={require('../../assets/images/upgrade-banner.png')}
        style={styles.bannerImage}
        resizeMode="contain"
      />
      
      <View style={styles.pricingContainer}>
        <Text style={styles.price}>$500</Text>
        <Text style={styles.pricingDescription}>One-time fee</Text>
      </View>
      
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Membership Benefits</Text>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>🔍 View Contact Information</Text>
          <Text style={styles.featureDescription}>
            See email and WhatsApp details for your matches
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>💬 Direct Communication</Text>
          <Text style={styles.featureDescription}>
            Connect directly with potential matches
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>❤️ Unlimited Matches</Text>
          <Text style={styles.featureDescription}>
            No limits on how many people you can contact
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>🔒 Lifetime Access</Text>
          <Text style={styles.featureDescription}>
            One-time payment for permanent access
          </Text>
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        <Button
          title={isPaymentProcessing ? "Processing Payment..." : "Upgrade Now - $500"}
          onPress={handleUpgrade}
          loading={isLoading || isPaymentProcessing}
          style={styles.upgradeButton}
        />
        
        <Button
          title="Maybe Later"
          onPress={() => navigation.goBack()}
          type="outline"
          style={styles.laterButton}
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  pricingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#28a745',
  },
  pricingDescription: {
    fontSize: 16,
    color: '#666',
  },
  featuresContainer: {
    padding: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    padding: 20,
    marginBottom: 30,
  },
  upgradeButton: {
    marginBottom: 12,
  },
  laterButton: {},
});

export default UpgradeMembershipScreen;
