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
import {StatusBar} from 'react-native';
import ComingSoon from './components/ComingSoon';
import Notifications from './screens/Notifications';
import AdvancePaymentLock from './screens/payment/AdvancePaymentLock';
import PaymentPanel from './screens/payment/PaymentPanel';
import FaceDetection from './screens/FaceDetection';
import FaceRecognition from './screens/payment/FaceRecognition';
import AdvanceBiometric from './screens/payment/AdvanceBiometric';

export type RootParamList = {
  Welcome: undefined;
  GetOTP: undefined;
  VerifyOTP: undefined;
  AppLock: undefined;
  Home: undefined;
  Settings: undefined;
  Notifications: undefined;
  AdvancePaymentLock: undefined;
  AdvanceBiometric: undefined;
  PaymentPanel: undefined;
  FaceDetection: undefined;
  FaceRecognition: undefined;
  ComingSoon: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();
const App = () => {
  const {isAuthenticated} = useAuthContext();
  const {isLocked} = useAppLockContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [isAuthenticated]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Navigator
        initialRouteName={
          isAuthenticated
            ? isLocked
              ? 'AppLock'
              : 'Home' // Home AdvancePaymentLock MultiangleCapture
            : 'Welcome'
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
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen
          name="AdvancePaymentLock"
          component={AdvancePaymentLock}
        />
        <Stack.Screen
          name="AdvanceBiometric"
          component={AdvanceBiometric}
        />
        <Stack.Screen
          name="PaymentPanel"
          component={PaymentPanel}
        />
        <Stack.Screen name="FaceDetection" component={FaceDetection} />
        <Stack.Screen name="FaceRecognition" component={FaceRecognition} />
        <Stack.Screen name="ComingSoon" component={ComingSoon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
