import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMatches } from '../../store/matches/matchesSlice';
import { AppDispatch, RootState } from '../../store';
import MatchCard from '../../components/matches/MatchCard';
import Button from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import EmptyState from '../../components/common/EmptyState';
import { IMatchResult } from '../../types/match';
import { MainNavigationProp } from '../../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

interface MatchListScreenProps {
  navigation: MainNavigationProp<'ProfileTabs'>;
}

const MatchListScreen: React.FC<MatchListScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { matches, isLoading, error } = useSelector((state: RootState) => state.matches);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const fetchMatches = useCallback(() => {
    dispatch(getMatches());
  }, [dispatch]);
  
  // Refresh matches when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMatches();
    }, [fetchMatches])
  );
  
  const handleViewMatch = (match: IMatchResult) => {
    navigation.navigate('MatchDetail', {
      matchId: match.user._id!,
      user: match.user,
      matchScore: match.matchScore
    });
  };
  
  const handleRefresh = () => {
    fetchMatches();
  };
  
  if (isLoading && matches.length === 0) {
    return <LoadingIndicator />;
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={fetchMatches} type="outline" />
      </View>
    );
  }
  
  const isPaidMember = user?.memberType === 'paid';
  
  return (
    <View style={styles.container}>
      {!isPaidMember && (
        <View style={styles.upgradeContainer}>
          <Text style={styles.upgradeText}>
            Upgrade to a paid membership to contact your matches!
          </Text>
          <Button
            title="Upgrade Now"
            onPress={() => navigation.navigate('UpgradeMembership')}
          />
        </View>
      )}
      
      <FlatList
        data={matches}
        keyExtractor={(item) => item.user._id!}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => handleViewMatch(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={matches.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No Matches Found"
            description="Complete your profile and add your technical skills to find matches!"
            actionText="Update Skills"
            onAction={() => navigation.navigate('SkillsSelection')}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  upgradeContainer: {
    backgroundColor: '#e9f7fe',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cce5ff',
  },
  upgradeText: {
    marginBottom: 8,
    fontSize: 14,
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

export default MatchListScreen;
