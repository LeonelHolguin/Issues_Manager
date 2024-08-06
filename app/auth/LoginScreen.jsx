import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import technicalService from "../../services/technicalService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = Yup.object().shape({
    cedula: Yup.string().required("La cédula es requerida"),
    clave: Yup.string().required("La contraseña es requerida"),
  });

  const handleNavigate = () => {
    navigation.navigate("Recuperar Clave");
  };

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const result = await technicalService.loginTechnical(values);

      if (result.data.exito) {
        const data = result.data.datos;
        const userInfo = {
          Id: data.id,
          Name: data.nombre,
          LastName: data.apellido,
          Email: data.correo,
          Phone: data.telefono,
          BirthDate: data.fecha_nacimiento,
        };

        await AsyncStorage.setItem("UserInfo", JSON.stringify(userInfo));
        await AsyncStorage.setItem("AccessToken", data.token);
        setIsAuthenticated(true);
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Inicio de Sesión Fallido",
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
        text2: "Ocurrió un error al iniciar sesión",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 50,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}
        {!isLoading && (
          <Formik
            initialValues={{ cedula: "", clave: "" }}
            validationSchema={loginSchema}
            onSubmit={(values) => handleLogin(values)}
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
                  label="Contraseña"
                  secureTextEntry
                  onChangeText={handleChange("clave")}
                  onBlur={handleBlur("clave")}
                  value={values.clave}
                  error={touched.clave && Boolean(errors.clave)}
                  style={styles.input}
                />
                {touched.clave && errors.clave && (
                  <Text style={styles.errorText}>{errors.clave}</Text>
                )}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  mode="contained"
                  onPress={handleNavigate}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  Recuperar Clave
                </Button>
              </>
            )}
          </Formik>
        )}
        <Toast />
      </View>
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
});
