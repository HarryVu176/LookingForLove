import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getStatistics, getMatchQualityStatistics, updateStatistics } from '../../store/statistics/statisticsSlice';
import Button from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { AppDispatch, RootState } from '../../store';

const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { statistics, matchQualityStatistics, isLoading, error } = useSelector(
    (state: RootState) => state.statistics
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(getStatistics());
    dispatch(getMatchQualityStatistics());
  };

  const handleRefreshData = () => {
    dispatch(updateStatistics());
    loadData();
  };

  if (isLoading && !statistics) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={loadData} type="outline" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Statistics Dashboard</Text>
        <Text style={styles.subtitle}>
          Overview of LookingForLove user statistics
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>User Statistics</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {statistics?.totalFreeMembers || 0}
            </Text>
            <Text style={styles.statLabel}>Free Members</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {statistics?.totalPaidMembers || 0}
            </Text>
            <Text style={styles.statLabel}>Paid Members</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {(statistics?.totalFreeMembers || 0) +
                (statistics?.totalPaidMembers || 0)}
            </Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {statistics?.totalMatches || 0}
            </Text>
            <Text style={styles.statLabel}>Total Matches</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Match Statistics</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {statistics?.totalContactInfoExposed || 0}
            </Text>
            <Text style={styles.statLabel}>Contacts Exposed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {matchQualityStatistics?.totalRatings || 0}
            </Text>
            <Text style={styles.statLabel}>Matches Rated</Text>
          </View>
        </View>

        {matchQualityStatistics && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Match Quality Ratings</Text>
            <Text style={styles.ratingAverage}>
              Average: {matchQualityStatistics.averageRating.toFixed(1)} / 5
            </Text>

            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <View key={rating} style={styles.ratingBarContainer}>
                  <Text style={styles.ratingBarLabel}>{rating} stars</Text>
                  <View style={styles.ratingBarBackground}>
                    <View
                      style={[
                        styles.ratingBarFill,
                        {
                          width: `${
                            matchQualityStatistics.totalRatings > 0
                              ? (matchQualityStatistics[rating.toString() as keyof typeof matchQualityStatistics] /
                                  matchQualityStatistics.totalRatings) *
                                100
                              : 0
                          }%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingBarCount}>
                    {matchQualityStatistics[rating.toString() as keyof typeof matchQualityStatistics]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionContainer}>
        <Button
          title="Refresh Statistics"
          onPress={handleRefreshData}
          loading={isLoading}
        />
        <Text style={styles.lastUpdated}>
          Last updated:{' '}
          {statistics?.lastUpdated
            ? new Date(statistics.lastUpdated).toLocaleString()
            : 'Never'}
        </Text>
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ratingContainer: {
    marginTop: 8,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingAverage: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#28a745',
  },
  ratingBars: {
    marginTop: 8,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBarLabel: {
    width: 70,
    fontSize: 14,
  },
  ratingBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#ffc107',
    borderRadius: 6,
  },
  ratingBarCount: {
    width: 30,
    fontSize: 14,
    textAlign: 'right',
  },
  actionContainer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  lastUpdated: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
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

export default DashboardScreen;
