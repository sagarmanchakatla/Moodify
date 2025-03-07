import { TouchableOpacity, View, Text } from "react-native";

const RecentlyPlayedHeader: React.FC<{ time: string }> = ({ time }) => {
  return (
    <View className="flex-row justify-between px-4 mb-2">
      <Text className="text-lg font-Popping-Bold text-gray-900">{time}'s</Text>
      <TouchableOpacity>
        <Text className="text-md text-primarygray">See more</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecentlyPlayedHeader;
