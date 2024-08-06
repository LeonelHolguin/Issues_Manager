import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import technicalService from "../../services/technicalService";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    lastName: Yup.string().required("El apellido es requerido"),
    email: Yup.string()
      .email("Debe ser un correo electrónico válido")
      .required("El correo electrónico es requerido"),
    cedula: Yup.string().required("La cédula es requerida"),
    phone: Yup.string().required("El teléfono es requerido"),
    birthDate: Yup.string().required("La fecha de nacimiento es requerida"),
    password: Yup.string().required("La contraseña es requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("La confirmación de contraseña es requerida"),
  });

  const handleDateConfirm = (date, setFieldValue) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setFieldValue("birthDate", formattedDate);
    setDatePickerVisibility(false);
  };
  const handleRegister = async (values, actions) => {
    setIsLoading(true);
    try {
      const data = {
        cedula: values.cedula,
        nombre: values.name,
        apellido: values.lastName,
        clave: values.password,
        correo: values.email,
        telefono: values.phone,
        fecha_nacimiento: values.birthDate,
      };

      const result = await technicalService.registererTechnical(data);

      if (result.data.exito) {
        actions.resetForm();
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Registro Exitoso",
          text2: "El técnico ha sido registrado con éxito.",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50,
          bottomOffset: 50,
        });
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Registro Fallido",
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
        text2: "Ocurrió un error al registrar el técnico",
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Registro</Text>
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          )}
          {!isLoading && (
            <Formik
              initialValues={{
                name: "",
                lastName: "",
                email: "",
                cedula: "",
                phone: "",
                birthDate: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={registerSchema}
              onSubmit={(values, actions) => handleRegister(values, actions)}
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
                    label="Nombre"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    style={styles.input}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                  <TextInput
                    label="Apellido"
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    error={touched.lastName && Boolean(errors.lastName)}
                    style={styles.input}
                  />
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                  <TextInput
                    label="Correo Electrónico"
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    style={styles.input}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
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
                    label="Teléfono"
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                    error={touched.phone && Boolean(errors.phone)}
                    style={styles.input}
                  />
                  {touched.phone && errors.phone && (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.datePickerContainer}
                    onPress={() => setDatePickerVisibility(true)}
                  >
                    <Text style={styles.dateText}>
                      {values.birthDate || "Fecha de Nacimiento"}
                    </Text>
                  </TouchableOpacity>
                  {touched.birthDate && errors.birthDate && (
                    <Text style={styles.errorText}>{errors.birthDate}</Text>
                  )}
                  <TextInput
                    label="Contraseña"
                    secureTextEntry
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    error={touched.password && Boolean(errors.password)}
                    style={styles.input}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  <TextInput
                    label="Confirmar Contraseña"
                    secureTextEntry
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    style={styles.input}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                  >
                    Registrarse
                  </Button>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(date) => handleDateConfirm(date, setFieldValue)}
                    onCancel={() => setDatePickerVisibility(false)}
                  />
                </>
              )}
            </Formik>
          )}
          <Toast />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
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
  datePickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 16,
    marginBottom: 10,
    justifyContent: "center",
  },
  dateText: {
    color: "#000",
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
});

export default RegisterScreen;
