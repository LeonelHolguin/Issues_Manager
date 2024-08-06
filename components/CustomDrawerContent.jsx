// components/CustomDrawerContent.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import LogoutButton from "./auth/LogoutButton";
import { useAuth } from "@/contexts/AuthContext";

const CustomDrawerContent = (props) => {
  const { isAuthenticated } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <DrawerItemList {...props} />
        <View style={styles.logoutButtonContainer}>
          {isAuthenticated ? <LogoutButton /> : <></>}
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButtonContainer: {
    marginTop: "auto",
    padding: 16,
  },
});

export default CustomDrawerContent;
