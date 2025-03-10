import { useState, useEffect, useCallback } from "react";
import supabase from "@/lib/supabase";
import useUserProvider from "./useUserProvider";
import { SimilarUser, UserSchema } from "@/schema";
import { calculateSimilarityScore } from "@/utils";



const useSimilarUsers = (similarityThreshold = 0.3) => {
  const { user } = useUserProvider();
  const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([]);
  const [allUsers, setAllUsers] = useState<SimilarUser[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchSimilarUsers = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all users except the current user
      const { data, error } = await supabase
        .from("UsersProfile")
        .select("*")
        .neq("id", user.id);

      if (error) throw new Error(error.message);
      if (!data) return;

      // Calculate similarity scores for each user
      const usersWithScores: SimilarUser[] = data.map(
        (otherUser: UserSchema) => {
          const similarity = calculateSimilarityScore(
            user.genre || "",
            user.fav_artist || "",
            otherUser.genre || "",
            otherUser.fav_artist || ""
          );

          return {
            ...otherUser,
            similarity_score: similarity,
          };
        }
      );

      // Filter users by similarity threshold and sort by similarity score
      const filteredUsers = usersWithScores
        .filter((user) => user.similarity_score >= similarityThreshold)
        .sort((a, b) => b.similarity_score - a.similarity_score);

      setSimilarUsers(filteredUsers);
      setAllUsers(usersWithScores);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, similarityThreshold]);

  // Fetch similar users when the current user changes
  useEffect(() => {
    if (user) {
      fetchSimilarUsers();
    }
  }, [user, fetchSimilarUsers]);

  // Allow manual refresh
  const refreshSimilarUsers = () => {
    fetchSimilarUsers();
  };

  return {
    similarUsers,
    allUsers,
    loading,
    error,
    refreshSimilarUsers,
  };
};

export default useSimilarUsers;
