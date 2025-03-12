import { useState } from "react";
import supabase from "@/lib/supabase";
import { SongSchema } from "@/schema/songSchema";
import { Playlist } from "@/schema/plalist";

interface PlaylistSong extends SongSchema {
  playlist_id: string;
  added_at: string;
}

export default function usePlaylistProvider() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlaylist = async (
    userId: string,
    name: string,
    description: string,
    thumbnail: string | null
  ) => {
    setLoading(true);
    console.log(userId, name, description, thumbnail);
    try {
      const { data: existingPlaylists, error: checkError } = await supabase
        .from("Playlists")
        .select("id")
        .eq("userId", userId)
        .eq("name", name)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingPlaylists) {
        throw new Error("A playlist with this name already exists");
      }

      // Create new playlist
      const { data, error } = await supabase
        .from("Playlists")
        .insert({
          userId: userId,
          name: name,
          description: description || "",
          thumbnail: thumbnail || "",
        })
        .select()
        .single();

      // if (error) throw error;
      return data;
    } catch (error) {
      setError("Failed to create Playlist");
      console.log("Error creating playlist", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUsersPlaylists = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("Playlists")
        .select(`*, Playlist_songs (count)`)
        .eq("userId", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      setError("Failed to fetch playlists");
      console.error("Failed to fetch playlists", error);
      return [];
    }
  };

  const addSongToPlaylist = async (playlistId: string, song: SongSchema) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("Playlist_songs").insert([
        {
          playlist_id: playlistId,
          song_id: song.id,
          song_title: song.title,
          song_artist: song.artist,
          song_thumbnail: song.thumbnail,
          song_url: song.url,
        },
      ]);

      if (error) throw error;
    } catch (err) {
      setError("Failed to add song to playlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("Playlist_songs")
        .delete()
        .eq("playlist_id", playlistId)
        .eq("song_id", songId);

      if (error) throw error;
    } catch (err) {
      setError("Failed to remove song from playlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const getPlaylistDetails = async (playlistId: string) => {
    try {
      const { data, error } = await supabase
        .from("Playlists")
        .select("*")
        .eq("id", playlistId)
        .single();
  
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching playlist details:", err);
      return null;
    }
  };

  const getPlaylistSongs = async (playlistId: string) => {
    try {
      const { data, error } = await supabase
        .from("Playlist_songs")
        .select("*")
        .eq("playlist_id", playlistId)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError("Failed to fetch playlist songs");
      console.error(err);
      return [];
    }
  };

  return {
    createPlaylist,
    getUsersPlaylists,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlaylistSongs,
    getPlaylistDetails,
    loading,
    error,
  };
}
