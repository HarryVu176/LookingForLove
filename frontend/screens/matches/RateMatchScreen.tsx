import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { rateMatch } from '../../store/matches/matchesSlice';
import Button from '../../components/common/Button';
import { AppDispatch, RootState } from '../../store';
import { MainRouteProp, MainNavigationProp } from '../../types/navigation';

interface RateMatchScreenProps {
  route: MainRouteProp<'RateMatch'>;
  navigation: MainNavigationProp<'RateMatch'>;
}

const RateMatchScreen: React.FC<RateMatchScreenProps> = ({ route, navigation }) => {
  const { matchedUserId } = route.params;
  const [rating, setRating] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.matches);

  const handleRate = async () => {
    if (rating === 0) {
      return;
    }

    try {
      await dispatch(rateMatch({ matchedUserId, rating })).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to rate match:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Match</Text>
      <Text style={styles.description}>
        How satisfied are you with this match? Your feedback helps us improve our matching algorithm.
      </Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => setRating(value)}
            style={styles.starButton}
          >
            <FontAwesome
              name={value <= rating ? 'star' : 'star-o'}
              size={40}
              color={value <= rating ? '#ffc107' : '#ced4da'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.ratingText}>
        {rating === 0
          ? 'Tap a star to rate'
          : rating === 1
          ? 'Poor match'
          : rating === 2
          ? 'Fair match'
          : rating === 3
          ? 'Good match'
          : rating === 4
          ? 'Very good match'
          : 'Excellent match!'}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Submit Rating"
          onPress={handleRate}
          disabled={rating === 0}
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
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 32,
    color: '#495057',
  },
  buttonContainer: {
    width: '100%',
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default RateMatchScreen;
