import {
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

const GetOTP = ({navigation}: {navigation: any}) => {
  const {phoneNumberGlobal, setPhoneNumberGlobal} = useAppContext();

  console.log('AppContext value:', phoneNumberGlobal);

  const [error, setError] = useState<string>('');

  // Get OTP
  const HandleGetOTP = async () => {
    console.log('phone global: ', phoneNumberGlobal);
    if (!phoneNumberGlobal || phoneNumberGlobal.length !== 10) {
      setError('Invalid Mobile Number! Please enter a valid mobile number.');
      return;
    }

    try {
      // Use 10.0.2.2 Instead of localhost (For Android Emulator)
      const response = await axios.post('http://10.0.2.2:5000/send-otp', {
        phoneNumber: phoneNumberGlobal,
      });
      console.log(response);
      if (response.data.success === true) {
        navigation.navigate('VerifyOTP');
      } else {
        setError('Something went wrong! Please try again later.');
      }
    } catch (error) {
      console.log('Error in sending OTP', error);
      setError('Error: Something went wrong! Please try again later.');
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
            We will send you an{' '}
            <Text style={styles.boldText}>One Time Password</Text> on this
            mobile number
          </Text>
          <View>
            <Text style={[styles.label]}>Enter Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumberGlobal || ''}
              onChangeText={setPhoneNumberGlobal}
              focusable={true}
              onFocus={() => setError('')}
              maxLength={10}
              keyboardType="phone-pad"
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={{marginTop: 70}}>
            <Pressable
              onPress={HandleGetOTP}
              style={({pressed}) => [
                {backgroundColor: pressed ? '#90caf9' : '#64b5f6', padding: 10},
                styles.buttonBox,
              ]}>
              <View>
                <Text style={styles.buttonText}>GET OTP</Text>
              </View>
            </Pressable>
          </View>
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
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 24,
    paddingVertical: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    position: 'absolute',
    bottom: 80,
  },
  buttonBox: {
    // backgroundColor: '#64b5f6',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GetOTP;
