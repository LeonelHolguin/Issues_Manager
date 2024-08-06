import { Text, StyleSheet, View } from "react-native";

export function UserInfo() {
  return (
    <View style={styles.container}>
      <Text>Userinfo</Text>
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
