import { SimilarUser } from "@/schema";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import DashBoardCard from "./DashBoardCard";

const InvitionsCard: React.FC<{
  invites: SimilarUser[];
}> = ({ invites }) => {
  return (
    <>
      {invites?.map((user) => (
        <DashBoardCard key={user?.id}>
          <DashBoardCard.BigIcon uri={user.avatar} />
          <DashBoardCard.Content
            component={
              <View className="flex-1 flex-row justify-between items-center">
                {/* Left: User Info */}
                <View className="flex-1 pr-2">
                  <Text className="text-ms font-Popping-SemiBold text-gray-800">{`${
                    user.first_name || ""
                  } ${user.last_name || ""}`}</Text>
                  <Text className="text-sm font-Popping text-gray-600">{`${(
                    (user.similarity_score || 0) * 100
                  ).toFixed(0)}% Match`}</Text>
                  <View>
                    <Text className="text-xs text-gray-500">
                      Genres: {user.genre || "Not specified"}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Artists: {user.fav_artist || "Not specified"}
                    </Text>
                  </View>
                </View>

                {/* Right: Action Buttons */}
                <View className="flex flex-col space-y-2 gap-3">
                  <TouchableOpacity className="bg-green-500 p-2 rounded">
                    <Text className="text-white text-sm font-Popping-SemiBold">
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-red-500 p-2 rounded">
                    <Text className="text-white text-sm font-Popping-SemiBold">
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        </DashBoardCard>
      ))}
    </>
  );
};

export default InvitionsCard;
