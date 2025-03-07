import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import useUserProvider from "@/hook/useUserProvider";
import DashBoardLayout from "@/components/DashBoardLayout";
import DashBoardHeader from "@/components/dashBoardHeader";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export default function ChatScreen() {
  const { userId } = useLocalSearchParams();
  const { user } = useUserProvider();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [receiverProfile, setReceiverProfile] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const recUserId = typeof userId === "string" ? userId.slice(0, -1) : "";

  // Fetch receiver's profile
  useEffect(() => {
    const fetchReceiverProfile = async () => {
      const { data, error } = await supabase
        .from("UsersProfile")
        .select("*")
        .eq("id", recUserId)
        .single();

      if (error) {
        console.error("Error fetching receiver profile:", error);
        return;
      }

      setReceiverProfile(data);
    };

    fetchReceiverProfile();
  }, [recUserId]);

  // Fetch existing messages and set up real-time subscription
  useEffect(() => {
    if (!user?.id || !recUserId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${user.id},receiver_id.eq.${recUserId}),` +
              `and(sender_id.eq.${recUserId},receiver_id.eq.${user.id})`
          )
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        console.log("Initial messages loaded:", data?.length || 0);
        setMessages(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error fetching messages:", err);
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up two separate subscriptions for better reliability
    const channel = supabase.channel("chat-updates");

    // Listen for messages sent by the current user
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("New message sent by me:", payload.new);
          setMessages((current) => {
            // Check if message already exists to prevent duplicates
            if (current.some((msg) => msg.id === payload.new.id)) {
              return current;
            }
            return [...current, payload.new as Message];
          });
        }
      )
      // Listen for messages received by the current user
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("New message received:", payload.new);
          setMessages((current) => {
            // Check if message already exists to prevent duplicates
            if (current.some((msg) => msg.id === payload.new.id)) {
              return current;
            }
            return [...current, payload.new as Message];
          });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id, recUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !recUserId) return;

    try {
      const message = {
        sender_id: user.id,
        receiver_id: recUserId,
        content: newMessage.trim(),
      };

      console.log("Sending message:", message);

      // Optimistically add message to UI
      const tempMessage: Message = {
        ...message,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      setMessages((current) => [...current, tempMessage]);
      setNewMessage("");

      const { data, error } = await supabase
        .from("messages")
        .insert([message])
        .select();

      if (error) {
        console.error("Error sending message:", error);
        // Remove temp message if there was an error
        setMessages((current) =>
          current.filter((msg) => msg.id !== tempMessage.id)
        );
        return;
      }

      console.log("Message sent successfully:", data);

      // Replace the temp message with the actual message from the server
      setMessages((current) =>
        current.map((msg) => (msg.id === tempMessage.id ? data[0] : msg))
      );
    } catch (err) {
      console.error("Unexpected error sending message:", err);
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [date: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    const result: { date: string; data: Message[] }[] = [];
    Object.keys(groups).forEach((date) => {
      result.push({ date, data: groups[date] });
    });

    return result;
  };

  const renderDateHeader = (date: string) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

    let displayDate = date;
    if (date === today) {
      displayDate = "Today";
    } else if (date === yesterday) {
      displayDate = "Yesterday";
    }

    return (
      <View className="flex items-center justify-center my-3">
        <View className="bg-gray-200 px-3 py-1 rounded-full">
          <Text className="text-xs text-gray-600 font-medium">
            {displayDate}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMyMessage = item.sender_id === user?.id;
    const showAvatar =
      !isMyMessage &&
      (index === 0 || messages[index - 1]?.sender_id !== item.sender_id);
    const isLastInGroup =
      index === messages.length - 1 ||
      messages[index + 1]?.sender_id !== item.sender_id;

    // Format time
    const messageTime = new Date(item.created_at);
    const formattedTime = messageTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        className={`flex-row ${
          isMyMessage ? "justify-end" : "justify-start"
        } mb-1`}
      >
        {!isMyMessage && showAvatar ? (
          <View className="mr-2 mt-1">
            <View className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
              {receiverProfile?.avatar_url ? (
                <Image
                  source={{ uri: receiverProfile.avatar_url }}
                  className="h-full w-full"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Text className="text-sm font-bold text-gray-500">
                    {receiverProfile?.first_name?.[0] || "?"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          !isMyMessage && <View className="w-10" />
        )}

        <View
          className={`rounded-2xl px-4 py-2 max-w-[75%] ${
            isMyMessage
              ? "bg-indigo-600 rounded-tr-none"
              : "bg-gray-100 rounded-tl-none"
          } ${isLastInGroup ? "mb-2" : "mb-1"}`}
        >
          <Text
            className={`${
              isMyMessage ? "text-white" : "text-gray-800"
            } text-base`}
          >
            {item.content}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isMyMessage ? "text-indigo-200" : "text-gray-500"
            } text-right`}
          >
            {formattedTime}
            {isMyMessage && (
              <Text className="ml-1">
                {" "}
                <Feather
                  name="check-circle"
                  size={12}
                  color={isMyMessage ? "#c7d2fe" : "#9ca3af"}
                />
              </Text>
            )}
          </Text>
        </View>
      </View>
    );
  };

  // Custom header component
  const ChatHeader = () => (
    <View className="py-3 px-4 border-b border-gray-100 bg-white flex-row items-center justify-between">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Feather name="arrow-left" size={24} color="#4f46e5" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <View className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
            {receiverProfile?.avatar_url ? (
              <Image
                source={{ uri: receiverProfile.avatar_url }}
                className="h-full w-full"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Text className="text-lg font-bold text-gray-500">
                  {receiverProfile?.first_name?.[0] || "?"}
                </Text>
              </View>
            )}
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800">
              {`${receiverProfile?.first_name || ""} ${
                receiverProfile?.last_name || ""
              }`}
            </Text>
            {isTyping ? (
              <Text className="text-xs text-indigo-600">Typing...</Text>
            ) : (
              <Text className="text-xs text-gray-500">Online</Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row">
        <TouchableOpacity className="p-2">
          <Feather name="phone" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Feather name="more-vertical" size={20} color="#4f46e5" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main content depends on loading state
  const MainContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center bg-gray-50">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-gray-500 mt-3">Loading messages...</Text>
        </View>
      );
    }

    const groupedMessages = groupMessagesByDate();

    return (
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Feather name="message-circle" size={40} color="#d1d5db" />
            <Text className="text-gray-400 mt-2 text-center">
              No messages yet.{"\n"}Start the conversation!
            </Text>
          </View>
        }
        ListHeaderComponent={
          messages.length > 0 ? (
            <View className="items-center justify-center mb-4">
              <View className="bg-gray-100 px-4 py-2 rounded-full">
                <Text className="text-xs text-gray-500">
                  {new Date(messages[0].created_at).toLocaleDateString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ChatHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 10}
      >
        <MainContent />
        <View className="border-t border-gray-100 p-3">
          <View className="flex-row items-end">
            <TouchableOpacity className="p-2 mr-1">
              <Feather name="plus-circle" size={22} color="#6366f1" />
            </TouchableOpacity>
            <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 min-h-[50px]">
              <TextInput
                className="flex-1 text-gray-800 max-h-[150px]"
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                style={{ fontSize: 15 }}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {newMessage.trim() ? (
              <TouchableOpacity
                onPress={sendMessage}
                className="bg-indigo-600 rounded-full p-3 h-[40px] w-[40px] items-center justify-center"
              >
                <Feather name="send" size={18} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="p-2">
                <Feather name="mic" size={22} color="#6366f1" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
