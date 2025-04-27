import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const NoCameraDeviceError = () => {
  return (
    <View style={styles.container}>
      <Text>NoCameraDeviceError</Text>
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
});

export default NoCameraDeviceError;
