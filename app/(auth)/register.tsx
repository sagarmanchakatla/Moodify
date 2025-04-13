import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SocialLogin from "@/components/SocialLogin";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import useUserProvider from "@/hook/useUserProvider";

// Validation Schema
const RegisterFormSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const { singUpUser } = useUserProvider()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit = handleSubmit((formData: RegisterFormType) => {
    if (isValid) {
      singUpUser(formData);
      router.replace("/(auth)/Completeprofile")
    }
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 30
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Title */}
      <View className="flex flex-col w-full items-center gap-2">
        <Text className="text-2xl font-Popping text-gray-700">Hey there</Text>
        <Text className="text-3xl font-Popping-Bold mb-5">Create an Account</Text>
      </View>

      {/* Input Fields */}
      <View className="flex flex-col gap-3 w-full justify-between items-center">
        <View className="flex w-full gap-5">
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full p-3 bg-offwhite rounded-xl text-md font-Popping-SemiLight"
                  placeholder="First Name"
                  onChangeText={onChange}
                  value={value}
                />
                {errors.first_name && (
                  <Text className="text-red-500 text-md mt-1">{errors.first_name.message}</Text>
                )}
              </View>
            )}
          />

          {/* Last Name */}
          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full p-3 bg-offwhite rounded-xl text-md font-Popping-SemiLight"
                  placeholder="Last Name"
                  onChangeText={onChange}
                  value={value}
                />
                {errors.last_name && (
                  <Text className="text-red-500 text-md mt-1">{errors.last_name.message}</Text>
                )}
              </View>
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full p-3 bg-offwhite rounded-xl text-md font-Popping-SemiLight"
                  placeholder="Email"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  value={value}
                />
                {errors.email && (
                  <Text className="text-red-500 text-md mt-1">{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full p-3 bg-offwhite rounded-xl text-md font-Popping-SemiLight"
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                />
                {errors.password && (
                  <Text className="text-red-500 text-md mt-1">{errors.password.message}</Text>
                )}
              </View>
            )}

          />
          {/* Checkbox for Policy Agreement */}
          <View className="flex-row items-center gap-2 mt-5">
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)} className="p-1">
              <MaterialIcons

                name={isChecked ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={isChecked ? "#F8AC7D" : "gray"}
              />
            </TouchableOpacity>
            <Text className="text-xs text-gray-500">
              By continuing, you accept our{" "}
              <Text className="text-pink-500 font-bold">Privacy Policy</Text> and{" "}
              <Text className="text-pink-500 font-bold">Terms of Use</Text>
            </Text>
          </View>
        </View>
      </View>


      {/* Register Button */}
      <View className="flex flex-col items-center w-full">
        <LinearGradient
          colors={["#FBC5C5", "#F8AC7D"]}
          start={{ x: 0.9, y: 0.02 }}
          end={{ x: 0.9, y: 0.91 }}
          className="w-full rounded-md mt-5"
          style={{
            borderRadius: 50,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity className="p-4 rounded-full" onPress={onSubmit}>
            <Text className="text-white text-lg font-Popping-SemiBold text-center">Register</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Divider */}
        <View className="flex-row items-center my-5">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-gray-500">Or</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        {/* Social Login Buttons */}
        <SocialLogin />

        {/* Login Link */}
        <Text className="mt-5 text-md font-Popping-SemiBold">
          Already have an account?{" "}
          <Text onPress={() => router.push("/(auth)/login")} className="text-primarygreen font-bold">
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
