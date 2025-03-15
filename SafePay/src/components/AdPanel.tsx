import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AdPanel = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/ad/ad.png')} style={styles.adImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: '#C0C0C0',
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 12,
  },
  adImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 10,
  }
});

export default AdPanel;
