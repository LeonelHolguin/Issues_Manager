import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import technicalService from "../../services/technicalService";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigation = useNavigation();

  const recoverySchema = Yup.object().shape({
    cedula: Yup.string().required("La cédula es requerida"),
    correo: Yup.string()
      .email("Debe ser un correo electrónico válido")
      .required("El correo electrónico es requerido"),
  });

  const handleRecovery = async (values) => {
    setIsLoading(true);
    try {
      const result = await technicalService.recoveryPassword(values);

      if (result.data.exito) {
        setModalMessage(result.data.mensaje);
        setModalVisible(true);
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Recuperación Fallida",
          text2: result.data.mensaje,
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50,
          bottomOffset: 50,
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "Ocurrió un error al recuperar la clave",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 50,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate("Iniciar Sesión");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Recuperar Clave</Text>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}
        {!isLoading && (
          <Formik
            initialValues={{ cedula: "", correo: "" }}
            validationSchema={recoverySchema}
            onSubmit={(values) => handleRecovery(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <TextInput
                  label="Cédula"
                  onChangeText={handleChange("cedula")}
                  onBlur={handleBlur("cedula")}
                  value={values.cedula}
                  error={touched.cedula && Boolean(errors.cedula)}
                  style={styles.input}
                />
                {touched.cedula && errors.cedula && (
                  <Text style={styles.errorText}>{errors.cedula}</Text>
                )}
                <TextInput
                  label="Correo Electrónico"
                  keyboardType="email-address"
                  onChangeText={handleChange("correo")}
                  onBlur={handleBlur("correo")}
                  value={values.correo}
                  error={touched.correo && Boolean(errors.correo)}
                  style={styles.input}
                />
                {touched.correo && errors.correo && (
                  <Text style={styles.errorText}>{errors.correo}</Text>
                )}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Recuperar
                </Button>
              </>
            )}
          </Formik>
        )}
        <Toast />
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Button onPress={handleCloseModal} mode="text" color="#007bff">
              Cerrar
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  buttonContent: {
    height: 48,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 4,
  },
  loader: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});
