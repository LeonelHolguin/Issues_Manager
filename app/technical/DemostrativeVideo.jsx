import { Text, StyleSheet, View } from "react-native";

export function DemostrativeVideo() {
  return (
    <View style={styles.container}>
      <Text>DemostrativeVideo</Text>
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
