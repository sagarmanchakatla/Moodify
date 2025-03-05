import { View, Text } from 'react-native'
import React, { createContext, ReactNode, useState } from 'react'
import { SearchResultsType } from '@/schema/songSchema'

interface SongProviderProps{
    children : ReactNode
}

interface SongProviderSchema{
    data : SearchResultsType
    currentlyPlaying : number | null,
    isPlaying : boolean,
    error : string,
    loading : boolean,
    updateState : React.Dispatch<React.SetStateAction<SongProviderSchema>>
}

const initialState:SongProviderSchema = {
    data : {
        artists : [],
        playlists : [],
        songs : [] 
    },
    currentlyPlaying : null,
    error : "",
    isPlaying : false,
    loading : false,
    updateState : ()=>{}
}

export const SearchProviderContext = createContext<SongProviderSchema>(initialState);

export default function SearchProvider({children}:SongProviderProps) {
    const [state,setState] = useState<SongProviderSchema>(initialState);

  return (
    <SearchProviderContext.Provider value={{...state,updateState : setState}}>
        {children}
    </SearchProviderContext.Provider>
  )
}