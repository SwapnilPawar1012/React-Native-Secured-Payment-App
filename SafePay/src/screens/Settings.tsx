import {
  Alert,
  Button,
  Linking,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useAppLockContext} from '../context/AppLockContext';
import ReactNativeBiometrics from 'react-native-biometrics';

const {BiometricSetup} = NativeModules; // For Android native module

const Settings = () => {
  const {isLocked, lock, unlock} = useAppLockContext();

  const setupBiometrics = async () => {
    if (Platform.OS === 'android') {
      Linking.openSettings(); // Opens the general settings screen

      try {
        NativeModules.BiometricSetup.openBiometricEnroll();
      } catch (error) {
        console.error('Error opening biometric setup:', error);
      }
    } else if (Platform.OS === 'ios') {
      Alert.alert(
        'Set Up Biometrics',
        'Go to Settings > Face ID & Passcode to enable Face ID.',
        [{text: 'OK'}],
      );
    }
  };

  const handleAppLockToggle = async () => {
    if (isLocked) {
      unlock();
    } else {
      console.log('Checking biometics availability.');
      const rnBiometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
      });

      const {available} = await rnBiometrics.isSensorAvailable();

      if (available) {
        lock();
      } else {
        console.log('Biometrics not available. Redirecting to setup.');
        setupBiometrics(); // Directly guide user to biometric setup
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <View>
        <Text>App Lock</Text>
        <Button
          title={isLocked ? 'Disable' : 'Enable'}
          onPress={handleAppLockToggle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Settings;
