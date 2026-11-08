"""
Comprueba qué parques naturales atraviesa una ruta GPX.

Uso: python3 CheckRoute.py <ruta.gpx> <directorio_geojson>

Escribe en stdout un JSON con:
  - parks: nombres (fichero sin extensión) de los parques que atraviesa la ruta
  - intersections: {parque: GeoJSON MultiLineString con los tramos dentro del parque}

Códigos de salida: 0 OK, 1 error interno, 2 GPX inválido.
Los mensajes de diagnóstico van a stderr para no romper el JSON de stdout.
"""
import json
import os
import sys

import geopandas as gpd
import gpxpy
import pandas as pd


def log(msg):
    print(msg, file=sys.stderr)


def load_points(gpx_path):
    with open(gpx_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Un GPX legítimo no necesita DTD ni entidades. Rechazarlos evita ataques XML
    # (expansión de entidades tipo "billion laughs", entidades externas) antes de parsear.
    if '<!DOCTYPE' in content.upper() or '<!ENTITY' in content.upper():
        raise ValueError("el GPX contiene una declaración DOCTYPE/ENTITY")

    gpx = gpxpy.parse(content)

    # Extract the points from the GPX route file
    points = [(point.latitude, point.longitude)
              for track in gpx.tracks
              for segment in track.segments
              for point in segment.points]

    df_points = pd.DataFrame(points, columns=['latitude', 'longitude'])
    gdf_points = gpd.GeoDataFrame(df_points, geometry=gpd.points_from_xy(df_points.longitude, df_points.latitude))
    gdf_points.crs = 'EPSG:4326'  # Ensure that the CRS is correctly defined
    return gdf_points


def segments_inside(gdf_points, within):
    """Agrupa los puntos consecutivos dentro del parque en tramos [[lon, lat], ...]."""
    segments = []
    current = []
    for (_, row), inside in zip(gdf_points.iterrows(), within):
        if inside:
            current.append([row['longitude'], row['latitude']])
        elif current:
            segments.append(current)
            current = []
    if current:
        segments.append(current)
    # Una LineString necesita al menos dos puntos
    return [s for s in segments if len(s) >= 2]


def main():
    if len(sys.argv) != 3:
        log("Uso: CheckRoute.py <ruta.gpx> <directorio_geojson>")
        return 1

    gpx_path, geojson_dir = sys.argv[1], sys.argv[2]

    try:
        gdf_points = load_points(gpx_path)
    except Exception as e:
        log(f"Error al parsear el archivo GPX: {e}")
        return 2

    if gdf_points.empty:
        log("El archivo GPX no contiene puntos de track")
        return 2

    if not os.path.isdir(geojson_dir):
        log(f"Error: The folder was not found at the path: {geojson_dir}")
        return 1

    parks = []
    intersections = {}

    for geojson_file in sorted(f for f in os.listdir(geojson_dir) if f.endswith('.json')):
        park_name = os.path.splitext(geojson_file)[0]
        try:
            gdf_park = gpd.read_file(os.path.join(geojson_dir, geojson_file))
            park_polygon = gdf_park.geometry.union_all()

            within = gdf_points.within(park_polygon)

            # Verificar si algún punto de la ruta está dentro del parque
            if within.any():
                parks.append(park_name)
                segments = segments_inside(gdf_points, within)
                if segments:
                    intersections[park_name] = {"type": "MultiLineString", "coordinates": segments}
        except Exception as e:
            log(f"Error al procesar el archivo {geojson_file}: {e}")

    reservas = check_reserve_zones(gdf_points, os.path.join(geojson_dir, 'reserva_A'), parks)

    print(json.dumps({"parks": parks, "intersections": intersections, "reservas": reservas}))
    return 0


def check_reserve_zones(gdf_points, reserve_dir, parks):
    """Zonas de reserva (A) de la zonificación oficial que atraviesa la ruta, solo de los parques detectados.

    Devuelve {parque: {"subzonas": [...], "intersections": MultiLineString}}.
    """
    reservas = {}
    if not os.path.isdir(reserve_dir):
        return reservas
    for park_name in parks:
        path = os.path.join(reserve_dir, f'{park_name}_A.json')
        if not os.path.isfile(path):
            continue
        try:
            gdf_zones = gpd.read_file(path)
            subzonas = []
            inside_any = None
            for _, zone in gdf_zones.iterrows():
                within = gdf_points.within(zone.geometry)
                if within.any():
                    subzonas.append({"subzona": zone.get('subzona'), "descripcion": zone.get('descripcion')})
                    inside_any = within if inside_any is None else (inside_any | within)
            if subzonas:
                segments = segments_inside(gdf_points, inside_any)
                reservas[park_name] = {"subzonas": subzonas}
                if segments:
                    reservas[park_name]["intersections"] = {"type": "MultiLineString", "coordinates": segments}
        except Exception as e:
            log(f"Error al procesar la zona de reserva de {park_name}: {e}")
    return reservas


if __name__ == "__main__":
    sys.exit(main())
