import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuthContext } from '../context/AuthContext';

const Header = ({navigation}: any) => {
  const {user} = useAuthContext();

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profile}>
        <Image
          source={require('../assets/user.png')}
          style={styles.profileImage}
        />
        <View>
          <Text style={[styles.text, {fontWeight: '500'}]}>Swapnil Pawar</Text>
          <Text style={styles.text}>+91{user}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          style={styles.profileIcon}>
          <FontAwesome name="bell" size={22} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          style={styles.profileIcon}>
          <FontAwesome name="gear" size={28} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    padding: 5,
    backgroundColor: 'white',
    marginRight: 10,
  },
  text: {
    fontSize: 15,
  },
  profileIcon: {
    marginLeft: 20,
  },
});

export default Header;
