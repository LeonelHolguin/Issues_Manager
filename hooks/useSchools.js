import { useState } from "react";
import technicalService from "../services/technicalService";

const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchSchools = async (regional) => {
    setSchools([]);
    setLoading(true);
    setError(null);
    try {
      const response = await technicalService.searchSchools(regional || "*");
      if (response.data.exito) {
        setSchools(response.data.datos);
      } else {
        setError(response.data.mensaje);
      }
    } catch (error) {
      setError("Error al buscar escuelas");
    } finally {
      setLoading(false);
    }
  };

  return { schools, loading, error, searchSchools };
};

export default useSchools;
