import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import technicalService from "../../services/technicalService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VisitInventory = () => {
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigation = useNavigation();

  const fetchVisits = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("AccessToken");
      const response = await technicalService.getVisits(accessToken);

      const data = response.data;
      if (data.exito) {
        data.datos.length > 0
          ? setVisits(data.datos)
          : setFeedbackMessage("Sin visitas registradas");
      } else {
        setFeedbackMessage(data.mensaje);
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVisits();
      return () => {
        setVisits([]);
      };
    }, [])
  );

  const renderVisit = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("Detalles", { id: item.id })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{item.cedula_director}</Text>
          <Text style={styles.subtitle}>
            Código Centro: {item.codigo_centro}
          </Text>
          <Text>Motivo: {item.motivo}</Text>
          <Text>Fecha: {item.fecha}</Text>
          <Text>Hora: {item.hora}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={visits}
        renderItem={renderVisit}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{feedbackMessage}</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Registrar Visita")}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Registrar Visita
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Mapa de Visitas")}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Mapa de Visitas
            </Button>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={() => {
          setIsLoading(true);
          fetchVisits();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 15,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContent: {
    height: 48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VisitInventory;
