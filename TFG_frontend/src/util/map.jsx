import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from '../config';
import geojsonDataA from '../assets/coordinates/reserva_A/geojsonImportsA.js';

export const initializeMap = async (setMap) => {
    const initializedMap = L.map('map', { zoomControl: false }).setView([37.4, -4.5], 7);

    L.control.zoom({ position: 'bottomright' }).addTo(initializedMap);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(initializedMap);

    const geojsonData = await loadGeojsonDataFromBackend();

    const perimetersLayerGroup = L.layerGroup(
        Object.values(geojsonData).map((data) =>
            L.geoJSON(data, {
                style: {
                    color: '#335e48',
                    weight: 1.5,
                    fillColor: '#44765b',
                    fillOpacity: 0.12,
                },
            }),
        ),
    );

    const perimetersALayerGroup = L.layerGroup(
        Object.values(geojsonDataA).map((data) =>
            L.geoJSON(data, {
                style: {
                    color: '#a54d20',
                    weight: 1.5,
                    dashArray: '4 4',
                    fillColor: '#c4622d',
                    fillOpacity: 0.1,
                },
            }),
        ),
    );

    perimetersLayerGroup.addTo(initializedMap);

    L.control.layers(null, {
        "Parques naturales": perimetersLayerGroup,
        "Zonas de reserva A": perimetersALayerGroup,
    }, { position: 'topright' }).addTo(initializedMap);

    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(initializedMap);

    setMap(initializedMap);
}

export async function loadGeojsonDataFromBackend() {
    const response = await fetch(`${API_URL}/api/perimeters`);

    if (!response.ok) {
        console.warn("Error al obtener perímetros:", response.status, response.statusText);
        return {};
    }

    const data = await response.json();

    const geojsonData = {};

    for (const { perimeterfile } of data) {
        try {
            const module = await import(`../assets/coordinates/${perimeterfile}.json`);
            geojsonData[perimeterfile] = module.default;
        } catch (err) {
            console.warn(`No se pudo cargar el archivo para: ${perimeterfile}`, err);
        }
    }

    return geojsonData;
}
