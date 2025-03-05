import { CameraType, } from "expo-camera";
import { useCallback, useState } from "react";


const useCamera = () => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [flashLigh, setFlashLight] = useState<'off' | 'on'>('on');
 
    const toggleCameraFacing = useCallback(() => {
        setFacing(pre => pre === 'back' ? 'front' : 'back');
    }, []);
    const toggleCameraLight = useCallback(() => {
        setFlashLight(pre => pre === 'off' ? "on" : "off");
    }, []);


    return {
        facing,
        flashLigh,
        toggleCameraFacing,
        toggleCameraLight,
    }
}

export default useCamera;