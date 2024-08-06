import { Text, StyleSheet, View, Button } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigator = useNavigation();

  const navigateSi = () => {
    navigator.navigate("Escuelas");
  };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button title="navega" onPress={navigateSi} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
