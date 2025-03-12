import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const Welcome = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/SafePay_logo.png')}
        style={styles.logo}
      />
      <Image
        source={require('../assets/welcome1.0.png')}
        style={styles.image}
      />
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('GetOTP')}>
          <View style={styles.buttonBox}>
            <Text style={styles.buttonText}>Get Started</Text>
          </View>
        </TouchableOpacity>
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
  logo: {
    width: 180,
    height: 80,
    borderRadius: 28,
  },
  image: {
    width: 400,
    height: 400,
    marginTop: 50,
  },
  buttonBox: {
    backgroundColor: '#64b5f6', // #85c1e9 #64b5f6
    padding: 20,
    marginTop: 70,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Welcome;
