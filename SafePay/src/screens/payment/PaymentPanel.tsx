import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const PaymentPanel = () => {
  return (
    <View style={styles.container}>
      <Text>Payment Panel</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentPanel;
