import { View, Text } from 'react-native'
import React, { Children, createContext, ReactNode, useState } from 'react'


interface ImageProviderSchema {
  uri: string,
  width: number,
  height: number,
  base64ImageString: string,
  fileName: string | null | undefined,
  contentType : string|undefined,
  imageFor : "profile"|"emotion"|null
  updatePicture: React.Dispatch<React.SetStateAction<ImageProviderSchema>>
}

const initialState: ImageProviderSchema = {
  base64ImageString: "",
  height: 0,
  uri: "",
  fileName: null,
  width: 0,
  contentType : '',
  imageFor : null,
  updatePicture: () => { }
}

export const ImageProviderContext = createContext<ImageProviderSchema | undefined>(undefined);

const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [picture, setPicture] = useState<ImageProviderSchema>(initialState);

  return (
    <ImageProviderContext.Provider value={{ ...picture, updatePicture: setPicture }}>
      {children}
    </ImageProviderContext.Provider>
  )
}

export default ImageProvider;