README

# React + Vite

# Pagapoco - Aplicación de Clasificados Web

**Pagapoco** es una aplicación web de clasificados desarrollada en **.NET**, diseñada con una arquitectura limpia para asegurar escalabilidad y mantenibilidad. Permite a los usuarios registrarse, autenticarse, crear y gestionar publicaciones con imágenes, y realizar búsquedas avanzadas. Cuenta con una interfaz web MVC y una API REST robusta.

## Arquitectura del Proyecto

El proyecto sigue un patrón de arquitectura limpia, con una clara separación en las siguientes capas:

- **Pagapoco.API/**: Contiene todos los controladores de la API REST.
- **Pagapoco.Core.Entidades/**: Aloja los modelos de dominio y las entidades clave del proyecto.
- **Pagapoco.Database/**: Dedicada a los scripts de base de datos y esquemas.
- **Pagapoco.Infraestructure/**: Capa de acceso a datos, encargada de la interacción con la base de datos.
- **Pagapoco.Service/**: Contiene la lógica de negocio y los servicios principales.
- **Pagapoco.Web.MVC/**: La aplicación web MVC, con la interfaz de usuario.

## Servicios de Negocio

Los servicios principales que gestionan las funcionalidades clave de Pagapoco son:

### IUserService - Gestión de Usuarios

Este servicio es fundamental para la interacción de los usuarios con la aplicación.

- **Funcionalidades principales:**
  - Registro de usuarios (con encriptación de contraseñas).
  - Sistema de login con validación de credenciales.
  - Actualización de perfiles de usuario.
  - Eliminación lógica de cuentas.
  - Consulta de publicaciones por usuario.
- **Seguridad implementada:**
  - Hashing de contraseñas con PBKDF2 + HMAC-SHA256.
  - Generación de un _salt_ aleatorio de 16 bytes por contraseña.
  - 100,000 iteraciones para la derivación de claves.

### IPublicationService - Gestión de Publicaciones

Este servicio es el corazón de la gestión de clasificados.

- **Operaciones disponibles:**
  - Creación de publicaciones.
  - Búsqueda paginada de publicaciones.
  - Filtros por ciudad y tipo.
  - Filtros avanzados por atributos específicos.
  - Actualización y eliminación de publicaciones.
  - Funcionalidad para pausar o activar publicaciones.

### IImageService - Gestión de Imágenes

Este servicio se encarga de todo lo relacionado con las imágenes de las publicaciones.

- **Funcionalidades:**
  - Recuperación de imágenes por ID de publicación.
  - Asociación de imágenes a sus publicaciones.
  - Eliminación de imágenes por ID.
- **Nota:** Funcionalidades pendientes como la eliminación autorizada y actualizaciones de metadatos.

## Modelo de Datos

Las entidades principales diseñadas para estructurar la información son:

### Entidades Principales

- **User (Usuario):**
  - Información de perfil (nombre, teléfono, ciudad).
  - Credenciales de autenticación (email, hash de contraseña, salt).
  - Relación uno-a-muchos con las publicaciones.
- **Publication (Publicación):**
  - Información básica (título, descripción, precio).
  - Metadatos (fecha de creación, estado).
  - Relaciones con el usuario y las imágenes.
- **Image (Imagen):**
  - Asociación directa con las publicaciones.
  - Metadatos de la imagen.

## Patrones de Acceso a Datos

Para la persistencia de datos, se implementaron los siguientes patrones:

### Gestión de Transacciones

Cada método de servicio gestiona su propio límite transaccional, utilizando `_context.SaveChanges()` para asegurar la integridad.

### Patrones de Consulta

- **Búsqueda directa**: Para recuperar entidades únicas.
- **Consultas filtradas**: Permiten búsquedas condicionales.
- **Carga _eager_**: Incluye relaciones navegacionales para obtener datos relacionados en una sola consulta.
- **Paginación**: Para manejar grandes conjuntos de resultados.

### Eliminación Lógica (_Soft Delete_)

Implementado para preservar la información histórica:

- **Usuarios**: Se utiliza un flag `IsDeleted`.
- **Publicaciones**: Un flag `IsPaused` permite pausar y eliminar lógicamente las publicaciones.

## Manejo de Errores

La estrategia para el manejo de errores es la siguiente:

### Patrones de Excepción

- **InvalidOperationException**: Utilizada para señalar violaciones de las reglas de negocio.
- **Verificaciones de nulos**: Los servicios retornan `null` cuando una entidad no existe.
- **Fallas de autorización**: Excepciones explícitas para violaciones de permisos.

### Enfoque de Validación

La validación de entrada se realiza en las capas superiores (controladores), mientras que los servicios se centran en la lógica de negocio y la integridad de los datos.

## Configuración de Aplicación

El proyecto cuenta con dos puntos de entrada principales:

- **Pagapoco.Web.MVC**: La aplicación web con su interfaz de usuario.
- **Pagapoco.API**: La API REST, diseñada para integraciones externas.

Ambas aplicaciones comparten las mismas capas de servicios y acceso a datos, garantizando consistencia.

## Tecnologías Utilizadas

- **.NET Core**: Framework principal.
- **Entity Framework Core**: ORM para el acceso a datos.
- **ASP.NET Core MVC**: Framework web para la interfaz de usuario.
- **SQL Server**: Base de datos relacional.
- **PBKDF2 + HMAC-SHA256**: Algoritmos de seguridad para contraseñas.
