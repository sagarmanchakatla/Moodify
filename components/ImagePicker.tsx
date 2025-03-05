import { TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useImageProvider from '@/hook/useImageProvider';
import { ReactNode } from 'react';

interface ImagePickerSchema {
  title?: string,
  component?: ReactNode
}

export default function ImagePickerPage({ title, component }: ImagePickerSchema) {
  const { updatePicture } = useImageProvider();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images',],
      allowsEditing: true,
      quality: 1,
      base64: true
    });

    if (!result.canceled) {
      const [image] = result.assets;
      updatePicture(pre => ({
        ...pre,
        uri: image.uri,
        base64ImageString: image.base64!,
        fileName: image.fileName,
        height: image.height!,
        width: image.width!
      }));
    }
  };

  return (
    <>
      {component ? component :
        <TouchableOpacity onPress={pickImage} className='font-Popping p-4 bg-red-200 rounded-lg'>
          <Text className='font-Popping-SemiBold'>{title}</Text>
        </TouchableOpacity>
      }
    </>
  );
}