import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

const OTPAuth = () => {
  const [otpStatus, setOTPStatus] = useState<boolean>(false);
  const [contactNumber, setContactNumber] = useState('');

  const HandleGetOTP = () => {};

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/SafePay_logo.png')}
        style={styles.logo}
      />
      <>
        {!otpStatus ? (
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
                maxLength={10}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity>
              <View style={styles.buttonBox}>
                <Text style={styles.buttonText}>GET OTP</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputBox}>
            <Text style={styles.text}>
              Enter the OTP sent to{' '}
              <Text style={[styles.boldText, {fontSize: 20}]}>
                +91{contactNumber}
              </Text>
            </Text>
            <View>
              <Text style={[styles.label]}>Enter OTP</Text>
              <TextInput
                style={[styles.input, {letterSpacing: 18}]}
                maxLength={6}
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity>
              <View style={styles.buttonBox}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
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
  buttonBox: {
    backgroundColor: '#64b5f6',
    padding: 16,
    marginTop: 70,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OTPAuth;
