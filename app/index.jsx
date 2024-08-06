import "react-native-gesture-handler";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthProvider } from "@/contexts/AuthContext";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
