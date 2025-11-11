import SafeScreen from "@/components/SafeScreen";
import { useAuthStore } from "@/store/authStore";
import { SplashScreen, Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts} from 'expo-font'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const { checkAuth, user, token } = useAuthStore(); 
  console.log(token)

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded])

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {

    if(!navigationState?.key || loading) return;

    const inAuthScreen = segments[0] === '(auth)';
    const isSignedIn = user && token;
    
    if(!inAuthScreen && !isSignedIn) router.replace('/(auth)');
    else if(isSignedIn && inAuthScreen) router.replace('/(tabs)');
  }, [user, token, segments, navigationState?.key, loading]); 


  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="(auth)"/>
        </Stack>
      </SafeScreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>
  );
}
