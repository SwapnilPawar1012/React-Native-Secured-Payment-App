import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAuthContext} from '../context/AuthContext';
import {useAppLockContext} from '../context/AppLockContext';

const Home = ({navigation}: {navigation: any}) => {
  const {user, logout} = useAuthContext();
  const {unlock} = useAppLockContext();

  const HandleLogout = () => {
    logout();
    navigation.replace('GetOTP');
  };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Text>{user}</Text>
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button title="Unlock" onPress={unlock} />
      <Button title="Logout" onPress={HandleLogout} disabled />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
