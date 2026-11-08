import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from '../config';
import { formatParkName } from './ParkNameFormatter';

// Zonificación oficial de los PORN vigentes (REDIAM), un GeoJSON por parque. Se cargan bajo demanda.
const reservaAFiles = import.meta.glob('../assets/coordinates/reserva_A/*.json', { import: 'default' });
const zonificacionFiles = import.meta.glob('../assets/coordinates/zonificacion/*.json', { import: 'default' });

// Color por zona: A reserva, B regulación especial, C regulación común; el resto (D, E, H, SU...) en gris
const ZONE_COLORS = { A: '#c4622d', B: '#c9a227', C: '#649277' };
const zoneColor = (zona) => ZONE_COLORS[zona?.[0]?.toUpperCase()] ?? '#8a8f8b';

const zonePopup = (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(
        `<strong>${formatParkName(p.parque)}</strong><br>Zona ${p.subzona}: ${p.descripcion}` +
        `<br><small>${p.superficie_ha.toLocaleString('es-ES')} ha · ${p.plan}</small>`
    );
};

// Rellena un grupo de capas con todos los GeoJSON de un import.meta.glob la primera vez que se pide
const lazyGroup = (files, style) => {
    const group = L.layerGroup();
    let loaded = null;
    group.load = () => {
        loaded ??= Promise.all(Object.values(files).map((load) => load())).then((datasets) => {
            for (const data of datasets) {
                group.addLayer(L.geoJSON(data, { style, onEachFeature: zonePopup }));
            }
        });
        return loaded;
    };
    return group;
};

export const initializeMap = async (setMap) => {
    const initializedMap = L.map('map', { zoomControl: false }).setView([37.4, -4.5], 7);

    L.control.zoom({ position: 'bottomright' }).addTo(initializedMap);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Zonificación: REDIAM, Junta de Andalucía'
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

    const perimetersALayerGroup = lazyGroup(reservaAFiles, {
        color: '#a54d20',
        weight: 1.5,
        dashArray: '4 4',
        fillColor: '#c4622d',
        fillOpacity: 0.1,
    });

    const zonificacionLayerGroup = lazyGroup(zonificacionFiles, (feature) => ({
        color: zoneColor(feature.properties.zona),
        weight: 1,
        fillColor: zoneColor(feature.properties.zona),
        fillOpacity: 0.18,
    }));

    perimetersLayerGroup.addTo(initializedMap);
    // Las zonas A se descargan en segundo plano para que estén listas al activarlas
    perimetersALayerGroup.load();
    initializedMap.on('overlayadd', (e) => e.layer.load?.());

    L.control.layers(null, {
        "Parques naturales": perimetersLayerGroup,
        "Zonas de reserva A": perimetersALayerGroup,
        "Zonificación del PORN (A, B, C)": zonificacionLayerGroup,
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
