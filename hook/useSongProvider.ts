import { SearchProviderContext } from "@/context/SongProvider";
import { search } from "@/http/songs";
import { router } from "expo-router";
import React, { useContext } from "react";



export default function useSongProvider() {
    const context = useContext(SearchProviderContext);
    const { data: { artists, playlists, songs }, error, loading, currentlyPlaying, isPlaying, updateState } = context

    const fetchSearchQuery = async (query: string) => {
        try {
            updateState(pre => ({
                ...pre,
                loading: true
            }))
            const response = await search(query);
            updateState(pre => ({
                ...pre,
                data: {
                    artists: response.artists,
                    playlists: response.playlists,
                    songs: response.songs
                },
                currentlyPlaying: 0,
                loading: false
            }))
        } catch (err: any) {
            console.log(err.message);
            updateState(pre => ({
                ...pre,
                loading: false,
                error: err.message
            }));
        }
    }
    const setSongPlay = (id: number) => {
        updateState(pre => ({
            ...pre,
            currentlyPlaying: id,
            isPlaying: true,
        }))
        router.push("/(root)/musicPlayer");
    }
    const getCurrentSongDetailes = () => {
        if (currentlyPlaying! >= 0 && currentlyPlaying! < songs.length) {
            return songs[currentlyPlaying!]
        }
        return null;
    }

    const handleNext = () => {
        if (currentlyPlaying! < songs.length) {
            setSongPlay(currentlyPlaying! + 1)
        }
    }
    const handlePrevious = () => {
        if (currentlyPlaying! > 0) {
            setSongPlay(currentlyPlaying! - 1);
        }
    }
    const handleShuffle = () => {
        const shuffleSongId = Math.floor(Math.random() * songs.length - 1);
        setSongPlay(shuffleSongId);
    }

    return {
        songs,
        artists,
        playlists,
        loading,
        error,
        isPlaying,
        currentlyPlaying,
        handleShuffle,
        handleNext,
        handlePrevious,
        setSongPlay,
        getCurrentSongDetailes,
        fetchSearchQuery
    }
}