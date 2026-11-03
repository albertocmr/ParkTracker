# Despliegue gratuito: Render (backend) + Aiven (MySQL) + Vercel (frontend)

## 1. Base de datos en Aiven

1. Crea una cuenta en [aiven.io](https://aiven.io) (no pide tarjeta).
2. **Create service → MySQL → Free plan**. Elige una región europea.
3. Cuando el servicio esté *Running*, copia de **Connection information**: `Host`, `Port`, `User` y `Password`.
4. La URL JDBC tiene esta forma (la base de datos por defecto se llama `defaultdb`):

   ```
   jdbc:mysql://<Host>:<Port>/defaultdb?sslMode=REQUIRED
   ```

La tabla `natural_parks` se crea sola al arrancar el backend y, si está vacía, se cargan los 23 parques
naturales (`ParkSeeder`).

> Aiven puede apagar los servicios gratuitos que lleven mucho tiempo sin uso. El ping del paso 4 lo evita.

## 2. Backend en Render

1. En [render.com](https://render.com): **New → Blueprint** y conecta el repositorio `albertocmr/ParkTracker`.
2. Render detecta `render.yaml` y pide las variables marcadas como secretas:
   - `SPRING_DATASOURCE_URL`: la URL JDBC del paso 1.
   - `SPRING_DATASOURCE_USERNAME`: el `User` de Aiven (normalmente `avnadmin`).
   - `SPRING_DATASOURCE_PASSWORD`: el `Password` de Aiven.
3. **Apply**. El primer build tarda varios minutos (Maven, GeoPandas y el archivo AppCDS).
4. Comprueba que responde: `https://<tu-servicio>.onrender.com/api/natural_parks` debe devolver los 23 parques.

Si el dominio del frontend cambia, actualiza `CORS_ALLOWED_ORIGINS` (admite varios separados por comas).

### Rendimiento en el plan gratuito (512 MB, 0,1 CPU)

Medido en local con los mismos límites:

| | |
|---|---|
| Arranque en frío | ~55 s |
| Memoria en reposo | ~150 MB |
| Análisis de una ruta | ~17 s |

## 3. Frontend en Vercel

1. En el proyecto de Vercel: **Settings → Environment Variables** → `PUBLIC_API_URL` = `https://<tu-servicio>.onrender.com`.
2. Vuelve a desplegar (**Deployments → Redeploy**): las variables `PUBLIC_*` se incrustan al compilar.

## 4. Mantenerlo despierto (opcional)

Render duerme el servicio gratuito tras 15 minutos sin tráfico. El workflow
`.github/workflows/keep-alive.yml` lo llama cada 10 minutos:

1. En GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**.
2. Nombre `BACKEND_URL`, valor `https://<tu-servicio>.onrender.com`.

Ten en cuenta:

- Un servicio despierto todo el mes consume ~720 de las 750 horas gratuitas de Render: no despliegues otro servicio gratuito en la misma cuenta.
- GitHub desactiva los workflows programados tras 60 días sin actividad en el repositorio; se reactivan desde la pestaña **Actions**.
- GitHub no garantiza la puntualidad de los cron, así que puede haber algún arranque en frío ocasional.
