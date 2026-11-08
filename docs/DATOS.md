# Datos de los parques naturales

ParkTracker usa tres tipos de datos de cada parque: su **normativa** (lo que se puede hacer en él), su **perímetro** y sus **zonas de reserva**. Este documento explica de dónde salen y cómo actualizarlos.

## Normativa

### Dónde está

Un fichero JSON por parque en [`TFG_frontend/src/data/normativa/`](../TFG_frontend/src/data/normativa/), con el nombre del archivo de perímetro (`sierra_huetor.json`, `sierra_baza.json`…). De él salen:

- la ficha de cada parque (`/parques-naturales/<parque>`), generada en la build por [`[slug].astro`](../TFG_frontend/src/pages/parques-naturales/[slug].astro);
- las restricciones del resultado del análisis de una ruta, filtradas por el medio elegido.

Ambas usan el componente [`ParkRestrictions.jsx`](../TFG_frontend/src/components/ParkRestrictions.jsx).

### Formato

```json
{
  "parque": "sierra_baza",
  "plan": "Decreto 213/2025, de 23 de diciembre (PORN y PRUG)",
  "url": "https://www.juntadeandalucia.es/medioambiente/portal/.../parque-natural-sierra-baza",
  "consultado": "2026-11-08",
  "normas": [
    {
      "texto": "La circulación en bicicleta por senderos de uso exclusivamente peatonal y campo a través.",
      "medios": ["bike"],
      "regimen": "prohibida",
      "fuente": { "documento": "Decreto 213/2025, de 23 de diciembre (BOJA nº 251)", "pagina": 170 }
    }
  ]
}
```

| Campo | Valores |
|---|---|
| `medios` | `general` (normas generales), `motor`, `bike`, `hike`, `otras` (solo se ven sin elegir medio). Una norma puede afectar a varios. |
| `regimen` | `prohibida`, `autorizacion` (requiere autorización), `comunicacion_previa`, `condicion` (cómo debe hacerse la actividad) y `general`. La web agrupa las normas por régimen. |
| `fuente` | Documento oficial y página del PDF donde está la norma. `null` si no se pudo localizar en el texto. |
| `verificada` | Solo aparece, con `false`, en normas que no se han podido contrastar (PRUG de Doñana escaneado). |

### Fuentes

Los PORN y PRUG vigentes que publica la Junta de Andalucía en el [Portal Ambiental](https://www.juntadeandalucia.es/medioambiente/portal/areas-tematicas/espacios-protegidos/gestion-espacios-protegidos/porn-prug-planes-de-gestion/documentos-aprobados) y en el [BOJA](https://www.juntadeandalucia.es/eboja). El campo `url` de cada fichero enlaza la página oficial del parque.

Revisión completa: **8 de noviembre de 2026**. Situación de los planes en esa fecha:

| Parque | Plan vigente |
|---|---|
| Sierra de Baza | Decreto 213/2025 (plan nuevo) |
| Despeñaperros | Decreto 61/2026 (plan nuevo y ampliación del parque) |
| Montes de Málaga | Decreto 78/2025 (plan nuevo) |
| Bahía de Cádiz y Del Estrecho | Decreto 130/2024 (un decreto con los planes de ambos; también modifica el de Grazalema) |
| Sierra de Aracena, Sierra de Hornachuelos y Sierra Morena de Sevilla | Decreto 131/2024 (un decreto con los planes de los tres) |
| Doñana | Decreto 142/2016, modificado por Orden de 20 de octubre de 2026 |
| Resto | Plan indicado en el campo `plan` de su fichero |

Limitaciones conocidas:

- El PRUG de Doñana está publicado como imagen escaneada: sus normas de conducta con la fauna figuran con `"verificada": false`.
- Los anexos del plan de Sierras Subbéticas usan fuentes no legibles; se contrastó con el decreto publicado en el BOJA.
- El parque Sierra Norte de Sevilla se denomina oficialmente **Sierra Morena de Sevilla** desde el Decreto 131/2024. Su archivo sigue llamándose `sierra_norte_sevilla` para no cambiar las URL; el backend renombra el parque en las bases de datos existentes al arrancar ([`ParkSeeder`](../TFG_backend/src/main/java/com/gestion/backend/config/ParkSeeder.java)).

### Cómo actualizarla

1. En la página oficial del parque, comprueba si hay un decreto u orden más reciente que el indicado en `plan`.
2. En el PRUG (y en el PORN, que también regula usos), localiza el apartado de **actividades de uso público, turismo activo y ecoturismo**. Suele tener tres listas: actividades sujetas a autorización, a comunicación previa y prohibidas, más unas condiciones específicas para senderismo, bicicleta, vehículos a motor y acampada.
3. Edita el JSON del parque: una entrada por norma, con su régimen, los medios a los que afecta y la fuente (documento y página del PDF).
4. Actualiza `plan` y `consultado`.
5. Comprueba la ficha del parque en `/parques-naturales/<parque>` y el resultado del análisis de una ruta que lo atraviese.

Un cuidado especial con los decretos que aprueban los planes de varios parques a la vez (130/2024 y 131/2024): cada parque tiene sus propios anexos, y las listas se parecen mucho entre parques.

## Zonas de reserva y zonificación

### Dónde están

| Carpeta | Contenido | Quién la usa |
|---|---|---|
| `TFG_frontend/src/assets/coordinates/reserva_A/<parque>_A.json` y `TFG_backend/park_data/coordinates/reserva_A/` (idénticas) | Zonas de reserva (A, A1, A2…) de cada parque | Capa «Zonas de reserva A» del mapa y análisis de rutas (`CheckRoute.py`) |
| `TFG_frontend/src/assets/coordinates/zonificacion/<parque>.json` | Zonificación completa del PORN (A, B, C y otras) | Capa «Zonificación del PORN» del mapa, que se descarga solo al activarla |

Cada fichero es una `FeatureCollection` en EPSG:4326 con una entidad por subzona:

```json
{ "parque": "sierra_baza", "zona": "A", "subzona": "A1", "descripcion": "A1. Zonas de reserva de Tomillares dolomíticos o Blanquizares de Gor",
  "plan": "Decreto 213/2025, de 23 de diciembre", "fuente": "REDIAM…", "superficie_ha": 649.3 }
```

### Fuente

Capa oficial **Zonificación de los PORN vigentes** de la REDIAM (Junta de Andalucía), descargada el **8 de noviembre de 2026** de su servicio WFS:

```
https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_zonificacion_PORN_vigentes?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=ms:porn_vigentes&OUTPUTFORMAT=application/json
```

Ficha en el catálogo: [Andalucía, capa de zonificación de los PORN vigentes](https://portalrediam.cica.es/geonetwork/srv/api/records/35e8d56f-b286-40b1-b7d7-3fda4a21c441). La capa viene en ETRS89 UTM 30N y se convierte a EPSG:4326. Para que la web la pueda cargar, la geometría se simplifica con una tolerancia de 8 m en las zonas A y de 40 m en el resto, y las coordenadas se redondean a 5 decimales (≈1 m).

Resultado: 27 zonas de reserva en 22 parques. Montes de Málaga no tiene zona A en su plan de 2025.

A tener en cuenta en la versión descargada:

- **Despeñaperros**: la capa aún tiene la zonificación del plan de 2004; el Decreto 61/2026 amplía el parque y su nueva zonificación no está publicada en la REDIAM.
- **Los Alcornocales**: la capa usa la zonificación del Decreto 87/2004.
- La capa incluye un parque natural que ParkTracker no tiene: **La Breña y Marismas del Barbate** (Decreto 189/2025).

### Cómo se usa en el análisis

`CheckRoute.py` comprueba, para cada parque que atraviesa la ruta, si algún punto cae en su zona A (`reserva_A/<parque>_A.json`). La respuesta de `POST /api/routes/check` incluye entonces:

```json
"reservas": { "sierra_huetor": { "subzonas": [{ "subzona": "A", "descripcion": "A. Zonas de Reserva. Tomillares dolomíticos" }],
                                 "intersections": { "type": "MultiLineString", "coordinates": [...] } } }
```

El resultado muestra un aviso con las subzonas y las normas del parque que se refieren a las zonas de reserva, y el mapa resalta esos tramos.

### Cómo actualizarla

1. Descarga la capa con la petición WFS de arriba (unos 130 MB).
2. Conviértela por parque: filtra las entidades con `Figura = "Parque Natural"`, transforma de EPSG:25830 a EPSG:4326, simplifica y guarda las zonas A en `reserva_A/<parque>_A.json` (frontend y backend) y todas en `zonificacion/<parque>.json`. Usa los mismos nombres de archivo que los perímetros.
3. Comprueba en el mapa que las capas cargan y analiza una ruta que cruce una zona A.
4. Si cambia el número de zonas A, actualiza la cifra de la portada (`HomeComponent.jsx`).
