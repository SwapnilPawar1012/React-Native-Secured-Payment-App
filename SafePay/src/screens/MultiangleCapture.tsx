import {Alert, Button, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Loading from '../components/Loading';
import {useAdvanceProtectionContext} from '../context/AdvanceProtectionContext';

const MultiangleCapture = ({navigation}: {navigation: any}) => {
  const device = useCameraDevice('front');
  const [photos, setPhotos] = useState<string[]>([]); // Store the photos
  const camera = useRef<Camera>(null);

  const [capturing, setCapturing] = useState(false);

  const directions = [
    'Look straight',
    'Turn left',
    'Turn right',
    'Look up',
    'Look down',
    'Try other angle',
    'Look left',
    'Look right',
  ];
  const [step, setStep] = useState(0);

  const {enableAdvanceProtection} = useAdvanceProtectionContext();

  useEffect(() => {
    Camera.requestCameraPermission().then(result => {
      console.log('Camera permission:', result);
    });
  }, []);

  // Function to take a photo and add it to the photos array
  const takePhoto = async () => {
    if (camera.current == null || photos.length >= 8 || capturing) return; // prevent excess photos
    console.log('Taking photo... ', camera.current);
    setCapturing(true); // prevent further taps

    const photo = await camera.current.takePhoto({});
    console.log('Photo taken: ', photo);

    try {
      setPhotos(prev => [...prev, photo.path]); // Add new photo to state
      if (step < directions.length - 1) {
        setStep(prev => prev + 1); // Move to next prompt
      }
    } catch (err) {
      console.error('Failed to move photo to local storage', err);
    } finally {
      setCapturing(false); // Re-enable capture
    }
  };

  const deleteAllPhotos = async () => {
    try {
      for (let uri of photos) {
        await RNFS.unlink(uri); // Delete each captured photo
      }
      setPhotos([]); // Clear state
      console.log('All photos deleted');
    } catch (error) {
      console.error('Failed to delete photos:', error);
    }
  };

  // Function to upload all photos to the backend
  const uploadPhotos = async () => {
    if (photos.length < 8) return;

    // Prepare the photos for upload
    const formData = new FormData();
    photos.forEach((uri, idx) => {
      formData.append('photos', {
        uri: 'file://' + uri, // Ensure the correct path is used
        type: 'image/jpeg', // Adjust based on the photo type
        name: `photo_${idx + 1}.jpg`,
      });
    });

    try {
      const response = await fetch('http://192.168.158.241:5000/api/auth/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Photos uploaded successfully!');
        console.log('Upload successful:', result);
        enableAdvanceProtection('AProtected');
        navigation.navigate('Home'); // Navigate to Home after upload
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      Alert.alert('Upload Error', 'Failed to upload photos');
    } finally {
      await deleteAllPhotos();
    }
  };

  if (device == null)
    return (
      <View style={styles.container}>
        <Loading />
        <Text>Loading camera</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>{directions[step]}</Text>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <Button
        title="Capture Face"
        onPress={takePhoto}
        disabled={photos.length >= 8 || capturing} // Disable if 8 photos already captured
      />
      <View style={styles.photoContainer}>
        {photos.map((uri, idx) => (
          <Image
            key={idx}
            source={{uri: 'file://' + uri}}
            style={styles.image}
          />
        ))}
      </View>
      <View style={{flexDirection: 'row', gap: 25}}>
        <Button
          title="Upload Photos"
          onPress={() => {
            Alert.alert(
              'Enable Advance Payment Protection', // Title
              'Are you sure you want to proceed?', // Message
              [
                {
                  text: 'Cancel',
                  onPress: () => {
                    console.log('Action canceled');
                    return;
                  },
                  style: 'cancel',
                },
                {
                  text: 'Confirm',
                  onPress: () => {
                    console.log('Action confirmed');
                    uploadPhotos();
                  },
                },
              ],
            );
          }}
          color={'green'}
          disabled={photos.length < 8} // Enable upload only if 8 photos are captured
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 100,
  },
  promptText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  camera: {
    height: 250,
    width: 250,
    marginBottom: 50,
  },
  photoContainer: {
    marginHorizontal: 30,
    marginVertical: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 55,
    height: 55,
    margin: 6,
  },
});

export default MultiangleCapture;
