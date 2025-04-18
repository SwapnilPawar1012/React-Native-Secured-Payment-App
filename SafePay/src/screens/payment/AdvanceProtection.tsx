import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useAdvanceProtectionContext} from '../../context/AdvanceProtectionContext';
import ReactNativeBiometrics from 'react-native-biometrics';

const AdvanceProtection = ({navigation}: {navigation: any}) => {
  const {isAdvanceProtection} = useAdvanceProtectionContext();

  const checkAdvanceBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });

    const {available} = await rnBiometrics.isSensorAvailable();

    if (available) {
      await rnBiometrics
        .simplePrompt({
          promptMessage: 'Authenticate to make Payment',
        })
        .then(result => {
          if (result.success) {
            console.log('Advance Biometric Payment Authentication Successful');
            navigation.replace('PaymentPanel');
          }
        })
        .catch(() =>
          console.log('Advance Biometric Payment Authentication Failed!'),
        );
    } else {
      Alert.alert('Advance Biometric Payment Authentication Not Available.');
    }
  };

  const checkAppAdvanceBiometric = async () => {
    Alert.alert("App's Advance Payment Authentication", 'Coming Soon.');
  };

  useEffect(() => {
    console.log('useEffect: ', isAdvanceProtection);
    if (isAdvanceProtection === 'SProtected') {
      checkAdvanceBiometric();
    } else if (isAdvanceProtection === 'AProtected') {
      checkAppAdvanceBiometric();
    } else {
      navigation.replace('PaymentPanel');
    }
  }, []);

  return (
    <View style={styles.container}>
      {isAdvanceProtection ? null : (
        <>
          <Text>
            This Payment is Protected using Advance Payment Protection feature.
          </Text>
          <Text>Please authenticate to continue...</Text>
          <Button
            title="Retry Authentication"
            onPress={checkAdvanceBiometric}
          />
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

export default AdvanceProtection;
