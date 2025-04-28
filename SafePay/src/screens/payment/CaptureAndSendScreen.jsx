import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs'; // Ensure RNFS is imported
import ImageResizer from 'react-native-image-resizer';
import Loading from '../../components/Loading';
import {useAuthContext} from '../../context/AuthContext';

const CaptureAndSendScreen = ({navigation}) => {
  const {user} = useAuthContext();

  const camera = useRef(null);
  const device = useCameraDevice('front');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  useEffect(() => {
    Camera.requestCameraPermission().then(result => {
      console.log('Camera permission:', result);
    });
  }, []);

  useEffect(() => {
    if (isCameraReady && device) {
      captureTwoPhotos();
    }
  }, [isCameraReady, device]);

  const captureTwoPhotos = async () => {
    try {
      if (!camera.current) return;

      // First photo
      const photo1 = await camera.current.takePhoto({flash: 'off'});
      console.log('First photo captured:', photo1.path);

      await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds

      // Second photo
      const photo2 = await camera.current.takePhoto({flash: 'off'});
      console.log('Second photo captured:', photo2.path);

      setCapturedPhotos([photo1, photo2]);

      // Optionally resize the photos if needed before uploading
      const resizedPhoto1 = await resizePhoto(photo1.path);
      const resizedPhoto2 = await resizePhoto(photo2.path);

      // Now send photos to backend
      await sendPhotosToBackend(resizedPhoto1, resizedPhoto2);
    } catch (error) {
      console.error('Error capturing photos:', error);
    }
  };

  const resizePhoto = async photoPath => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        photoPath,
        800,
        600,
        'JPEG',
        80,
      );
      return resizedImage.uri;
    } catch (error) {
      console.error('Error resizing photo:', error);
      return photoPath; // Return original path in case of error
    }
  };

  const deleteAllPhotos = async () => {
    try {
      for (let uri of capturedPhotos) {
        await RNFS.unlink(uri); // Delete each captured photo
      }
      setCapturedPhotos([]); // Clear state
      console.log('All photos deleted');
    } catch (error) {
      console.error('Failed to delete photos:', error);
    }
  };

  const sendPhotosToBackend = async (photoPath1, photoPath2) => {
    const formData = new FormData();
    formData.append('currentPhotos', {
      uri: 'file://' + photoPath1,
      type: 'image/jpeg',
      name: 'photo1.jpg',
    });
    formData.append('currentPhotos', {
      uri: 'file://' + photoPath2,
      type: 'image/jpeg',
      name: 'photo2.jpg',
    });
    formData.append('userId', user);

    try {
      const response = await axios.post(
        'http://192.168.154.241:5000/api/auth/advance-biometric',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        if (response.data.success) {
          navigation.replace('PaymentPanel');
          Alert.alert(response.data.message || 'Face Matched');
        } else if (response.data.success === false) {
          Alert.alert(
            response.data.message || 'Face Not Matched',
            'Please try again.',
          );
        }
      } else {
        console.error(result.message || 'Face Not Matched');
      }
    } catch (error) {
      console.error('Error sending photos to backend:', error);
      Alert.alert('Error', 'Failed to send photos.');
    } finally {
      await deleteAllPhotos();
    }
  };

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
        style={StyleSheet.absoluteFill}
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

export default CaptureAndSendScreen;
