import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import technicalService from "../../services/technicalService";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button, Card } from "react-native-paper";

export default function VisitDetail({ route }) {
  const [visitDetails, setVisitDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);

  const params = route.params;
  const defaultImage = require("../../assets/images/icon.png");

  const fetchVisitDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("AccessToken");
      const response = await technicalService.visitDetails({
        token: accessToken,
        situacion_id: params.id,
      });

      const data = response.data;
      if (data.exito) {
        setVisitDetails(data.datos);
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Obtención Fallida",
          text2: data.mensaje,
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50,
          bottomOffset: 50,
        });
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    const fileUri = `${FileSystem.cacheDirectory}audio_example.wav`;

    try {
      await FileSystem.writeAsStringAsync(fileUri, visitDetails.nota_voz, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });

      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir el audio:", error);
    }
  };

  const decodeBase64Image = async () => {
    if (visitDetails.foto_evidencia) {
      const uri = `${FileSystem.documentDirectory}image.jpg`;
      await FileSystem.writeAsStringAsync(uri, visitDetails.foto_evidencia, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImageUri(uri);
    } else {
      setImageUri(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVisitDetails();
      decodeBase64Image();
      return () => {
        setVisitDetails({});
        setImageUri(null);
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Image source={defaultImage} style={styles.image} />
            )}
          </View>
          <Text style={styles.text}>
            Cédula Director: {visitDetails.cedula_director}
          </Text>
          <Text style={styles.text}>
            Código Centro: {visitDetails.codigo_centro}
          </Text>
          <Text style={styles.text}>Motivo: {visitDetails.motivo}</Text>
          <Text style={styles.text}>Comentario: {visitDetails.comentario}</Text>
          <Text style={styles.text}>Fecha: {visitDetails.fecha}</Text>
          <Text style={styles.text}>Hora: {visitDetails.hora}</Text>
        </Card.Content>
        <Card.Actions>
          {visitDetails.nota_voz && (
            <Button mode="contained" onPress={handlePlayAudio}>
              Reproducir audio
            </Button>
          )}
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
    color: "#333",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
