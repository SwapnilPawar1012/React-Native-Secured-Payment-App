import {Alert, Button, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Loading from '../components/Loading';
import { useAdvanceProtectionContext } from '../context/AdvanceProtectionContext';

const MultiangleCapture = ({navigation}: {navigation: any}) => {
  const device = useCameraDevice('front');
  const [photos, setPhotos] = useState<String[]>([]);
  const camera = useRef<Camera>(null);

  const [capturing, setCapturing] = useState(false);

  const directions = [
    'Look straight',
    'Turn left',
    'Turn right',
    'Look up',
    'Look down',
    'Try other angle',
  ];
  const [step, setStep] = useState(0);

  const {
    enableAdvanceProtection,
  } = useAdvanceProtectionContext();

  const loadFacePhotos = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);

      const faceFiles = files
        .filter(file => file.name.startsWith('face') && file.isFile())
        .map(file => file.path); // Get only paths

      setPhotos(faceFiles);
      console.log('Loaded face photos:', faceFiles);
    } catch (err) {
      console.error('Error loading face photos:', err);
    }
  };

  useEffect(() => {
    Camera.requestCameraPermission().then(result => {
      console.log('Camera permission:', result);
    });
    loadFacePhotos();
  }, []);

  const takePhoto = async () => {
    if (camera.current == null || photos.length >= 8 || capturing) return; // prevent excess
    console.log('Taking photo... ', camera.current);
    setCapturing(true); // prevent further taps

    const photo = await camera.current.takePhoto({});
    console.log('Photo taken: ', photo);

    // Define target path in app's document directory
    const newPath = `${RNFS.DocumentDirectoryPath}/face_${Date.now()}.jpg`;

    try {
      await RNFS.moveFile(photo.path, newPath); // move photo
      console.log('Photo saved to local:', newPath);
      setPhotos(prev => [...prev, newPath]);

      if (step < directions.length - 1) {
        setStep(prev => prev + 1); // move to next prompt
      }
    } catch (err) {
      console.error('Failed to move photo to local storage', err);
    } finally {
      setCapturing(false); // re-enable capture
    }
  };

  const deleteAllPhotos = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const facePhotos = files.filter(file => file.name.startsWith('face_'));
      const newfacePhotos = files.filter(file =>
        file.name.startsWith('safepay_biometric/face_'),
      );

      for (const file of facePhotos) {
        await RNFS.unlink(file.path);
        console.log(`Deleted: ${file.path}`);
      }
      for (const file of newfacePhotos) {
        await RNFS.unlink(file.path);
        console.log(`Deleted: ${file.path}`);
      }
      setPhotos([]);
      setStep(0);
      console.log('All face photos deleted.');
    } catch (err) {
      console.error('Failed to delete photos', err);
    }
  };

  const uploadPhotos = async () => {
    const destinationDir = `${RNFS.DocumentDirectoryPath}/safepay_biometric`;

    try {
      // Ensure destination directory exists
      const dirExists = await RNFS.exists(destinationDir);
      if (!dirExists) {
        await RNFS.mkdir(destinationDir);
      }

      // Read current directory and filter photos
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const facePhotos = files.filter(
        file => file.name.startsWith('face_') && file.isFile(),
      );

      for (const photo of facePhotos) {
        const fileName = photo.name;
        const newPath = `${destinationDir}/${fileName}`;
        await RNFS.copyFile(photo.path, newPath);
        console.log(`Copied: ${fileName} -> ${newPath}`);
      }

      console.log('Upload completed: all face photos copied.');
      enableAdvanceProtection('AProtected');
      navigation.navigate('Home'); // Navigate to Home after upload
    } catch (err) {
      console.error('Error uploading/copying photos:', err);
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
        disabled={photos.length > 7}
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
          title="Retake Photos"
          onPress={deleteAllPhotos}
          color={'red'}
          disabled={photos.length < 1}
        />
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
          disabled={photos.length < 7}
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
