import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import technicalService from "../../services/technicalService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const RegisterVisit = () => {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [base64Audio, setBase64Audio] = useState(null);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permiso denegado",
          text2: "No se puede obtener la ubicación sin permisos",
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const visitSchema = Yup.object().shape({
    cedula_director: Yup.string().required("La cédula es requerida"),
    codigo_centro: Yup.string().required("El código del centro es requerido"),
    motivo: Yup.string().required("El motivo es requerido"),
    comentario: Yup.string().required("El comentario es requerido"),
    fecha: Yup.string().required("La fecha es requerida"),
    hora: Yup.string().required("La hora es requerida"),
  });

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);

      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setBase64Image(base64String);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const base64String = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    setBase64Audio(base64String);
    setAudioUri(uri);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date, setFieldValue) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setFieldValue("fecha", formattedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (time, setFieldValue) => {
    const formattedTime = moment(time).format("HH:MM");
    setFieldValue("hora", formattedTime);
    hideTimePicker();
  };

  const handleRegisterVisit = async (values) => {
    setIsLoading(true);
    const accessToken = await AsyncStorage.getItem("AccessToken");

    const formData = new FormData();
    formData.append("cedula_director", values.cedula_director);
    formData.append("codigo_centro", values.codigo_centro);
    formData.append("motivo", values.motivo);
    formData.append("comentario", values.comentario);
    formData.append("fecha", values.fecha);
    formData.append("hora", values.hora);
    formData.append("latitud", location.coords.latitude.toString() ?? location);
    formData.append(
      "longitud",
      location.coords.longitude.toString() ?? location
    );
    formData.append("foto_evidencia", base64Image ?? "");
    formData.append("nota_voz", base64Audio ?? "");
    formData.append("token", accessToken);

    try {
      const result = await technicalService.registerVisit(formData);
      if (result.data.exito) {
        navigation.navigate("Visitas Registradas");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.data.mensaje,
        });
      }
    } catch (error) {
      console.error("Error submitting visit:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al registrar la visita",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrar Visita</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Formik
            initialValues={{
              cedula_director: "",
              codigo_centro: "",
              motivo: "",
              fecha: "",
              hora: "",
            }}
            validationSchema={visitSchema}
            onSubmit={(values) => handleRegisterVisit(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <>
                <TextInput
                  label="Cédula Director"
                  onChangeText={handleChange("cedula_director")}
                  onBlur={handleBlur("cedula_director")}
                  value={values.cedula_director}
                  error={
                    touched.cedula_director && Boolean(errors.cedula_director)
                  }
                  style={styles.input}
                />
                {touched.cedula_director && errors.cedula_director && (
                  <Text style={styles.errorText}>{errors.cedula_director}</Text>
                )}

                <TextInput
                  label="Código Centro"
                  onChangeText={handleChange("codigo_centro")}
                  onBlur={handleBlur("codigo_centro")}
                  value={values.codigo_centro}
                  error={touched.codigo_centro && Boolean(errors.codigo_centro)}
                  style={styles.input}
                />
                {touched.codigo_centro && errors.codigo_centro && (
                  <Text style={styles.errorText}>{errors.codigo_centro}</Text>
                )}

                <TextInput
                  label="Motivo"
                  onChangeText={handleChange("motivo")}
                  onBlur={handleBlur("motivo")}
                  value={values.motivo}
                  error={touched.motivo && Boolean(errors.motivo)}
                  style={styles.input}
                />
                {touched.motivo && errors.motivo && (
                  <Text style={styles.errorText}>{errors.motivo}</Text>
                )}

                <TextInput
                  label="Comentario"
                  onChangeText={handleChange("comentario")}
                  onBlur={handleBlur("comentario")}
                  value={values.comentario}
                  error={touched.comentario && Boolean(errors.comentario)}
                  style={styles.input}
                />
                {touched.comentario && errors.comentario && (
                  <Text style={styles.errorText}>{errors.comentario}</Text>
                )}

                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.dateTimeButton}
                >
                  <Text style={styles.dateTimeText}>
                    {values.fecha || "Seleccionar Fecha"}
                  </Text>
                </TouchableOpacity>
                {touched.fecha && errors.fecha && (
                  <Text style={styles.errorText}>{errors.fecha}</Text>
                )}
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={(date) => handleConfirmDate(date, setFieldValue)}
                  onCancel={hideDatePicker}
                />

                <TouchableOpacity
                  onPress={showTimePicker}
                  style={styles.dateTimeButton}
                >
                  <Text style={styles.dateTimeText}>
                    {values.hora || "Seleccionar Hora"}
                  </Text>
                </TouchableOpacity>
                {touched.hora && errors.hora && (
                  <Text style={styles.errorText}>{errors.hora}</Text>
                )}
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={(time) => handleConfirmTime(time, setFieldValue)}
                  onCancel={hideTimePicker}
                />

                <View style={styles.imagePickerContainer}>
                  <Button
                    mode="contained"
                    onPress={handleImagePicker}
                    style={styles.imagePickerButton}
                  >
                    Seleccionar Foto de Evidencia
                  </Button>
                  {image && (
                    <Image source={{ uri: image.uri }} style={styles.image} />
                  )}
                </View>

                <View style={styles.audioContainer}>
                  <Button
                    mode="contained"
                    onPress={recording ? stopRecording : startRecording}
                    style={styles.audioButton}
                  >
                    {recording ? "Detener Grabación" : "Iniciar Grabación"}
                  </Button>
                  {audioUri && (
                    <Text style={styles.audioText}>Nota de voz guardada</Text>
                  )}
                </View>

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                >
                  Enviar
                </Button>
              </>
            )}
          </Formik>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
  },
  dateTimeButton: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  dateTimeText: {
    color: "#007bff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 4,
  },
  imagePickerContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  imagePickerButton: {
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  audioContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  audioButton: {
    marginBottom: 12,
  },
  audioText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    marginTop: 20,
  },
});

export default RegisterVisit;
