import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {useAppContext} from '../context/AppContext';
import {useAuthContext} from '../context/AuthContext';

const VerifyOTP = ({navigation}: {navigation: any}) => {
  const {login} = useAuthContext();
  const {phoneNumberGlobal} = useAppContext();

  const [error, setError] = useState<string>('');
  const [code, setCode] = useState('');

  // Get OTP use 10.0.2.2 for Android Emulator and IPv4 Address for physical device
  const HandleResendOTP = async () => {
    if (phoneNumberGlobal.length !== 10) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid mobile number',
      );
      setError('Invalid Mobile Number! Please enter a valid mobile number.');
      return;
    }
    try {
      // http://10.0.2.2:8000/send-otp
      const response = await axios.post('http:/192.168.51.241:8000/api/send-otp/', {
        phoneNumber: phoneNumberGlobal,
      });
      console.log(response);
      if (response.data.success === true) {
        console.log('OTP sent successfully');
      } else {
        console.log('Error in sending OTP');
      }
    } catch (error) {
      console.log('Error in sending OTP', error);
      setError('Something went wrong! Please try again later.');
    }
  };

  // Verify OTP use 10.0.2.2 for Android Emulator and IPv4 Address for physical device
  const HandleVerifyOTP = async () => {
    if (phoneNumberGlobal.length !== 10) {
      setError('Invalid Mobile Number! Please try again.');
      navigation.navigate('GetOTP'); // , { userPhone: phoneNumber }
      return;
    }
    if (code.length !== 6) {
      setError('Invalid OTP! Please try again.');
      return;
    }

    try {
      // http://10.0.2.2:8000/verify-otp
      const response = await axios.post('http://192.168.51.241:8000/api/verify-otp/', {
        phoneNumber: phoneNumberGlobal,
        code,
      });

      console.log(response);
      if (response.data.success === true) {
        login(phoneNumberGlobal);
        setTimeout(() => {
          navigation.navigate('Home');
        }, 500);
      } else {
        setError('Invalid OTP! Please try again.');
      }
    } catch (error) {
      console.log('Error in verifying OTP', error);
      setError('Something is wrong! Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/SafePay_logo.png')}
        style={styles.logo}
      />
      <>
        <View style={styles.inputBox}>
          <Text style={styles.text}>
            Enter the OTP sent to{' '}
            <Text style={styles.boldText}>+91{phoneNumberGlobal}</Text>
          </Text>
          <View>
            <Text style={[styles.label]}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              focusable={true}
              onFocus={() => setError('')}
              maxLength={6}
              keyboardType="number-pad"
            />
          </View>
          <View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={styles.text}>Don't receive the OTP? </Text>
            <Pressable onPress={HandleResendOTP}>
              <View>
                <Text style={styles.link}>Resend OTP</Text>
              </View>
            </Pressable>
          </View>
          <Pressable
            onPress={HandleVerifyOTP}
            style={({pressed}) => [
              {backgroundColor: pressed ? '#90caf9' : '#64b5f6', padding: 10},
              styles.buttonBox,
            ]}>
            <View>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </View>
          </Pressable>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 180,
    height: 80,
    borderRadius: 28,
    alignSelf: 'center',
    marginVertical: 100,
  },
  inputBox: {
    marginHorizontal: 30,
  },
  text: {
    fontSize: 17,
    color: '#333',
    marginVertical: 38,
    textAlign: 'center',
  },
  boldText: {
    color: '#000',
    fontWeight: '600',
  },
  label: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 24,
    paddingVertical: 10,
    fontWeight: '600',
    letterSpacing: 18,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
  link: {
    color: '#64b5f6',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonBox: {
    backgroundColor: '#64b5f6',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VerifyOTP;
