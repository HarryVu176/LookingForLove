import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SkillsSelectionScreen from '../screens/profile/SkillsSelectionScreen';
import MatchListScreen from '../screens/matches/MatchListScreen';
import MatchDetailScreen from '../screens/matches/MatchDetailScreen';
import RateMatchScreen from '../screens/matches/RateMatchScreen';
import DashboardScreen from '../screens/statistics/DashboardScreen';
import UpgradeMembershipScreen from '../screens/profile/UpgradeMembershipScreen';
import { TabParamList, MainStackParamList } from '../types/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

function ProfileTabs() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isProductManager = user?.memberType === 'product';
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" color={color} size={size} />
          ),
        }}
      />
      {isProductManager && (
        <Tab.Screen
          name="Statistics"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileTabs"
        component={ProfileTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="SkillsSelection"
        component={SkillsSelectionScreen}
        options={{ title: 'Technical Skills' }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ title: 'Match Details' }}
      />
      <Stack.Screen
        name="RateMatch"
        component={RateMatchScreen}
        options={{ title: 'Rate This Match' }}
      />
      <Stack.Screen
        name="UpgradeMembership"
        component={UpgradeMembershipScreen}
        options={{ title: 'Upgrade Membership' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
