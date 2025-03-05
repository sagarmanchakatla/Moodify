import { CameraView, useCameraPermissions } from 'expo-camera';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router"
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useCamera from '@/hook/useCamera';
import { useRef } from 'react';
import useImageProvider from '@/hook/useImageProvider';


export default function CameraComponent() {
    const { facing, flashLigh, toggleCameraFacing, toggleCameraLight } = useCamera();
    const [permission, requestPermission] = useCameraPermissions();
    const {updatePicture} = useImageProvider();

    const cameraRef = useRef<CameraView | null>(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleTakePhoto = async (): Promise<void> => {
        if (cameraRef) {
            try {
                const photo = await cameraRef.current?.takePictureAsync({ base64: true });
                console.log(photo?.uri);
                updatePicture(pre=>({
                    ...pre,
                    base64ImageString : photo?.base64!,
                    height : photo?.height!,
                    width : photo?.width!,
                    uri : photo?.uri!
                }));
                router.back();
            }catch(err){
                console.log("No picture is taken");
            }
        }
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} autofocus='on' flash={flashLigh} ref={cameraRef} >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                        <MaterialIcons name="cancel" size={48} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                        <Entypo name='circle' size={70} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <MaterialIcons name="flip-camera-android" size={48} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flashLight} onPress={toggleCameraLight}>
                        <MaterialIcons
                            name={flashLigh === 'on' ? 'flash-on' : 'flash-off'}
                            size={48}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: "100%",
        height: '100%'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginBottom: 25
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    flashLight: {
        position: "absolute",
        top: 0,
        right: 2
    }
});
