import supabase from "@/lib/supabase";
import { UserContextType, UserSchema } from "@/schema";
import { router } from "expo-router";
import React, { createContext, ReactNode, useEffect, useState } from "react";


const initialState:UserContextType = {
  isAuthenticated : false,
  user : {
    age : 0,
    date_of_birth : "",
    first_name : "",
    height : 0,
    weight : 0,
    gender : "",
    genre : "",
    last_name : "",
    id : "",
    avatar : "",
    fav_artist: "",
  },
  updateState : ()=>{}
}

export const UserContext = createContext<UserContextType>(initialState);

const fetchUser = async (id: string): Promise<UserSchema | null> => {
  try {
    const { data, error } = await supabase
      .from("UsersProfile")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextType>(initialState);

  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user?.id) {
        console.log("User not authenticated, redirecting to login.");
        return router.replace("/(auth)/login");
      }

      const userDetails = await fetchUser(user.id);
      if (userDetails) {
        console.log("Setting user state:", userDetails);
        setUser(pre=>({
          ...pre,
          isAuthenticated : true,
          user : {
            ...userDetails
          }
        }));
      }
    };
    fetchAuthenticatedUser();
  }, []);

  return (
    <UserContext.Provider value={{...user,updateState : setUser}}>
      {children}
    </UserContext.Provider>
  );
};


export default UserProvider;