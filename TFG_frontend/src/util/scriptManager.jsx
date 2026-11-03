import axios from 'axios';
import { API_URL } from '../config';

// Sube la ruta y la analiza en una sola petición: el backend devuelve
// los parques atravesados y los tramos de la ruta dentro de cada uno.
export const executeScriptPython = async (selectedGPXFile, setLoadingScript, setParksList, setIntersections, onDone, notify) => {
    if (!selectedGPXFile) {
        notify('error', 'Carga primero un archivo GPX.');
        return;
    }

    setLoadingScript(true);

    const formData = new FormData();
    formData.append("route", selectedGPXFile);

    try {
        const response = await axios.post(`${API_URL}/api/routes/check`, formData);
        const { parks, intersections } = response.data;

        if (!Array.isArray(parks)) {
            throw new Error("La API no devolvió una lista válida de parques.");
        }

        setParksList(parks);
        setIntersections(intersections || {});
        onDone();

    } catch (error) {
        if (error.response && error.response.status === 401) {
            notify('error', 'Necesitas iniciar sesión para analizar tu ruta.');
            return;
        }
        const detail = error.response?.data?.error || error.message;
        notify('error', `No se ha podido comprobar la ruta: ${detail}`);
    } finally {
        setLoadingScript(false);
    }
};
