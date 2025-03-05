import React, { useState } from "react";
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RNPickerSelect from "react-native-picker-select";
import { router } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import image from "@/constants/image";
import icons from "@/constants/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useUserProvider from "@/hook/useUserProvider";

const UserProfile = z.object({
   gender: z.string({ required_error: "Select Gender field is required" }),
   date_of_birth: z.date({ required_error: "Date of Birth field is required" }),
   weight: z.number({ required_error: "Weight field is required" }),
   height: z.number({ required_error: "Height field is required" })
});

type UserProfileType = z.infer<typeof UserProfile>;

const ProfileCompletionScreen: React.FC = () => {
   const [isDate, setIsDate] = useState(false);
   const {updateUserProfile}  = useUserProvider();

   const { control, handleSubmit, setValue, formState: { errors,isValid } } = useForm<UserProfileType>({
      resolver: zodResolver(UserProfile),
      defaultValues: {
         date_of_birth: new Date(),
      },
   });

   const handleSubmitForm = handleSubmit((formData: UserProfileType) => {
      if(isValid){
         const age:number =  new Date().getFullYear() - formData.date_of_birth.getFullYear()
         updateUserProfile({...formData,age});;
         router.push("/(auth)/Genre");
      }else{
         console.log("not valid form")
      }
   });
   

   return (
      <View className="flex-1 bg-white items-center justify-center px-6">
         <Image
            source={image.SignUppng}
            resizeMode="contain"
            style={{ width: 350, height: 250 }}
         />

         <Text className="text-2xl font-Popping-Bold text-center">
            Let’s complete your profile
         </Text>
         <Text className="text-gray-500 text-center mt-1 font-Popping">
            It will help us to know more about you!
         </Text>

         <View className="flex-col w-full my-6 gap-3">
            <Controller
               control={control}
               name="gender"
               render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl w-full">
                     <Image source={icons.TwoUsericon} />
                     <RNPickerSelect
                        onValueChange={onChange}
                        items={[
                           { label: "Male", value: "male" },
                           { label: "Female", value: "female" },
                           { label: "Other", value: "other" },
                        ]}
                        placeholder={{ label: "Choose Gender", value: null }}
                        useNativeAndroidPickerStyle={true}
                        style={{
                           viewContainer: { flex: 1 },
                           inputIOS: { fontSize: 16, color: "#333", paddingLeft: 10 },
                           inputAndroid: { fontSize: 16, color: "#333", paddingLeft: 10 },
                        }}
                        value={value}
                     />
                  </View>
               )}
            />
            {errors.gender && <Text className="text-red-500 font-Popping">{errors.gender.message}</Text>}

            <Controller
               control={control}
               name="date_of_birth"
               render={({ field: { value } }) => (
                  <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl w-full">
                     <Image source={icons.Calandericon} />
                     <Text className="text-start p-3 font-Popping w-full" onPress={() => setIsDate(true)}>
                        {value ? value.toDateString() : "Select Date"}
                     </Text>
                     {isDate && (
                        <DateTimePicker
                           mode="date"
                           display="inline"
                           value={value || new Date()}
                           onChange={(event, selectedDate) => {
                              if (selectedDate) {
                                 setValue("date_of_birth", selectedDate);
                              }
                              setIsDate(false);
                           }}
                        />
                     )}
                  </View>
               )}
            />
            {errors.date_of_birth && <Text className="text-red-500 font-Popping">{errors.date_of_birth.message}</Text>}

            <Controller
               control={control}
               name="weight"
               render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl justify-between">
                     <Image source={icons.WeightScaleicon} />
                     <TextInput
                        placeholder="Your Weight"
                        keyboardType="numeric"
                        value={value?.toString()}
                        onChangeText={(text) => onChange(Number(text))}
                        className="flex-1 pl-3 text-lg"
                     />
                     <Text className="w-10 h-10 rounded-xl text-center align-middle text-red">
                        KG
                     </Text>
                  </View>
               )}
            />
            {errors.weight && <Text className="text-red-500 font-Popping">{errors.weight.message}</Text>}

            <Controller
               control={control}
               name="height"
               render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-gray-100 px-4 py-1 rounded-xl justify-between">
                     <Image source={icons.Swapicon} />
                     <TextInput
                        placeholder="Your Height"
                        keyboardType="numeric"
                        value={value?.toString()}
                        onChangeText={(text) => onChange(Number(text))}
                        className="flex-1 pl-3 text-lg text-black"
                     />
                     <Text className="w-10 h-10 rounded-xl text-center align-middle text-red">
                        CM
                     </Text>
                  </View>
               )}
            />
            {errors.height && <Text className="text-red-500 font-Popping">{errors.height.message}</Text>}
         </View>

         {/* Submit Button */}
         <LinearGradient
            colors={["#FBC5C5", "#F8AC7D"]}
            start={{ x: 0.9, y: 0.02 }}
            end={{ x: 0.9, y: 0.91 }}
            className="w-full rounded-md"
            style={{
               borderRadius: 50,
               overflow: "hidden",
            }}
         >
            <TouchableOpacity className="p-4 rounded-full" onPress={handleSubmitForm}>
               <Text className="text-white text-lg font-Popping-SemiBold text-center">
                  Next
               </Text>
            </TouchableOpacity>
         </LinearGradient>

      </View>
   );
};

export default ProfileCompletionScreen;
