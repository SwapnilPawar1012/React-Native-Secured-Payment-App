import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Alert, Button} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {useAuthContext} from '../context/AuthContext';
import Loading from '../components/Loading';
import { useAdvanceProtectionContext } from '../context/AdvanceProtectionContext';

const photoCount = 20;

const FaceDetection = ({navigation}: {navigation: any}) => {
  const {user} = useAuthContext();
  const {enableAdvanceProtection} = useAdvanceProtectionContext();

  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const [zoom, setZoom] = useState(1);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [resizedPhotos, setResizedPhotos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    Camera.requestCameraPermission().then(result => {
      console.log('Camera permission:', result);
    });
  }, []);

  useEffect(() => {
    if (isCameraReady && device) {
      captureMultiplePhotos(); // Capture 4 photos at 500ms interval
    }
  }, [isCameraReady, device]);

  const resizePhoto = async (imagePath: string) => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        imagePath,
        800,
        600,
        'JPEG',
        80,
      );
      return resizedImage.uri;
    } catch (error) {
      console.error('Error resizing photo:', error);
      return imagePath;
    }
  };

  const deletePhotos = async (photoList: string[]) => {
    console.log('Deleting photos: ', photoList);
    for (const path of photoList) {
      try {
        const exists = await RNFS.exists(path);
        if (exists) {
          await RNFS.unlink(path);
          console.log('Deleted:', path);
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  const captureMultiplePhotos = async () => {
    const count = photoCount || 20;
    const interval = 200;
    try {
      if (!camera.current) return;

      for (let i = 0; i < count; i++) {
        const photo = await camera.current.takePhoto({flash: 'off'});
        setCapturedPhotos(prev => [...prev, photo.path]);

        const resized = await resizePhoto(photo.path);
        setResizedPhotos(prev => [...prev, resized]);

        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      }
    } catch (error) {
      console.error('Error capturing photos:', error);
    }
  };

  const sendPhotosToBackend = async (resizedImage: string[]) => {
    const count = resizedImage.length || 20;
    const formData = new FormData();

    for (let i = 0; i < count; i++) {
      formData.append('photos', {
        uri: 'file://' + resizedImage[i],
        type: 'image/jpeg',
        name: `photo${i + 1}.jpeg`,
      });
    }

    formData.append('userId', user);

    try {
      const response = await axios.post(
        'http://192.168.154.241:5000/api/auth/upload-images',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Face Detected successfully!');

        console.log('Upload successful:', response.data.message);
        enableAdvanceProtection('AProtected');
        navigation.navigate('Home');
      } else {
        console.error('Face Detection failed');
      }
    } catch (error) {
      console.error('Error sending photos to backend:', error);
      Alert.alert('Error', 'Failed to send photos.');
    } finally {
      await deletePhotos(capturedPhotos);
      await deletePhotos(resizedPhotos);
      console.log('All photos deleted from local storage.');
    }
  };

  // Now send photos to backend
  const handleOnSubmit = async () => {
    try {
      if (resizedPhotos.length === photoCount) {
        await sendPhotosToBackend(resizedPhotos);
      } else {
        console.log(
          `Incomplete Capture, Please wait until ${photoCount} photos are captured.`,
        );
        Alert.alert(
          'Something went wrong',
          'Please retry the face detection process.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Detection Failed',
        'Please retry the face detection process.',
      );
      console.error('Error in Uploading Images to Backend: ', error);
    }
  };

  const handleCameraInitialized = () => {
    setIsCameraReady(true);
    setZoom(1.7); // Now zoom will apply properly
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % directions.length); // Loop back to 0
    }, 300);

    return () => clearInterval(interval);
  }, []);

  if (device == null) {
    return (
      <View style={styles.container}>
        <Loading />
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhotos.length >= photoCount ? null : (
        <Text style={styles.promptText}>{directions[currentIndex]}</Text>
      )}
      <View style={styles.cameraWrapper}>
        <View style={styles.cameraBox}>
          {capturedPhotos.length >= photoCount ? (
            <FontAwesome name="check-circle" size={150} style={styles.icon} />
          ) : (
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={true}
              photo={true}
              onInitialized={handleCameraInitialized}
              zoom={zoom} // (1.5x zoom)
            />
          )}
        </View>
        {/* Face Box Overlay */}
        <View style={styles.overlay}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
      <View style={{flexDirection: 'row', marginTop: 80}}>
        <Button
          title="Enable"
          onPress={() => {
            console.log('Action confirmed');
            handleOnSubmit();
          }}
          color={'green'}
          disabled={capturedPhotos.length < photoCount} // Enable upload only if 20 photos are captured
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
  icon: {
    color: '#fff',
    backgroundColor: '#73C2FB',
    paddingHorizontal: 10,
    borderRadius: 250,
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
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default FaceDetection;
