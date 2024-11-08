import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { redirect } from "react-router-dom";

const useFetchWithToken = (initialUrl, options = {}) => {
    const { token } = useAuth();
    const [url, setUrl] = useState(initialUrl); // Estado para la URL
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refetch, setRefetch] = useState(0); // Contador para forzar refetch

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchOptions = {
                ...options, // Combina las opciones proporcionadas con las predeterminadas
                headers: {
                    ...options.headers, // Mantiene los encabezados proporcionados
                    'Authorization': token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json',
                },
            };

            const response = await fetch(process.env.REACT_APP_BACKEND_URL + url, fetchOptions);

            if (!response.ok) {
                if (response.status === 401) {
                    console.log('Token inválido, redirigiendo a login...');
                    // Manejo de redirección aquí si es necesario
                    window.location.href="/"
                }
                throw new Error('Error en la solicitud: ' + response.statusText);
            }

            const result = await response.json();
            
            
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(data);
        
        fetchData();
    }, [url, token, refetch]); // Dependencias para volver a ejecutar

    // Función para refetch
    const triggerRefetch = () => setRefetch((prev) => prev + 1);

    // Función para actualizar la URL
    const updateUrl = (newUrl) => {
        setUrl(newUrl);
        triggerRefetch(); // Opcionalmente, puedes refetch inmediatamente al cambiar la URL
    };

    return { data, loading, error, refetch: triggerRefetch, updateUrl };
};

export default useFetchWithToken;
