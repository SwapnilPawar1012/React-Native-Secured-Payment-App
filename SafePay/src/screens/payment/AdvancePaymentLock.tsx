import {
  Alert,
  Image,
  Linking,
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useAdvanceProtectionContext} from '../../context/AdvanceProtectionContext';
import ReactNativeBiometrics from 'react-native-biometrics';

const AdvancePaymentLock = ({navigation}: {navigation: any}) => {
  const {
    isAdvanceProtection,
    enableAdvanceProtection,
    disableAdvanceProtection,
  } = useAdvanceProtectionContext();

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

  const ProtectionOfSystem = async () => {
    console.log("System's Protection: ", isAdvanceProtection);
    if (
      isAdvanceProtection === 'AProtected' ||
      isAdvanceProtection === 'SProtected'
    ) {
      Alert.alert(
        'Disable Advance Payment Protection', // Title
        'Are you sure you want to proceed?', // Message
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Action canceled');
              return;
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              console.log('Action confirmed');
              disableAdvanceProtection();
            },
          },
        ],
      );
    } else {
      console.log('Checking biometics availability.');
      const rnBiometrics = new ReactNativeBiometrics({
        allowDeviceCredentials: true,
      });

      const {available} = await rnBiometrics.isSensorAvailable();
      if (available) {
        Alert.alert(
          'Enable Advance Payment Protection', // Title
          'Are you sure you want to proceed?', // Message
          [
            {
              text: 'Cancel',
              onPress: () => {
                console.log('Action canceled');
                return;
              },
              style: 'cancel',
            },
            {
              text: 'Confirm',
              onPress: () => {
                console.log('Action confirmed');
                enableAdvanceProtection('SProtected');
              },
            },
          ],
        );
      } else {
        console.log('Biometrics not available. Redirecting to setup.');
        Alert.alert(
          'Set Up Biometrics',
          'Your device do not have Biometrics Setup, Please setup biometrics in your device settings.',
          [
            {
              text: 'Cancel',
              onPress: () => {
                return;
              },
              style: 'cancel',
            },
            {
              text: 'Ok',
              onPress: () => {
                setupBiometrics(); // Directly guide user to biometric setup
              },
            },
          ],
        );
      }
    }
  };

  const ProtectionOfApp = () => {
    // Alert.alert("App's Protection", 'Coming Soon!');
    console.log("System's Protection: ", isAdvanceProtection);
    if (
      isAdvanceProtection === 'AProtected' ||
      isAdvanceProtection === 'SProtected'
    ) {
      Alert.alert(
        'Disable Advance Payment Protection', // Title
        'Are you sure you want to proceed?', // Message
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Action canceled');
              return;
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              console.log('Action confirmed');
              disableAdvanceProtection();
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Enable Advance Payment Protection', // Title
        'Are you sure you want to proceed?', // Message
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Action canceled');
              return;
            },
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              console.log('Action confirmed');
              navigation.navigate('MultiangleCapture');
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/advance-lock-panel.jpg')}
        style={styles.image}
      />
      <Text style={styles.heading}>Advance Payment Protection</Text>
      <View>
        {isAdvanceProtection === 'SProtected' ? (
          <Pressable onPress={ProtectionOfSystem}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Disable System's method</Text>
            </View>
          </Pressable>
        ) : isAdvanceProtection === 'AProtected' ? (
          <Pressable onPress={ProtectionOfApp}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>SafePay App's method</Text>
            </View>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={ProtectionOfSystem}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>System's method</Text>
              </View>
            </Pressable>
            <Pressable onPress={ProtectionOfApp}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>SafePay App's method</Text>
              </View>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 300,
  },
  heading: {
    fontSize: 24,
    marginVertical: 50,
    fontFamily: 'roboto',
  },
  button: {
    backgroundColor: '#318CE7',
    marginVertical: 15,
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default AdvancePaymentLock;
