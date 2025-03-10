import useUserProvider from "@/hook/useUserProvider";
import { Redirect } from "expo-router";
import registerNNPushToken from "native-notify"


export default function Index() {
  const { isAuthenticated, displayNameForUser, user } = useUserProvider();
  registerNNPushToken(28086, '29XY8vCePJsgJa6bdkJguw');
  if (!isAuthenticated) {
    <Redirect href={'/(auth)/login'} />
  }
  return (
    <Redirect href={'/(root)/(tabs)/home'} />
  );
}
