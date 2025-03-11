import supabase from "@/lib/supabase";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HistorySchema } from "@/schema/history";

const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY || ""
);

export default function useHistoryProvider() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processSearchQuery = async (
    query: string
  ): Promise<HistorySchema | null> => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Given the search query "${query}", provide information about a relevant song and the top 3 albums of the artist in the following JSON format:
      {
        "song_name": "name of the song",
        "artist_name": "name of the artist",
        "song_thumbnail": "thumbnail URL of the song (if available, otherwise empty string)",
        "yt_url": "youtube URL of the song (if available, otherwise empty string)",
        "album_name": "album 1 - album 2 - album 3"
      }
      Only provide the JSON response, no additional text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response (remove Markdown code block syntax)
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      const jsonString = text.slice(jsonStart, jsonEnd);

      // Parse the JSON string
      const songInfo = JSON.parse(jsonString);
      console.log(songInfo);
      return {
        ...songInfo,
        searched_at: new Date(),
      };
    } catch (err) {
      console.error("Error processing search query:", err);
      setError("Failed to process search query");
      return null;
    }
  };

  const addToHistory = async (userId: string, songInfo: HistorySchema) => {
    setLoading(true);
    try {
      // Check if the artist already exists in the History table for the given user
      const { data: existingEntries, error: fetchError } = await supabase
        .from("History")
        .select("*")
        .eq("user_id", userId)
        .eq("artist_name", songInfo.artist)
        .eq("song_name", songInfo.title);

      if (fetchError) throw fetchError;

      // If the artist already exists, return early
      if (existingEntries && existingEntries.length > 0) {
        console.log("Artist already exists in history");
        return;
      }

      // If the artist does not exist, add the entry to the History table
      const { error: insertError } = await supabase.from("History").insert([
        {
          user_id: userId,
          song_name: songInfo.title,
          artist_name: songInfo.artist,
          yt_url: songInfo.url,
          song_thumbnail: songInfo.thumbnail,
          album_name: songInfo.album_name || "",
          searched_at: new Date().toString(),
        },
      ]);

      if (insertError) throw insertError;
    } catch (error) {
      console.log("Error adding to history", error);
      setError("Failed to add to history");
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("History")
        .select("*")
        .eq("user_id", userId)
        .order("searched_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to fetch history");
      return [];
    }
  };

  return {
    processSearchQuery,
    addToHistory,
    getHistory,
    loading,
    error,
  };
}
