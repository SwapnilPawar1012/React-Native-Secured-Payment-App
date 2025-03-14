import {
  Alert,
  Button,
  Linking,
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useAppLockContext} from '../context/AppLockContext';
import ReactNativeBiometrics from 'react-native-biometrics';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {BiometricSetup} = NativeModules; // For Android native module

const Settings = ({navigation}: {navigation: any}) => {
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
      <View style={styles.header}>
        <Text style={{fontSize: 24, fontWeight: '500'}}>Settings</Text>
      </View>
      <View style={styles.buttonsBox}>
        <Pressable
          onPress={() => navigation.navigate('ComingSoon')}
          style={styles.card}>
          <FontAwesome name="user" size={28} style={styles.icon} />
          <Text style={styles.text}>Personal info</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ComingSoon')}
          style={styles.card}>
          <FontAwesome name="bell" size={27} style={styles.icon} />
          <Text style={styles.text}>Notifications & emails</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ComingSoon')}
          style={styles.card}>
          <FontAwesome name="shield" size={28} style={styles.icon} />
          <Text style={styles.text}>Privacy & security</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ComingSoon')}
          style={styles.card}>
          <FontAwesome name="info-circle" size={28} style={styles.icon} />
          <Text style={styles.text}>About</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ComingSoon')}
          style={styles.card}>
          <FontAwesome name="question-circle" size={28} style={styles.icon} />
          <Text style={styles.text}>Help & feedback</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            handleAppLockToggle;
            navigation.navigate('ComingSoon');
          }}
          style={styles.card}>
          <FontAwesome name="lock" size={32} style={styles.icon} />
          <Text style={styles.text}>Lock app</Text>
          <Text style={styles.buttonInfo}>
            {isLocked ? 'disable' : 'enable'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ComingSoon')}
          style={styles.card}>
          <FontAwesome name="power-off" size={28} style={styles.icon} />
          <Text style={styles.text}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 40,
  },
  header: {
    height: 60,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    // borderBottomWidth: 0.2,
  },
  buttonsBox: {
    marginHorizontal: 20,
  },
  buttonInfo: {
    backgroundColor: '#6CB4EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    color: 'white',
    marginLeft: 20,
  },
  card: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    textAlign: 'center',
  },
  text: {
    fontSize: 17,
    marginLeft: 15,
  },
});

export default Settings;
