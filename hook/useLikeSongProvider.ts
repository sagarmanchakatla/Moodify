import supabase from "@/lib/supabase";
import { LikeSong } from "@/schema/likeSong";
import { useState } from "react";

export default function useLikeSongProvider() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLikedSong = async (userId: string, songInfo: LikeSong) => {
    setLoading(true);
    try {
      const { data: existingSongs, error: fetchError } = await supabase
        .from("LikedSongs")
        .select("*")
        .eq("user_id", userId)
        .eq("song_title", songInfo.song_title)
        .eq("song_url", songInfo.song_url);
      // .eq("id", songInfo.song_id);

      if (fetchError) throw fetchError;

      if (existingSongs && existingSongs.length > 0) {
        console.log("Song already liked by the user");
        return;
      }

      const { error: insertError } = await supabase.from("LikedSongs").insert([
        {
          user_id: userId,
          song_title: songInfo.song_title,
          song_thumbnail: songInfo.song_thumbnail,
          song_url: songInfo.song_url,
          song_artist: songInfo.song_artist,
        },
      ]);

      if (insertError) throw insertError;
    } catch (error) {
      console.log("Error adding in liked", error);
      setError("Error adding in liked");
    } finally {
      setLoading(false);
    }
  };

  const removeSong = async (
    userId: string,
    song_id: number,
    song_url: string,
    song_title: string
  ) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("LikedSongs")
        .delete()
        .eq("user_id", userId)
        .eq("song_url", song_url)
        .eq("song_title", song_title);
      // .eq("id", song_id);

      if (error) throw error;
    } catch (error) {
      console.log("Error removing song", error);
      setError("Error removing song");
    } finally {
      setLoading(false);
    }
  };

  const getLikedSongs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("LikedSongs")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.log("Error fetching liked songs", error);
      setError("Error fetching liked songs");
    }
  };

  return { addLikedSong, removeSong, getLikedSongs, loading, error };
}
