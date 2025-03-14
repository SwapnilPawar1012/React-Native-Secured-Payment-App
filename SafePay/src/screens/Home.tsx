import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAuthContext} from '../context/AuthContext';
import {useAppLockContext} from '../context/AppLockContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Home = ({navigation}: {navigation: any}) => {
  const {user, logout} = useAuthContext();
  const {unlock} = useAppLockContext();

  const [limit, setLimit] = useState(4);

  const paymentMethods = [
    {
      type: 'image',
      name: require('../assets/payment/qr-code.png'),
      title: 'Scan any QR code',
      press: () => navigation.navigate('ComingSoon'),
    },
    {
      type: 'icon',
      name: 'address-book',
      title: 'Pay contacts',
      press: () => navigation.navigate('ComingSoon'),
    },
    {
      type: 'image',
      name: require('../assets/payment/pay-phone.png'),
      title: 'Pay phone number',
      press: () => navigation.navigate('ComingSoon'),
    },
    {
      type: 'icon',
      name: 'university',
      title: 'Bank transfer',
      press: () => navigation.navigate('ComingSoon'),
    },
    {
      type: 'icon',
      name: 'at',
      title: 'Pay UPI ID or number',
      press: () => navigation.navigate('ComingSoon'),
    },
    {
      type: 'image',
      name: require('../assets/payment/recharge.png'),
      title: 'Mobile recharge',
      press: () => navigation.navigate('ComingSoon'),
    },
    {
      type: 'image',
      name: require('../assets/payment/bill.png'),
      title: 'Pay bills',
      press: () => navigation.navigate('ComingSoon'),
    },
  ];

  const HandleLogout = () => {
    logout();
    navigation.replace('GetOTP');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          <Image
            source={require('../assets/user.png')}
            style={styles.profileImage}
          />
          <View>
            <Text style={[styles.text, {fontWeight: '500'}]}>
              Swapnil Pawar
            </Text>
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
      <View>
        {limit === 10 ? (
          <Pressable style={styles.seeMoreButton} onPress={() => setLimit(4)}>
            <Text>See less</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.seeMoreButton} onPress={() => setLimit(10)}>
            <Text>See more</Text>
          </Pressable>
        )}
        <View style={styles.buttonContainer}>
          {paymentMethods.slice(0, limit).map((method, index) => (
            <>
              {method.type === 'image' ? (
                <Pressable onPress={method.press} key={`id-` + index}>
                  <View style={styles.button}>
                    <Image source={method.name} style={styles.image} />
                    <Text style={styles.buttonText}>{method.title}</Text>
                  </View>
                </Pressable>
              ) : (
                <Pressable onPress={method.press} key={`id-` + index}>
                  <View style={styles.button}>
                    <FontAwesome
                      name={method.name}
                      size={40}
                      style={styles.image}
                    />
                    <Text style={styles.buttonText}>{method.title}</Text>
                  </View>
                </Pressable>
              )}
            </>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginHorizontal: 18,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 25,
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
  seeMoreButton: {
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: 80,
    height: 110,
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 13,
    marginBottom: 13,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
  },
  image: {
    width: 35,
    height: 35,
    color: '#444',
  },
});

export default Home;
