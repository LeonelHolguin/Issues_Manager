import axios from "axios";

export const useFetch = async ({ route, method = "GET", data, params }) => {
  const url = `https://adamix.net/minerd/${route}.php`;

  const config = {
    url,
    method,
    data: method === "GET" ? undefined : data,
    params,
    responseType: "json",
    "Content-Type": "application/json",
    validateStatus: (status) => status >= 200 && status < 400,
  };

  if (method !== "GET" && data instanceof FormData) {
    config.headers = {
      "Content-Type": "multipart/form-data",
    };
  } else {
    config.headers = {
      "Content-Type": "application/json",
    };
  }

  return axios(config);
};

export default useFetch;
