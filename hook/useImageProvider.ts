import  React,{ useContext } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { ImageProviderContext } from '@/context/ImageProvider'

export default function useImageProvider() {
  const context = useContext(ImageProviderContext);

  if (!context) {
    throw Error("useImageProvier must call inside the ImageProviser Component ");
  }
  const { base64ImageString, height, imageFor,uri, width,fileName,contentType,updatePicture} = context;

  const resetImage = () => {
    updatePicture(pre => ({
      ...pre,
      base64ImageString: '',
      height: 0,
      uri: '',
      width: 0,
      contentType : "",
      fileName : null,
    }))
  }

  const pickImage = async (imageFor:"emotion"|"profile") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      selectionLimit : 1,
      quality: 1,
      base64: true
    });

    if (!result.canceled) {
      const [image] = result.assets;
      updatePicture(pre => ({
        ...pre,
        uri: image.uri,
        contentType : image.mimeType,
        fileName : image.fileName,
        base64ImageString: image.base64!,
        height: image.height!,
        width: image.width!,
        imageFor
      }));
    }
  };

  return {
    base64ImageString,
    height,
    width,
    uri,
    fileName,
    contentType,
    imageFor,
    resetImage,
    pickImage,
    updatePicture
  }
}