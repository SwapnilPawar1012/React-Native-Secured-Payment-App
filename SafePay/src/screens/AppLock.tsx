import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import {useAppLockContext} from '../context/AppLockContext';

const AppLock = ({navigation}: {navigation: any}) => {
  const {lockedAuth, setLockedAuth} = useAppLockContext();

  const checkBiometricAuth = async () => {
    // Check if biometric authentication is available
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true, // fallback: If you want to allow device credentials (PIN, Pattern, Password) in case biometrics fails
    });

    const {available} = await rnBiometrics.isSensorAvailable();

    if (available) {
      // Authenticate using biometrics
      await rnBiometrics
        .simplePrompt({
          promptMessage: 'Unlock to use SafePay', // Authenticate to unlock the app
        })
        .then(result => {
          if (result.success) {
            console.log('Biometric authentication successful');
            setLockedAuth(true);
            navigation.replace('Home');
          }
        })
        .catch(() => console.log('Biometric Authentication failed!'));
    } else {
      Alert.alert('Biometric Authentication Not Available.');
    }
  };

  useEffect(() => {
    checkBiometricAuth();
  }, []);

  return (
    <View style={styles.container}>
      {lockedAuth ? null : (
        <>
          <Text>Please authenticate to continue...</Text>
          <Button title="Unlock" onPress={checkBiometricAuth} />
        </>
      )}
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

export default AppLock;
