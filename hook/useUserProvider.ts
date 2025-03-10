import { UserContext } from "@/context/UserProvider";
import supabase from "@/lib/supabase";
import { UserContextType, UserSchema } from "@/schema";
import React, { useContext } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { decode } from 'base64-arraybuffer'
import useNotification from "./useNotification";


const useUserProvider = () => {
   const { isAuthenticated, updateState, user } = useContext<UserContextType>(UserContext);
   const {registerUserIdForNotification} = useNotification();

   const performOAuth = async (provider: "google" | "github" | "facebook") => {
      const redirectTo = makeRedirectUri();
      const { data, error } = await supabase.auth.signInWithOAuth({
         provider: provider,
         options: { redirectTo },
      });
      if (error) throw error;

      const res = await WebBrowser.openAuthSessionAsync(
         data?.url ?? "",
         redirectTo
      );

      if (res.type === "success") {
         const { url } = res;
         try {
            const session = await createSessionFromUrl(url);
            const userId = session?.user?.id;
            const fullName = session?.user?.user_metadata?.full_name || "Unknown";

            if (!userId) {
               console.error("User ID is undefined");
               return;
            }
            console.log(userId + "in oauth ");
            await registerUserIdForNotification(userId);
            const { data: existingUser, count, error } = await supabase
               .from("UsersProfile")
               .select("*")
               .eq("id", userId)
               .single();

            if (count === 0 || error) {
               const { error: insertError, data: userData } = await supabase
                  .from("UsersProfile")
                  .insert({
                     id: userId,
                     first_name: fullName,
                  })
                  .select("*")
                  .single();

               if (insertError) {
                  console.error("Error inserting new user:", insertError.message);
                  await supabase.auth.signOut();
                  router.replace("/(auth)/login");
               } else {
                  updateState((prev) => ({
                     ...prev,
                     isAuthenticated: true,
                     user: userData as UserSchema,
                  }));
                  router.replace({ pathname: '/(auth)/Completeprofile' });
               }
            } else if (!error) {
               updateState((prev) => ({
                  ...prev,
                  isAuthenticated: true,
                  user: existingUser as UserSchema,
               }));
               router.replace({ pathname: '/(root)/(tabs)/home' });
            } else {
               await supabase.auth.signOut();
               console.log("Can't get the users data ", error);
               router.replace("/(auth)/login");
            }
         } catch (err) {
            console.error("Error during authentication:", err);
         }
      }
   };

   const updateUserProfile = (data: { gender: string, weight: number, height: number, date_of_birth: Date, age: number } | { genre: string } | { fav_artist: string }) => {
      updateState(pre => ({
         ...pre,
         user: {
            ...pre.user!,
            ...data,
         }
      }));
   }
   const submitUserProfile = async () => {
      const { id, ...rest } = user!
      const { data: updatedUser, error } = await supabase.from("UsersProfile").update(rest).eq("id", user?.id).select("*").single();
      if (!error) {
         updateState(pre => ({
            ...pre,
            isAuthenticated: true,
            user: updatedUser as UserSchema
         }));
      } else {
         Alert.alert("Can't update the profile of user update later" + error);
         console.log(error)
      }
   }

   async function singUpUser(userData: { first_name: string, last_name: string, email: string, password: string }): Promise<void> {
      const { data, error } = await supabase.auth.signUp({
         email: userData.email,
         password: userData.password,
      });

      if (error || !data.user?.id) {
         Alert.alert("Someone is Already register with this credencial !");
         return;
      }
      const { data: newUser, error: creationError } = await supabase.from("UsersProfile").insert({ id: data.user!.id }).select("*").single();
      if (creationError) {
         Alert.alert("Can't create user in the user table");
         return;
      } else {
         updateState(pre => ({
            ...pre,
            user: {
               ...pre.user!,
               id: data.user!.id,
               first_name: userData.first_name,
               last_name: userData.last_name,
            }
         }));
      }
   }

   const displayNameForUser = user?.first_name + " " + (user?.last_name || '')

   const singInWithEmailAndPassword = async (userDate: { email: string, password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword(userDate);
      if (error) {
         Alert.alert("Please Enter Valid Crediencials to login !");
         return;
      } else {
         const { data: userDetailes, error: fetchError } = await supabase.from("UsersProfile").select("*").eq("id", data.user.id).single();

         if (fetchError) {
            Alert.alert("Can't fetch the your credencials retry again ");
         } else {
            await registerUserIdForNotification(data.user.id);
            updateState(pre => ({
               ...pre,
               isAuthenticated: true,
               user: {
                  ...userDetailes as UserSchema
               }
            }));
            router.replace("/(root)/(tabs)/home");
         }
      }
   }

   const logout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         throw Error(error.message ?? error.cause ?? "Logging out user failed!");
      } else {
         updateState((prev) => ({
            ...prev,
            isAuthenticated: false,
            user: null,
         }));
         router.replace("/(auth)/login");
         return;
      }
   }

   const resetPassword = async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) {
         console.log(error);
         Alert.alert(error.message ?? error.cause ?? "Can't reset the password now");
      }
      return;
   }
   const validateOTP = async (email: string, password: string, otpCode: string) => {
      const { data, error } = await supabase.auth.verifyOtp({ email, type: "email", token: otpCode });
      if (error) {
         console.log(error);
         throw Error(error.message ?? error.cause ?? "Enter an Valid otp");
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
         console.log(updateError);
         Alert.alert("Can't Update the user Password for some reason !");
         return;
      }
      Alert.alert("Password has been changed! ");
      router.replace("/(auth)/login");
      return;
   }

   const uploadProfilePicture = async (base64String: string, contentType: string, fileName: string) => {
      const { data, error } = await supabase
         .storage
         .from('avatar')
         .upload(user!.id!, decode(base64String), {
            contentType,
            upsert: true,
         },);
      if (error) {
         console.log(error);
         Alert.alert(error.message ?? error.cause ?? "Can't upload the image ");
         return;
      }
      const update = await supabase.from("UsersProfile").update({"avatar":user!.id!}).eq("id",user!.id!);
      if(update.error){
         throw Error(update.error.message );
      }
      updateState(pre=>({
         ...pre,
         user : {
            ...pre.user!,
            avatar : user!.id!
         }
      }))
      return;
   }

   const setUserLocation = async (coordinates:{latitude:number,longitude:number})=>{
      const {error} = await supabase.from("UsersProfile").update(coordinates).eq("id",user?.id);
      if(error){
         console.log(error);
         throw Error(error.message??error.cause??"Can't update users coordinates now !");
      }
      updateState(pre=>({
         ...pre,
         user : {
            ...pre.user!,
            latitude : coordinates.latitude,
            longitude : coordinates.longitude
         }
      }));
   }  

   return {
      isAuthenticated,
      user,
      displayNameForUser,
      uploadProfilePicture,
      logout,
      performOAuth,
      updateUserProfile,
      submitUserProfile,
      singUpUser,
      resetPassword,
      validateOTP,
      setUserLocation,
      singInWithEmailAndPassword
   };
};


const createSessionFromUrl = async (url: string) => {
   const { params, errorCode } = QueryParams.getQueryParams(url);

   if (errorCode) throw new Error(errorCode);
   const { access_token, refresh_token } = params;

   if (!access_token) return;

   const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
   });
   if (error) throw error;
   return data.session;
};

export default useUserProvider;
