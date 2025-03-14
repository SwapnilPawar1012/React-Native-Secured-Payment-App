import {Button, StyleSheet, Text, View} from 'react-native';
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
          promptMessage: 'Authenticate using biometrics', // Authenticate to unlock the app
        })
        .then(result => {
          if (result.success) {
            console.log('Biometric authentication successful');
            setLockedAuth(true);
            navigation.navigate('Home');
          }
        })
        .catch(() => console.log('Biometric Authentication failed!'));
    } else {
      console.log('Biometric authentication not available.');
    }
  };

  useEffect(() => {
    checkBiometricAuth();
  }, []);

  return (
    <View style={styles.container}>
      {lockedAuth ? (
        <Text>Welcome!</Text>
      ) : (
        <>
          <Text>Please authenticate to continue...</Text>
          <Button title="Retry Authentication" onPress={checkBiometricAuth} />
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
