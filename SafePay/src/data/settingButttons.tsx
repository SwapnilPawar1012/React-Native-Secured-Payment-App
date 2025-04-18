import {Alert, Linking, NativeModules, Platform} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import RNFS from 'react-native-fs';
import {useAuthContext} from '../context/AuthContext';
import {useAppLockContext} from '../context/AppLockContext';
import {useState} from 'react';

const {isLocked, lock, unlock} = useAppLockContext();
const {logout} = useAuthContext();

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
    console.log('unlocked');
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

const deleteAllPhotos = async () => {
  try {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    const facePhotos = files.filter(file => file.name.startsWith('face_'));
    const newfacePhotos = files.filter(file => file.name.startsWith('safepay_biometric/face_'));

    for (const file of facePhotos) {
      await RNFS.unlink(file.path);
      console.log(`Deleted: ${file.path}`);
    }
    for (const file of newfacePhotos) {
      await RNFS.unlink(file.path);
      console.log(`Deleted: ${file.path}`);
    }
    console.log('All face photos deleted.');
  } catch (err) {
    console.error('Failed to delete photos', err);
  }
};

const HandleLogout = (navigation: any) => {
  logout();
  deleteAllPhotos();
  navigation.replace('GetOTP');
};

export const settingButtons = (navigation: any) => [
  {
    id: 1,
    type: 'icon',
    name: 'user',
    title: 'Personal info',
    press: () => navigation.navigate('ComingSoon'),
  },
  {
    id: 2,
    type: 'icon',
    name: 'bell',
    title: 'Notifications & emails',
    press: () => navigation.navigate('Notifications'),
  },
  {
    id: 3,
    type: 'image',
    name: require('../assets/advance-lock.png'),
    title: 'Advance Payment Protection',
    press: () => navigation.navigate('AdvancePaymentLock'),
  },
  {
    id: 4,
    type: 'icon',
    name: 'shield',
    title: 'Privacy & security',
    press: () => navigation.navigate('ComingSoon'),
  },
  {
    id: 5,
    type: 'icon',
    name: 'info-circle',
    title: 'About',
    press: () => navigation.navigate('ComingSoon'),
  },
  {
    id: 6,
    type: 'icon',
    name: 'question-circle',
    title: 'Help & feedback',
    press: () => navigation.navigate('ComingSoon'),
  },
  {
    id: 7,
    type: 'icon',
    name: 'lock',
    title: 'Lock app',
    press: () => {
      handleAppLockToggle();
    },
  },
  {
    id: 8,
    type: 'icon',
    name: 'power-off',
    title: 'Sign out',
    press: () => {
      HandleLogout(navigation);
    },
  },
];
