import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppLockContext} from '../context/AppLockContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {settingButtons} from '../data/settingButttons';

const Settings = ({navigation}: {navigation: any}) => {
  const {isLocked} = useAppLockContext();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 24, fontWeight: '500'}}>Settings</Text>
      </View>
      <View style={styles.buttonsBox}>
        {settingButtons(navigation).map(setting => (
          <Pressable
            onPress={setting.press}
            style={styles.card}
            key={setting.id}>
            <FontAwesome name={setting.name} size={28} style={styles.icon} />
            <Text style={styles.text}>{setting.title}</Text>
            {setting.id === 6 ? (
              <Text style={styles.buttonInfo}>
                {isLocked ? 'disable' : 'enable'}
              </Text>
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 40,
  },
  header: {
    height: 60,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    // borderBottomWidth: 0.2,
  },
  buttonsBox: {
    marginHorizontal: 20,
  },
  buttonInfo: {
    backgroundColor: '#6CB4EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    color: 'white',
    marginLeft: 20,
  },
  card: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    textAlign: 'center',
  },
  text: {
    fontSize: 17,
    marginLeft: 15,
  },
});

export default Settings;
