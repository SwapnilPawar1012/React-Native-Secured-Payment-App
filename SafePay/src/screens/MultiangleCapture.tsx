import {Alert, Button, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Loading from '../components/Loading';
import {useAdvanceProtectionContext} from '../context/AdvanceProtectionContext';
import ImageResizer from 'react-native-image-resizer';

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
    'Try other angle 1',
    'Try other angle 2',
    'Try other angle 3',
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
      // Compress the photo
      const compressedPhoto = await ImageResizer.createResizedImage(
        photo.path,
        800, // width
        800, // height
        'JPEG', // format
        60, // quality (lower = more compressed)
      );
      console.log('Compressed photo path: ', compressedPhoto.uri);

      // Add the compressed photo path to the state
      setPhotos(prev => [...prev, compressedPhoto.uri]);
      if (step < directions.length - 1) {
        setStep(prev => prev + 1); // Move to next prompt
      }
    } catch (err) {
      console.error('Failed to compress and move photo to local storage', err);
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

    const formData = new FormData();
    photos.forEach((uri, idx) => {
      formData.append('photos', {
        uri: 'file://' + uri,
        type: 'image/jpeg',
        name: `photo_${idx + 1}.jpg`,
      });
    });

    try {
      const response = await fetch(
        'http://192.168.154.241:5000/api/auth/upload-images',
        {
          method: 'POST',
          body: formData,
        },
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Photos uploaded successfully!');

        if (result && result.message) {
          console.log('Upload successful:', result.message);
          console.log('Uploaded file count:', result.files.length);
        } else {
          console.log('Upload successful but no message received.');
        }

        enableAdvanceProtection('AProtected');
        navigation.navigate('Home');
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
      <View style={styles.cameraWrapper}>
        <View style={styles.cameraBox}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
            zoom={1.8} // (1.5x zoom)
          />
        </View>
        {/* Face Box Overlay */}
        <View style={styles.overlay}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
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
  cameraWrapper: {
    position: 'relative',
    width: 270,
    height: 270,
    marginBottom: 50,
  },
  cameraBox: {
    width: 240,
    height: 240,
    top: 14,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: '0%',
    left: '0%',
    width: '100%',
    height: '100%',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#555',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 28,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 28,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 28,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 28,
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
