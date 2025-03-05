import React from "react";
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons";
import { router } from "expo-router";
import SocialLogin from "@/components/SocialLogin";
import useUserProvider from "@/hook/useUserProvider";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"


const LoginSchema = z.object({
  email: z.string({ required_error: "Email field is required " }).email({ message: "Enter a Valid Email Address" }),
  password: z.string({ required_error: "Password is required " })
});


const LoginPage = () => {
  type LoginType = z.infer<typeof LoginSchema>;

  const { isAuthenticated, singInWithEmailAndPassword } = useUserProvider();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema)
  });

  const handleFormSubmit = handleSubmit((formdata: LoginType) => {
    singInWithEmailAndPassword(formdata);
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full flex-1 gap-3">
        <View className="items-center gap-2 mb-10">
          <Text className="text-2xl font-Popping text-gray-700">Hey there</Text>
          <Text className="text-3xl font-Popping-Bold text-gray-900">
            Welcome Back
          </Text>
        </View>

        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange } }) => (
            <View className="w-full flex-col bg-offwhite rounded-xl px-4">
              <View className="flex flex-row w-full items-center p-2 font-Popping">
                <Image source={icons.Messageicon} className="opacity-60 w-5 h-5" />
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
              </View>
              <Text className="text-md text-red-500 font-Popping">{errors.email?.message}</Text>
            </View>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange } }) => (
            <View className="w-full flex-col bg-offwhite rounded-xl px-4">
              <View className="flex flex-row w-full items-center p-2 font-Popping">
                <Image source={icons.Lockicon} className="opacity-60 w-5 h-5" />
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              </View>
              <Text className="text-md text-red-500 font-Popping">{errors.password?.message}</Text>
            </View>
          )}
        />

        <Text className="text-center text-gray-500 text-sm">
          Forgot your password? <Text className="text-primarygreen font-bold" onPress={() => router.push("/(auth)/passwordReset")}>Reset</Text>
        </Text>
      </View>

      <View className="w-full items-center">
        <LinearGradient
          colors={["#FBC5C5", "#F8AC7D"]}
          start={{ x: 0.9, y: 0.02 }}
          end={{ x: 0.9, y: 0.91 }}
          className="w-full overflow-hidden rounded-full"
        >
          <TouchableOpacity
            className="p-4 rounded-full flex-row items-center justify-center"
            onPress={handleFormSubmit}
          >
            <Image
              source={icons.loginicon}
              className="h-6 w-6 mr-2 bg-transparent "
            />
            <Text className="text-white text-lg font-Popping-SemiBold">
              Login
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <View className="flex-row items-center my-5">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-gray-500">Or</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        <SocialLogin />

        <Text className="mt-5 text-md font-Popping-SemiBold text-gray-700">
          Don't have an account?{" "}
          <Text
            onPress={() => router.push("/(auth)/register")}
            className="text-primarygreen font-bold"
          >
            Register
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default LoginPage;
