import { Button, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const GeneratePlaylist = () => {
  return (
    <View>
      <Text>GeneratePlaylist</Text>
      <Button
        title="Generate Playlist"
        onPress={() => router.push("/(root)/generatePlaylist")}
      />
    </View>
  );
};

export default GeneratePlaylist;
