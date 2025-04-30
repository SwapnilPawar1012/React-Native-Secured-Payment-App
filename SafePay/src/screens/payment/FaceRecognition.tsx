import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import Loading from '../../components/Loading';
import {useAuthContext} from '../../context/AuthContext';

const capturePhotoCount = 4;
const captureInterval = 150;

const FaceRecognition = ({navigation}: {navigation: any}) => {
  const {user} = useAuthContext();

  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [resizedPhotos, setResizedPhotos] = useState<string[]>([]);

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
      return imagePath; // Return original path in case of error
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
    const count = capturePhotoCount || 8;
    const interval = captureInterval || 200;

    try {
      if (!camera.current) return;

      for (let i = 0; i < count; i++) {
        const photo = await camera.current.takePhoto({flash: 'off'});
        console.log(`Photo ${i + 1} captured:`, photo.path);
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

  const sendPhotosToBackend = async () => {
    const count = resizedPhotos.length || 8;
    const formData = new FormData();
    console.log('capturedImage: ', capturedPhotos);
    console.log('resizedImages: ', resizedPhotos);

    for (let i = 0; i < count; i++) {
      formData.append('currentPhotos', {
        uri: 'file://' + resizedPhotos[i],
        type: 'image/jpeg',
        name: `photo${i + 1}.jpeg`,
      });
    }

    formData.append('userId', user);

    try {
      const response = await axios.post(
        'http://192.168.154.241:5000/api/auth/advance-biometric',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept all 2xx–4xx responses (exclude 5xx)
          },
        },
      );

      if (response.data.success) {
        Alert.alert(
          response.data.message || 'Face Matched',
          'Face recognition successful!',
        );
        navigation.replace('PaymentPanel');
      } else {
        console.log('response.data.message: ', response.data.message);
        if (response.data.success === false) {
          Alert.alert(
            'Face Recognition Failed',
            'Face did not match, Please try again.',
          );
        } else {
          Alert.alert(
            'Face Recognition Failed',
            response.data.message + ' Please try again.',
          );
        }
      }
    } catch (error) {
      console.error('Error sending photos to backend:', error);
      Alert.alert('Error', 'Error occurred!');
    } finally {
      // Delete both original and resized photos
      await deletePhotos(capturedPhotos);
      await deletePhotos(resizedPhotos);
      console.log('All photos deleted from local storage.');
    }
  };

  useEffect(() => {
    if (
      capturedPhotos.length === capturePhotoCount &&
      resizedPhotos.length === capturePhotoCount
    ) {
      sendPhotosToBackend();
    }
  }, [capturedPhotos, resizedPhotos]);

  if (device == null) {
    return (
      <View style={styles.container}>
        <Loading />
        <Text>Loading camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={[StyleSheet.absoluteFill, {opacity: 0}]}
        device={device}
        isActive={true}
        photo={true}
        onInitialized={() => setIsCameraReady(true)}
        zoom={1.8}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Face Detecting...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default FaceRecognition;
