import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Welcome from './screens/Welcome';
import OTPAuth from './screens/GetOTP';
import GetOTP from './screens/GetOTP';
import VerifyOTP from './screens/VerifyOTP';
import {useAuthContext} from './context/AuthContext';
import Loading from './components/Loading';

export type RootParamList = {
  Welcome: undefined;
  GetOTP: undefined;
  VerifyOTP: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();
const App = () => {
  const {isAuthenticated} = useAuthContext();

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
        initialRouteName={isAuthenticated ? 'Home' : 'Welcome'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="GetOTP" component={GetOTP} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
