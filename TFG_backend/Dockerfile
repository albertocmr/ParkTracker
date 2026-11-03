# --- Fase 1: compilación con Maven ---
FROM maven:3.9-eclipse-temurin-26-noble AS build

WORKDIR /build

# Primero solo el pom para cachear las dependencias entre builds
COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# --- Fase 2: imagen de ejecución (JRE + Python para CheckRoute.py) ---
FROM eclipse-temurin:21-jre-noble

# upgrade aplica los parches de seguridad del sistema publicados después de la imagen base
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Dependencias de Python en un entorno virtual; queda primero en el PATH,
# así "python3" (parktracker.python) usa este entorno
COPY requirements.txt /tmp/requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r /tmp/requirements.txt
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

COPY src/scripts/CheckRoute.py /app/scripts/CheckRoute.py
COPY park_data /app/park_data

# Opciones de la JVM para arrancar rápido con poca CPU (p. ej. 0,1 CPU en Render Free):
# solo el compilador C1, GC serie y heap acotado a la memoria del contenedor
ENV JAVA_OPTS="-XX:TieredStopAtLevel=1 -XX:+UseSerialGC -XX:MaxRAMPercentage=65 -Xss512k"

# Se extrae el jar y se genera un archivo AppCDS con un arranque de entrenamiento.
# El entrenamiento no conecta con la base de datos: se detiene al refrescar el contexto
# y Hibernate no consulta metadatos JDBC.
COPY --from=build /build/target/TFG_backend-0.0.1-SNAPSHOT.jar /tmp/app.jar
RUN java -Djarmode=tools -jar /tmp/app.jar extract --destination /app/application \
    && rm /tmp/app.jar \
    && java $JAVA_OPTS -XX:ArchiveClassesAtExit=/app/application/app.jsa -Dspring.context.exit=onRefresh \
        -jar /app/application/app.jar \
        --spring.datasource.url=jdbc:mysql://localhost:3306/cds \
        --spring.jpa.hibernate.ddl-auto=none \
        --spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect \
        --spring.jpa.properties.hibernate.boot.allow_jdbc_metadata_access=false

# Usuario sin privilegios
RUN useradd --system --no-create-home parktracker
USER parktracker

# Expón el puerto en el que Spring Boot está corriendo
EXPOSE 8080

CMD ["sh", "-c", "exec java $JAVA_OPTS -XX:SharedArchiveFile=/app/application/app.jsa -jar /app/application/app.jar"]
