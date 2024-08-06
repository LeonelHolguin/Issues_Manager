import { Text, StyleSheet, View } from "react-native";

export function WeatherState() {
  return (
    <View style={styles.container}>
      <Text>WeatherState</Text>
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
