import { config } from "./common";
import { useFetch } from "../components/common/useFetch";

const clgError = (error) => console.error(`service/technical: ${error}`);

const technicalQueries = {
  searchSchools: async (regional) => {
    try {
      const response = await useFetch({
        route: "minerd/centros",
        params: { regional },
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  registererTechnical: async (data) => {
    try {
      const { post } = config;
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const response = await useFetch({
        route: "def/registro",
        data: formData,
        ...post,
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  loginTechnical: async (data) => {
    try {
      const { post } = config;
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      const response = await useFetch({
        route: "def/iniciar_sesion",
        data: formData,
        ...post,
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  getNews: async () => {
    try {
      const response = await useFetch({
        route: "def/noticias",
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  getVisits: async (token) => {
    try {
      const response = await useFetch({
        route: "def/situaciones",
        params: { token },
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  registerVisit: async (formData) => {
    try {
      const { post } = config;
      const response = await useFetch({
        route: "minerd/registrar_visita",
        data: formData,
        ...post,
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  visitDetails: async ({ token, situacion_id }) => {
    try {
      const response = await useFetch({
        route: "def/situacion",
        params: { token, situacion_id },
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  changePassword: async ({ data }) => {
    try {
      const { put } = config;
      const response = await useFetch({
        route: "def/cambiar_clave",
        data,
        ...put,
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },

  recoveryPassword: async (data) => {
    try {
      const response = await useFetch({
        route: "def/recuperar_clave",
        params: data,
      });
      return response;
    } catch (error) {
      clgError(error);
    }
  },
};

export default technicalQueries;
