import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Welcome from './screens/Welcome';
import GetOTP from './screens/GetOTP';
import VerifyOTP from './screens/VerifyOTP';
import {useAuthContext} from './context/AuthContext';
import Loading from './components/Loading';
import Settings from './screens/Settings';
import {useAppLockContext} from './context/AppLockContext';
import AppLock from './screens/AppLock';

export type RootParamList = {
  Welcome: undefined;
  GetOTP: undefined;
  VerifyOTP: undefined;
  AppLock: undefined;
  Home: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();
const App = () => {
  const {isAuthenticated} = useAuthContext();
  const {isLocked} = useAppLockContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          isAuthenticated ? (isLocked ? 'AppLock' : 'Home') : 'Welcome'
        }
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="GetOTP" component={GetOTP} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
        <Stack.Screen name="AppLock" component={AppLock} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
