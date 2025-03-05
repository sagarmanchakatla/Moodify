import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DashBoardHeader from '@/components/dashBoardHeader';
import YoutubeIframe from 'react-native-youtube-iframe';
import icons from '@/constants/icons';
import useSongProvider from '@/hook/useSongProvider';


export default function MusicPlayer() {
    const {songs,getCurrentSongDetailes,handleNext,handlePrevious,handleShuffle} = useSongProvider();
    const [playing, setPlaying] = useState(true);
    const song = getCurrentSongDetailes();
    const togglePlaying = () => {
        setPlaying((prev) => !prev);
    };
    console.log(song);
    console.log(songs.length)
    return (
        <View className="flex flex-col w-full h-full bg-white ">
            <DashBoardHeader title="Now Playing" />
            <View className="flex flex-col justify-around pb-5">
                <View className="w-full flex flex-row mt-2">
                    <YoutubeIframe
                        height={150}
                        videoId={song?.id}
                        play={playing}
                        onChangeState={(event) => {
                            if (event === 'ended') {
                                setPlaying(false);
                            }
                        }}
                    />
                </View>
                <View className="flex flex-col items-center gap-10 px-5">
                    <Image source={{ uri: song?.thumbnail }} className="w-[200px] h-[200px] rounded-lg" />
                    <View className="items-center">
                        <Text className="font-Popping-Bold text-xl" numberOfLines={1}>{song?.title}</Text>
                        <Text className="font-Popping text-md text-gray-500">{song?.artist}</Text>
                    </View>
                </View>
                <View className="flex-row justify-center items-center gap-7 relative mt-5">
                    <TouchableOpacity onPress={handlePrevious}>
                        <Image source={icons.previous} className="w-9 h-10" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlaying}>
                        <Image
                            source={playing ? icons.pauseicon : icons.playBtnicon}
                            className="w-12 h-12"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext}>
                        <Image source={icons.next} className="w-9 h-7" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShuffle} className="absolute right-5">
                        <Image source={icons.shuffle} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}