import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAuthContext} from '../context/AuthContext';
import {useAppContext} from '../context/AppContext';

const Home = ({navigation}: {navigation: any}) => {
  const {user, logout} = useAuthContext();

  const HandleLogout = () => {
    logout();
    navigation.replace('GetOTP');
  };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Text>{user}</Text>
      <Button title="Logout" onPress={HandleLogout} />
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
