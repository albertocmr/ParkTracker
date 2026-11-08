
import * as toGeoJSON from '@mapbox/togeojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatParkName } from './ParkNameFormatter';

// Lee un archivo GPX, lo dibuja en el mapa y encuadra la vista sobre la ruta.
// notify(tipo, mensaje) informa al usuario sin bloquear la página.
export const addGPXToMap = (file, map, setSelectedGPXFile, gpxLayers, setGpxLayers, notify) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.gpx')) {
        notify('error', 'El archivo debe tener extensión .gpx.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, 'application/xml');
        const geojson = toGeoJSON.gpx(xml);
        gpxLayers.forEach((layer) => map.removeLayer(layer));

        try {
            const gpxLayer = L.geoJSON(geojson, {
                style: {
                    color: '#1f3a2e',
                    weight: 3,
                    opacity: 0.9,
                },
                onEachFeature: (feature, layer) => {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(feature.properties.name);
                    }
                },
            }).addTo(map);

            const bounds = gpxLayer.getBounds();
            if (!bounds.isValid()) {
                map.removeLayer(gpxLayer);
                notify('error', 'El archivo no contiene ningún track que se pueda dibujar.');
                return;
            }

            map.fitBounds(bounds, { padding: [40, 40] });
            setSelectedGPXFile(file);
            setGpxLayers([gpxLayer]);
            notify('success', `Ruta «${file.name}» cargada en el mapa.`);
        } catch (error) {
            console.error("Error adding the GPX file to the map:", error);
            notify('error', 'No se ha podido leer el archivo GPX.');
        }
    };
    reader.readAsText(file);
};

export const removeGPXLayers = (map, gpxLayers, setGpxLayers) => {
    gpxLayers.forEach((layer) => {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    });
    setGpxLayers([]);
}

// Dibuja los tramos de la ruta que caen dentro de cada parque y, encima, los que entran
// en sus zonas de reserva (A), tal y como los devolvió el análisis (GeoJSON por parque).
export const addIntersectionsToMap = (map, intersections, reservas, setGpxLayers, notify) => {
    if (!map) return;

    const entries = Object.entries(intersections || {});
    if (entries.length === 0) {
        notify('info', 'No hay tramos dentro de parques naturales que mostrar.');
        return;
    }

    const group = L.featureGroup();
    for (const [park, geometry] of entries) {
        L.geoJSON(geometry, {
            style: {
                color: '#c4622d',
                weight: 6,
                opacity: 1,
                lineCap: 'round',
            },
        }).bindPopup(formatParkName(park)).addTo(group);
    }

    let enReserva = false;
    for (const [park, reserva] of Object.entries(reservas || {})) {
        if (!reserva.intersections) continue;
        enReserva = true;
        L.geoJSON(reserva.intersections, {
            style: {
                color: '#7a2e10',
                weight: 7,
                opacity: 1,
                dashArray: '2 10',
                lineCap: 'round',
            },
        }).bindPopup(`Zona de reserva (A) · ${formatParkName(park)}`).addTo(group);
    }

    group.addTo(map);
    map.fitBounds(group.getBounds(), { padding: [60, 60] });
    setGpxLayers((prev) => [...prev, group]);
    notify('success', enReserva
        ? 'Tramos resaltados en el mapa. Los punteados oscuros entran en una zona de reserva (A).'
        : 'Tramos dentro de parques naturales resaltados en el mapa.');
};
