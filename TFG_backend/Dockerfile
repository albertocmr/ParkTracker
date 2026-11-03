# --- Fase 1: compilación con Maven ---
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /build

# Primero solo el pom para cachear las dependencias entre builds
COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# --- Fase 2: imagen de ejecución (JRE + Python para CheckRoute.py) ---
FROM eclipse-temurin:17-jre-jammy

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Dependencias de Python en un entorno virtual; queda primero en el PATH,
# así "python3" (parktracker.python) usa este entorno
COPY requirements.txt /tmp/requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r /tmp/requirements.txt
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

COPY src/scripts/CheckRoute.py /app/scripts/CheckRoute.py
COPY park_data /app/park_data
COPY --from=build /build/target/TFG_backend-0.0.1-SNAPSHOT.jar /app/TFG_backend.jar

# Usuario sin privilegios
RUN useradd --system --no-create-home parktracker
USER parktracker

# Expón el puerto en el que Spring Boot está corriendo
EXPOSE 8080

CMD ["java", "-jar", "/app/TFG_backend.jar"]
