import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Welcome from './screens/Welcome';
import OTPAuth from './screens/OTPAuth';

export type RootParamList = {
  Welcome: undefined;
  OTPAuth: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="OTPAuth" component={OTPAuth} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
