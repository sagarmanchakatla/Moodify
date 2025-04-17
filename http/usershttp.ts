import supabase from "@/lib/supabase";
import { SimilarUser, UserSchema } from "@/schema";
import { calculateSimilarityScore, calculateSimilarityScoreHelper } from "@/utils";

export const sendFriendRequest = async (userId: string, otherUserId: string) => {
    const { error } = await supabase
        .rpc('addconnection', {
            otherid: otherUserId,
            userid: userId
        });

    if (error) {
        console.log(error);
        throw Error(error.message ?? error.cause);
    }

    return;
}


export const getAllUserInfo = async () => {
    const { data, error } = await supabase.from("UsersProfile").select("first_name,last_name,latitude,longitude,genre,fav_artist,id,pushToken").not("latitude", "is", null);
    if (error) {
        console.log(error);
        throw Error(error.message ?? error.cause ?? "Can't fetch the users data to display");
    }
    return data;
}


export const getSocialUsers = async (user: UserSchema,) => {
    const { data, error } = await supabase
        .from("UsersProfile")
        .select("*")
        .neq("id", user.id);

    if (error) throw new Error(error.message);

    const usersWithScores: SimilarUser[] = data.map(
        (otherUser: UserSchema) => {
            const similarity = calculateSimilarityScoreHelper(
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
        .filter((user) => user.similarity_score >= .3) // users choices are similar upto 30% threshold value 
        .sort((a, b) => b.similarity_score - a.similarity_score);

    return {
        similarUsers : filteredUsers,
        allUsers : usersWithScores
    }
}

export const postAddToFriendsList = async (userId: string, otherUserId: string) => {
    const { error } = await supabase
        .rpc('addfriends', {
            otherid: otherUserId,
            userid: userId
        });
    if (error) {
        console.log(error);
        throw Error(error.message ?? error.cause);
    }
    return;
}

export const postRejectFriendRequest = async (userId: string, otherUserId: string) => {
    const { error } = await supabase
        .rpc('rejectrequest', {
            otherid: otherUserId,
            userid: userId
        })
    if (error) {
        console.log(error);
        throw Error(error.message ?? error.cause);
    }
    return;
}