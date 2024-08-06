import { Text, StyleSheet, View } from "react-native";

export function TechnicalNews() {
  return (
    <View style={styles.container}>
      <Text>TechnicalNews</Text>
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
