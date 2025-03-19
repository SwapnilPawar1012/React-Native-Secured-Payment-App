import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import {paymentMethods} from '../data/paymentMethods';
import AdPanel from '../components/AdPanel';

const Home = ({navigation}: {navigation: any}) => {
  const [limit, setLimit] = useState(4);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Pressable
        onPress={() => {
          navigation.navigate('AdvancePaymentLock');
        }}>
        <AdPanel />
      </Pressable>
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
          {paymentMethods(navigation)
            .slice(0, limit)
            .map(method => (
              <Pressable onPress={method.press} key={method.id}>
                <View
                  style={[styles.button, {backgroundColor: method.bgColor}]}>
                  {method.type === 'image' ? (
                    <Image source={method.name} style={styles.image} />
                  ) : (
                    <FontAwesome
                      name={method.name}
                      size={34}
                      style={styles.image}
                    />
                  )}
                  <Text style={styles.buttonText}>{method.title}</Text>
                </View>
              </Pressable>
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 18,
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
    padding: 10,
    borderRadius: 8,
    marginRight: 13,
    marginBottom: 13,
    // borderWidth: 1,
    // backgroundColor: '#aed6f1',
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
