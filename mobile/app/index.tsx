import { useAuthStore } from "@/store/authStore";
import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { user, token, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>user {user?.username}</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Link href='./(auth)/'><Text>fkdfd</Text></Link>
    </View>
  );
}
