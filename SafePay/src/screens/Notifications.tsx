import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Notifications = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 24, fontWeight: '500'}}>Notifications</Text>
      </View>
      <View style={styles.notificationContainer}>
        {/* <Text style={styles.card}>Notifications</Text> */}
        <View>
          <Text style={{textAlign: 'center'}}>No Notification</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 40,
  },
  header: {
    height: 60,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    marginBottom: 10,
  },
  notificationContainer: {
    marginHorizontal: 15,
  },
  card: {
    borderWidth: 0.3,
    marginVertical: 8,
    padding: 10,
    fontSize: 15,
    borderRadius: 6,
  },
});

export default Notifications;
