import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ComingSoon = () => {
  return (
    <View style={styles.container}>
      <FontAwesome
        name="hourglass-half"
        size={50}
        color="black"
        style={styles.icon}
      />
      <Text style={styles.text}>Coming Soon</Text>
      {/* <Image
        source={require('../assets/coming-soon.png')}
        style={{height: 150, width: 350}}
      /> */}
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
  icon: {
    justifyContent: 'center',
    marginBottom: 20
  },
  text: {
    fontSize: 28,
    fontFamily: 'Serif',
    fontWeight: 'bold',
  },
});

export default ComingSoon;
