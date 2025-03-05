import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image, Modal } from 'react-native';
import React, { useState } from 'react';
import icons from '@/constants/icons';
import z from 'zod';
import useUserProvider from '@/hook/useUserProvider';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const EmailPasswordSchema = z.object({
    email: z.string().email("Provide a Valid Email"),
    password: z.string({ required_error: "Enter an Password" }).min(4, "Password must be 4 character long at least!")
})
type EmailPasswordType = z.infer<typeof EmailPasswordSchema>
export default function PasswordReset() {

    const { control, formState: { errors, },getValues, handleSubmit, reset } = useForm<EmailPasswordType>({
        resolver: zodResolver(EmailPasswordSchema)
    })
    const [show, setShow] = useState<boolean>(false);
    const {resetPassword} = useUserProvider();

    const handlePasswordReset = handleSubmit((formdata:EmailPasswordType)=>{
        resetPassword(formdata.email);
        setShow(true);

    })

    return (
        <View className="flex flex-1 justify-center items-center px-4 bg-white">
            {/* Title */}
            <Text className="text-2xl font-bold text-gray-800">Reset Password</Text>

            {/* Input Field */}
            <Controller
                control={control}
                name='email'
                render={({ field: { value, onChange } }) => (
                    <View className="w-full mt-6">
                        <TextInput
                            keyboardType="email-address"
                            placeholder="Enter your email"
                            placeholderTextColor="#999"
                            value={value}
                            onChangeText={val => onChange(val)}
                            className="border border-gray-300 rounded-md p-3 w-full text-lg"
                        />
                        <Text className="text-md text-red-500 font-Popping">{errors.email?.message}</Text>
                    </View>
                )}
            />

            <Controller
                control={control}
                name='password'
                render={({ field: { value, onChange } }) => (
                    <View className="w-full">
                        <TextInput
                            keyboardType="default"
                            placeholder="Enter new Password"
                            placeholderTextColor="#999"
                            value={value}
                            onChangeText={val => onChange(val)}
                            className="border border-gray-300 rounded-md p-3 w-full text-lg"
                        />
                        <Text className="text-md text-red-500 font-Popping">{errors.password?.message}</Text>
                    </View>
                )}
            />
            <ImageBackground
                source={icons.orangeBackgroundicon}
                className="mt-6 w-full py-3 overflow-hidden"
            >
                <Text onPress={handlePasswordReset} className="text-white text-center text-lg font-semibold w-full">Send OTP</Text>
            </ImageBackground>
            <OTPModal setShow={setShow} show={show} userData={getValues()}/>
        </View>
    );
}

interface MyModalProps {
    show: boolean,
    userData:EmailPasswordType,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const OTPModal = ({ show, setShow,userData }: MyModalProps) => {
    const [otp, setOtp] = useState<string>('');
    const [otpError, setOTPError] = useState<string>('');
    const { validateOTP } = useUserProvider();

    const handleVerify = () => {
        if (otp.length === 6) {
            try {
                console.log(userData);
                validateOTP(userData.email,userData.password,otp);
                setShow(false);
            } catch (err) {
                setOTPError("Enter an valid otp code!");
            }
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            onRequestClose={() => setShow(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-2xl p-6 w-80 items-center shadow-lg">
                    <Image source={icons.otpicon} className="w-16 h-16 mb-4" />
                    <Text className="font-JakartaBold text-black text-lg mb-2">Enter OTP</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                        We've sent an OTP to your email
                    </Text>
                    <TextInput
                        placeholder="OTP"
                        className="border border-gray-300 rounded-full px-4 py-2 mb-4 w-full text-center text-lg"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                    />
                    {otpError && <Text className="text-red-500 text-xs">{otpError}</Text>}
                    <TouchableOpacity
                        className={`py-3 rounded-full w-full ${otp.length === 6 ? 'bg-blue-500' : 'bg-gray-300'}`}
                        onPress={handleVerify}
                        disabled={otp.length !== 6}
                    >
                        <Text className="text-white text-center font-JakartaBold text-lg">
                            Verify
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShow(false)} className="mt-3">
                        <Text className="text-gray-500 text-sm">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
