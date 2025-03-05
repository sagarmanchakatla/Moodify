import useUserProvider from "@/hook/useUserProvider";
import { Redirect } from "expo-router";


export default function Index() {
  const {isAuthenticated} = useUserProvider();
  if(!isAuthenticated){
    <Redirect href={'/(auth)/login'}/>
  }
  return (
    <Redirect href={'/(root)/(tabs)/home'}/>
  );
}
