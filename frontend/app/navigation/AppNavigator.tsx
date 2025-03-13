import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/common/LoadingScreen';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import authService from '../services/authService';
import { EventRegister } from 'react-native-event-listeners';
import { logout } from '../store/auth/authSlice';

const AppNavigator: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [token]);
  
  useEffect(() => {
    // Listen for token expiration events
    const tokenExpiredListener = EventRegister.addEventListener('tokenExpired', () => {
      console.log('Token expired event received, logging out user');
      dispatch(logout() as any);
      setIsAuthenticated(false);
    });
    
    return () => {
      // Clean up the listener when component unmounts
      EventRegister.removeEventListener(tokenExpiredListener as string);
    };
  }, [dispatch]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default AppNavigator;
