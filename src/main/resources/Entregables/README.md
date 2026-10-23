# 🚘 AutoRent Enterprise

Sistema de gestión de alquiler de vehículos desarrollado con Java y Spring Boot, aplicando Arquitectura Hexagonal (Ports and Adapters) y persistencia en H2.

---

# 👨‍💻 Integrantes

- Duvan Palma
- Dios
- Microsoft Copilot

---

# 📋 Descripción

AutoRent Enterprise es una plataforma para la administración de:

- Vehículos
- Clientes
- Alquileres
- Taller y mantenimiento

La aplicación fue desarrollada siguiendo los principios de Arquitectura Hexagonal con el objetivo de separar claramente:

- Dominio
- Casos de uso
- Puertos
- Adaptadores
- Infraestructura

De esta forma las reglas de negocio permanecen desacopladas de Spring Boot, JPA y H2.

---

# 🛠️ Tecnologías utilizadas

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven

## Base de datos

- H2 Database

## Frontend

- HTML5
- CSS3
- JavaScript Vanilla

## Arquitectura

- Arquitectura Hexagonal
- Ports and Adapters

---

# 🚀 Cómo ejecutar el proyecto

## 1. Clonar repositorio

```bash
git clone 
```

## 2. Acceder al proyecto

```bash
cd autorent
```

## 3. Compilar el proyecto

```bash
mvn clean install
```

## 4. Ejecutar la aplicación

```bash
mvn spring-boot:run
```

o

```bash
java -jar target/autorent.jar
```

## 5. Acceder a la aplicación

Frontend:

```text
http://localhost:8080
```

Consola H2:

```text
http://localhost:8080/h2-console
```

---

# ⚙️ Configuración de H2

```properties
spring.datasource.url=jdbc:h2:mem:autorent

spring.datasource.driver-class-name=org.h2.Driver

spring.datasource.username=sa

spring.datasource.password=

spring.jpa.hibernate.ddl-auto=create-drop

spring.h2.console.enabled=true
```

La consola H2 permite visualizar las tablas:

```text
AUTOS

CLIENTES

ALQUILERES
```

y verificar la persistencia de los datos.

---

# 🏗️ Arquitectura Implementada

El proyecto implementa Arquitectura Hexagonal (Ports and Adapters).

## Dominio

Representa el núcleo del negocio.

Contiene:

```text
Auto
Cliente
Alquiler
EstadoAuto
EstadoAlquiler
```

y las reglas de negocio.

Además contiene:

```text
Excepciones

Constantes

Enumeraciones
```

Las clases del dominio no dependen de:

```text
Spring Boot

Spring Data

Hibernate

H2

Controllers
```

---

## Aplicación

Contiene:

### Puertos de Entrada (Input Ports)

Representan los casos de uso.

Ejemplos:

```text
RegistrarAutoUseCase

RegistrarClienteUseCase

CrearAlquilerUseCase

FinalizarAlquilerUseCase

RegistrarPagoUseCase

RegistrarKilometrajeUseCase

EnviarAutoATallerUseCase

HabilitarAutoUseCase
```

---

### Puertos de Salida (Output Ports)

Representan contratos hacia la infraestructura.

```text
AutoRepositoryPort

ClienteRepositoryPort

AlquilerRepositoryPort
```

---

### Servicios

Implementan la lógica de negocio.

```text
AutoService

ClienteService

AlquilerService
```

---

## Infraestructura

### Adaptadores de Entrada

```text
AutoController

ClienteController

AlquilerController
```

Responsables de recibir solicitudes HTTP.

---

### Adaptadores de Salida

```text
AutoPersistenceAdapter

ClientePersistenceAdapter

AlquilerPersistenceAdapter
```

Responsables de comunicarse con la base de datos.

---

### Persistencia

```text
AutoEntity

ClienteEntity

AlquilerEntity
```

---

### Repositorios

```text
AutoJpaRepository

ClienteJpaRepository

AlquilerJpaRepository
```

---

# 📂 Estructura del Proyecto

```text
com.autorent
│
├── domain
│   ├── model
│   │   ├── Auto
│   │   ├── Cliente
│   │   └── Alquiler
│   │
│   └── exception
│
├── application
│   ├── port
│   │   ├── input
│   │   └── output
│   │
│   └── service
│
└── infrastructure
    ├── adapter
    │   ├── input
    │   │   └── rest
    │   │
    │   └── output
    │       └── persistence
    │
    └── config
```

---

# 🔄 Flujo de una solicitud

Ejemplo:

```http
POST /api/alquileres
```

```text
Cliente HTTP
      ↓
AlquilerController
      ↓
CrearAlquilerUseCase
      ↓
AlquilerService
      ↓
AutoRepositoryPort
      ↓
AutoPersistenceAdapter
      ↓
AutoJpaRepository
      ↓
H2
```

---

# 🚘 Gestión de Autos

## Crear Auto

### Endpoint

```http
POST /api/autos
```

### Solicitud

```json
{
  "placa": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2025,
  "precioPorDia": 150000
}
```

### Respuesta

```json
{
  "id": 1,
  "placa": "ABC123",
  "estado": "DISPONIBLE"
}
```

---

## Consultar Auto

```http
GET /api/autos/{id}
```

---

## Consultar Todos

```http
GET /api/autos
```

---

## Consultar Disponibles

```http
GET /api/autos/disponibles
```

---

## Consultar Alquilados

```http
GET /api/autos/alquilados
```

---

## Consultar Mantenimiento

```http
GET /api/autos/mantenimiento
```

---

## Eliminar Auto

```http
DELETE /api/autos/{id}
```

---

# 👥 Gestión de Clientes

## Crear Cliente

```http
POST /api/clientes
```

### Solicitud

```json
{
  "nombre": "Carlos Pérez",
  "documento": "123456789",
  "telefono": "3001234567",
  "email": "carlos@email.com"
}
```

---

## Consultar Cliente

```http
GET /api/clientes/{id}
```

---

## Consultar Todos

```http
GET /api/clientes
```

---

## Actualizar Cliente

```http
PUT /api/clientes/{id}
```

---

## Eliminar Cliente

```http
DELETE /api/clientes/{id}
```

---

# 📄 Gestión de Alquileres

## Crear Alquiler

```http
POST /api/alquileres
```

### Solicitud

```json
{
  "clienteId": 1,
  "autoId": 1,
  "cantidadDias": 5
}
```

### Regla

```text
valorTotal =
precioPorDia × cantidadDias
```

---

## Registrar Pago

```http
PUT /api/alquileres/{id}/pagar
```

### Solicitud

```json
{
  "valorPago": 200000
}
```

---

## Finalizar Alquiler

```http
PUT /api/alquileres/{id}/finalizar
```

---

## Finalización Anticipada

```http
PUT /api/alquileres/{id}/finalizar-anticipado
```

```json
{
  "diasUtilizados": 5
}
```

---

## Consultar Todos

```http
GET /api/alquileres
```

---

## Consultar Activos

```http
GET /api/alquileres/activos
```

---

## Consultar Finalizados

```http
GET /api/alquileres/finalizados
```

---

# 🔧 Taller y Mantenimiento (Funcionalidad Adicional)

## Registrar Kilometraje

```http
PUT /api/autos/{id}/kilometraje
```

```json
{
  "kilometros": 500
}
```

---

## Enviar a Taller

```http
PUT /api/autos/{id}/mantenimiento
```

---

## Habilitar Vehículo

```http
PUT /api/autos/{id}/habilitar
```

Al habilitar:

```text
Estado = DISPONIBLE

Kilometraje = 0
```

---

# 📏 Reglas de Negocio

## Autos

- Placa obligatoria.
- Formato obligatorio ABC123.
- Precio por día mayor que cero.
- No existen placas duplicadas.
- No se puede eliminar un auto alquilado.
- No se puede eliminar un auto en mantenimiento.

## Clientes

- Nombre obligatorio.
- Documento obligatorio.
- Documento único.
- Teléfono único.
- Email válido.

## Alquileres

- Cliente debe existir.
- Auto debe existir.
- Auto debe estar DISPONIBLE.
- Días > 0.
- No se puede finalizar dos veces.
- No se puede finalizar con pagos pendientes.
- El valor total se calcula automáticamente.

## Taller

- Cada día alquilado equivale a 100 km.
- El kilometraje aumenta automáticamente al finalizar un alquiler.
- El kilometraje aumenta automáticamente en finalización anticipada usando los días realmente utilizados.
- Si el kilometraje supera 10.000 km:
  - Estado → MANTENIMIENTO.
- Un vehículo permanece en mantenimiento hasta intervención manual.
- Al habilitar un vehículo:
  - Estado → DISPONIBLE.
  - Kilometraje → 0.

---

# ❌ Manejo de Errores

```text
404 NOT FOUND
```

- Auto no encontrado.
- Cliente no encontrado.
- Alquiler no encontrado.

```text
409 CONFLICT
```

- Auto no disponible.
- Auto duplicado.
- Documento duplicado.
- Teléfono duplicado.
- Pago pendiente.

```text
400 BAD REQUEST
```

- Datos inválidos.
- Días inválidos.
- Kilometraje inválido.

---

# 📊 Dashboard

Indicadores implementados:

```text
Vehículos

Disponibles

Alquilados

Mantenimiento

Clientes

Clientes con alquiler activo

Alquileres

Activos

Finalizados
```

Los indicadores permiten navegar directamente hacia los módulos correspondientes.

---

# 🔧 Mejoras Implementadas Sobre el Alcance Base

Además de lo solicitado por el proyecto se desarrolló:

- Dashboard interactivo.
- Frontend completo HTML/CSS/JavaScript.
- Actualización y eliminación de clientes.
- Gestión completa de pagos.
- Finalización anticipada.
- Indicadores avanzados.
- Módulo de Taller.
- Kilometraje automático.
- Entrada automática a mantenimiento.
- Reinicio de kilometraje.
- Habilitación manual de vehículos.
- Gestión visual de mantenimiento.

---

# 📸 Evidencias Incluidas

- Evidencias de Autos.
- Evidencias de Clientes.
- Evidencias de Alquileres.
- Evidencias del Dashboard.
- Evidencias de H2.
- Evidencias de errores controlados.
- Evidencias del módulo Taller.
- Evidencias de kilometraje automático.

---

# ✅ Conclusión

AutoRent Enterprise fue desarrollado aplicando Arquitectura Hexagonal utilizando Java, Spring Boot y H2, logrando una separación clara entre dominio, aplicación e infraestructura, permitiendo implementar nuevas reglas de negocio (Taller y Kilometraje) sin afectar el núcleo de la aplicación, demostrando tanto funcionalidad como comprensión arquitectónica del proyecto.