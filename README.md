# Burger Queen - API con Node.js

Un pequeño restaurante de hamburguesas, que está creciendo, necesita un
sistema a través del cual puedan tomar pedidos usando una _tablet_, y enviarlos
a la cocina para que se preparen ordenada y eficientemente.

Este proyecto tiene dos áreas: interfaz (cliente) y API (servidor). Nuestra
clienta nos ha solicitado desarrollar la API que se debe integra con la
interfaz,  que otro equipo de desarrolladoras está trabajando
simultáneamente

## 2. Resumen del proyecto

Con una API en este caso nos referimos a un _servidor web_, que es
básicamente un programa que _escucha_ en un puerto de red, a través del cual
podemos enviarle _consultas_ (_request_) y obtener _respuestas_ (_response_).

## 3. Objetivos de aprendizaje

### Node

* [x] Instalar y usar modules
* [x] `npm scripts`

### Express

* [x] Rutas
* [x] `middlewares`

### HTTP

* [x] Request
* [x] Response
* [x] Headers
* [x] Body
* [x] Verbos HTTP
* [x] Codigos de status de HTTP
* [x] Encodings y `JSON`
* [x] CORS

### Autenticación

* [x] `JWT`
* [x] Cómo guardar y validar contraseñas

### Testing

* [ ] Tests de integración
* [ ] Tests unitarios

### Frontend Development

* [x] Variables de entorno
* [x] `SSH`
* [x] `SSH` keys
* [x] Qué es un VPS

### MongoDB o MySQL (según corresponda)

* [x] Instalación
* [x] Conexión a través de cliente
* [x] Connection string
* [x] Comandos/Queries de creacion, lectura, modificación y eliminación

### Deployment

* [x] Contenedores
* [x] Qué es Docker
* [x] Qué es Docker compose
* [x] Uso de `docker-compose`

### Colaboración y Organización con Git y Github

* [x] Forks
* [x] Branches
* [x] Pull Requests
* [x] Tags
* [x] Projects
* [x] Issues
* [x] Labels
* [x] Milestones

### Buenas prácticas de desarrollo

* [x] Modularización
* [x] Nomenclatura / Semántica
* [x] Linting


## 5. Criterios de aceptación mínimos del proyecto

#### 5.1,1 `/`

* `GET /`

#### 5.1.2 `/auth`

* `POST /auth`

#### 5.1.3 `/users`

* `GET /users`
* `GET /users/:uid`
* `POST /users`
* `PUT /users/:uid`
* `DELETE /users/:uid`

#### 5.1.4 `/products`

* `GET /products`
* `GET /products/:productid`
* `POST /products`
* `PUT /products/:productid`
* `DELETE /products/:productid`

#### 5.1.5 `/orders`

* `GET /orders`
* `GET /orders/:orderId`
* `POST /orders`
* `PUT /orders/:orderId`
* `DELETE /orders/:orderId`

### 5.3 Deployment

Nuestra clienta nos ha manifestado que su equipo de _devops_ está siempre con muchas
tareas, por por lo que nos pide como requerimiento que la aplicación esté configurada
con `docker-compose` para que pueda ser desplegada sin dificultades en cualquier
entorno.

El _boilerplate_ ya cuenta con una configuración incial de `docker-compose` para
la aplicación de node, tu tarea será extender esa configuración para incluir la
configuración de base de datos que hayas elegido.
Ten en cuenta que como vas a tener dos servidores corriendo sobre una misma
configuración, deberás exponer los servicios en diferentes puertos.

Una vez que tengas tu configuración de `docker-compose`, deberás crear un servidor
en la nube (VPS) (en el área de recursos te proponemos algunas alternativas de
proveedores), acceder a él a través de `ssh`, clonar tu repositorio y ejecutar
`docker-compose up` para levantar la aplicación y la documentación, para que
queden online y accesibles.

## 7 HTTP API Checklist

### 7.1 `/`

* [x] `GET /`

### 7.2 `/auth`

* [x] `POST /auth`

### 7.3 `/users`

* [x] `GET /users`
* [x] `GET /users/:uid`
* [x] `POST /users`
* [x] `PUT /users/:uid`
* [x] `DELETE /users/:uid`

### 7.4 `/products`

* [x] `GET /products`
* [x] `GET /products/:productid`
* [x] `POST /products`
* [x] `PUT /products/:productid`
* [x] `DELETE /products/:productid`

### 7.5 `/orders`

* [x] `GET /orders`
* [x] `GET /orders/:orderId`
* [x] `POST /orders`
* [x] `PUT /orders/:orderId`
* [x] `DELETE /orders/:orderId`
