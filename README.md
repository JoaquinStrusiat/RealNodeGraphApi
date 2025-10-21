# 🧠 Proyecto Backend-as-a-Service (BaaS) - Manifiesto Técnico

## 🧾 Visión General

Este backend está diseñado como un **BaaS multi-tenant**, seguro, extensible y completamente dinámico. Su objetivo es proporcionar a cada cliente (tenant) un espacio aislado y tipado donde pueda:

* Crear objetos, eventos y relaciones.
* Definir sus propios tipos con validación.
* Consultar sus datos con una API potente y flexible basada en MongoDB Aggregation.
* Integrar servicios genéricos como almacenamiento, IA, motores de plantillas, etc.

Es una plataforma tipo “GraphQL invertido” donde el cliente arma su query (pipeline) y el backend la ejecuta **con validaciones, control de acceso y filtros automáticos**.

---

## 🧱 Estructura General

### 1. Entidades centrales

* `ObjectTypes`: definición de tipos de objetos, eventos o relaciones.
* `Objects`: instancia de objetos creados por el usuario, validados contra su `ObjectType`.
* (También existen `EventTypes`, `Events`, `RelationTypes`, `Relations` con misma lógica).

### 2. Campos clave en los objetos

* `owner`: identifica al creador del recurso (multi-tenant).
* `access`: puede ser `public` o `private`.
* `type`: referencia a un `ObjectType` que contiene su schema.
* `props`: mapa dinámico validado por un esquema AJV guardado en el tipo.

### 3. Módulos adicionales

* `auth`: contiene las rutas de login y registro utilizando Passport y JWT.
* `services`: lógica reutilizable del backend, orientada a proveer capacidades adicionales como:

  * Almacenamiento de imágenes.
  * Integración con motores Liquid.
  * Servicios de IA (clasificación, NLP, etc.).
  * Orquestadores o servicios externos.

---

## 🔐 Seguridad y control de acceso

### Modelo de acceso implementado:

* ✅ Filtros automáticos al recibir pipelines desde el cliente.
* ✅ **ABAC**: Se implementa control basado en atributos como `owner`, `access`, y relaciones explícitas del tipo `has_access`, que almacenan metadatos definidos por el cliente. Estas relaciones determinan políticas de acceso, alcance y permisos (find, create, update, delete) aplicables a:
  * A un objeto específico.
  * A todos los objetos de un tipo particular y de un mismo `owner`.
  * A todos los objetos de un `owner` determinado.
* ✅ **RBAC**: Los roles son definidos e instanciados por cada cliente, quien puede asignarlos a un usuarios. A estos roles se les asocian relaciones de tipo has_access, que definen los permisos y el alcance que tendrán sobre los datos (a nivel de documento, tipo u owner).

### Seguridad garantizada en cada nivel:

* Se intercepta y valida el pipeline antes de ejecutarlo.
* Se insertan filtros (`$match`) en cada `$lookup` anidado.
* Se protege incluso contra anidamiento recursivo (lookup dentro de lookup...).

---

## 🔎 Consultas

### API flexible (tipo GraphQL, pero mejor):

El cliente envía un pipeline de MongoDB Aggregation. El backend:

1. Valida el pipeline (evita `$out`, `$merge`, etc.).
2. Inserta filtros automáticos para asegurar visibilidad restringida.
3. Ejecuta con performance garantizada mediante índices y límites.

---

## 🧬 Tipado y validación dinámica

Cada tipo (`ObjectType`) contiene un `schema` en formato JSON Schema compatible con **AJV** (Another JSON Schema Validator).

Ejemplo:

```json
{
  "type": "object",
  "properties": {
    "calories": { "type": "number" },
    "is_vegan": { "type": "boolean" },
    "name": { "type": "string" }
  },
  "required": ["calories", "name"]
}
```

Los objetos se validan en tiempo de inserción o actualización contra este schema usando AJV.

* No se aceptan props no definidos.
* Se controla el tipo, requeridos, estructuras anidadas, etc.
* Permite extender validaciones sin modificar la lógica del backend.

---

## 🧩 Arquitectura

* MongoDB como grafo lógico (documentos = nodos, relaciones = aristas).
* Esquema dinámico pero validado (schema-on-read).
* Permite representar conocimiento, relaciones semánticas y estructuras complejas.
* Diseño modular para escalabilidad vertical por tipo de entidad.
* Soporte para microservicios adicionales como cacheo (Redis), AI, almacenamiento, y más.

---

## 🌍 Multi-tenant y extensibilidad

Cada recurso tiene su `owner`, y todas las consultas están restringidas al contexto del usuario autenticado (por token JWT o similar).

Soporte planificado para:

* Hooks por tipo (beforeCreate, afterUpdate...).
* Formularios dinámicos (con JSON Schema generado a partir del tipo).
* Exportación/importación de tipos y datos.
* Servicios auxiliares extensibles por módulo o plugin.

---

## 🧠 Resumen final

Este backend es una plataforma robusta para representar conocimiento y relaciones complejas entre entidades, con la flexibilidad de una base de datos NoSQL y la estructura de un modelo relacional o semántico.

Permite a los usuarios modelar, validar y consultar datos complejos, **respetando siempre el aislamiento, seguridad y permisos personalizados definidos por cada cliente**, y extendible a través de servicios adicionales modulares.