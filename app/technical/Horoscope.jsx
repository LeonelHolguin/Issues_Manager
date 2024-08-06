import { Text, StyleSheet, View } from "react-native";

export function Horoscope() {
  return (
    <View style={styles.container}>
      <Text>Horoscope</Text>
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
