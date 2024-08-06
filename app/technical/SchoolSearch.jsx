import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  FlatList,
} from "react-native";
import useSchools from "../../hooks/useSchools";

const SearchSchools = () => {
  const [regional, setRegional] = useState("");
  const { schools, loading, error, searchSchools } = useSchools();

  const handleSearch = () => {
    searchSchools(regional);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{item.nombre}</Text>
      </View>
      <Text style={styles.cardCode}>Código: {item.codigo}</Text>
      <Text style={styles.cardText}>Distrito: {item.distrito}</Text>
      <Text style={styles.cardText}>Regional: {item.regional}</Text>
      <Text style={styles.cardText}>Municipal: {item.d_dmunicipal}</Text>
      <Text style={styles.cardText}>Coordenadas: {item.coordenadas}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Escuelas</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese regional"
          value={regional}
          onChangeText={setRegional}
        />
        <Button
          title={!loading ? "Buscar" : "Buscando..."}
          disabled={loading}
          onPress={handleSearch}
          color="#007bff"
        />
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={schools}
        renderItem={renderItem}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={styles.resultsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#343a40",
  },
  searchContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  resultsContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardCode: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#007bff",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  cardText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 4,
  },
});

export default SearchSchools;
