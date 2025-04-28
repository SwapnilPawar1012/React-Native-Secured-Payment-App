import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import axios from 'axios';
import RNFS from 'react-native-fs'; // Ensure RNFS is imported
import ImageResizer from 'react-native-image-resizer';
import Loading from './Loading';

const CaptureAndSendScreen = () => {
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front; // Front camera
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission !== 'authorized') {
        Alert.alert('Permission Denied', 'Camera access is required.');
      }
    })();
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
    try {
      const formData = new FormData();
      formData.append('photos', {
        uri: 'file://' + photoPath1,
        type: 'image/jpeg',
        name: 'photo1.jpg',
      });
      formData.append('photos', {
        uri: 'file://' + photoPath2,
        type: 'image/jpeg',
        name: 'photo2.jpg',
      });

      const response = await axios.post(
        'http://192.168.154.241:5000/api/auth/advance-biometric',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const result = response.data;
      if (response.status === 200) {
        Alert.alert('Success', 'Photos uploaded successfully!');

        if (result && result.message) {
          console.log('Upload successful:', result.message);
          console.log('Uploaded file count:', result.files.length);
        } else {
          console.log('Upload successful but no message received.');
        }
        return true;
      } else {
        console.error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error sending photos to backend:', error);
      Alert.alert('Error', 'Failed to send photos.');
    } finally {
      await deleteAllPhotos();
    }
  };

  if (device == null) return <Loading />;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        onInitialized={() => setIsCameraReady(true)}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Capturing Photos...</Text>
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
