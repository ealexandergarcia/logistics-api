# Gestión de Envíos y Rutas Logísticas

API para gestionar el envío de paquetes, optimizar rutas de entrega y permitir a los clientes rastrear sus pedidos en tiempo real. Desarrollada con **Express**, **TypeScript**, **MySQL**, **Redis** y **JWT**, siguiendo los principios de **Clean Architecture**.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [MySQL](https://dev.mysql.com/downloads/) (v8.0 o superior)
- [Git](https://git-scm.com/)

---

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto:

### 1. Clonar el Repositorio

Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/ealexandergarcia/logistics-api.git
cd logistics-api
```

### 2. Instalar Dependencias

Instala las dependencias del proyecto usando npm:

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo .env en la raíz del proyecto y configura las siguientes variables:

```bash
MYSQL_HOST=autorack.proxy.rlwy.net
MYSQL_USER=root
MYSQL_PASSWORD=NYznxgJlQKoxYYBUNHRAbtLXSCHvDjtF
MYSQL_PORT=36693
MYSQL_DATABASE=railway
REDIS_URL=
JWT_SECRET=3yJv4k5L8m9Q2r5T8w0Z3x6V9b2N5q8R
```

### 4. Ejecutar la Aplicación
Inicia la aplicación en modo de desarrollo:

```bash
npm start
```

---

## Pruebas

### Pruebas Unitarias
```bash
npm test
```

---

## Pruebas

### Documentación de la API
```bash
http://localhost:3000/api-docs
```
---

## Contribución

Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio.

2. Crea una rama para tu feature o corrección: git checkout -b mi-feature.

3. Realiza tus cambios y haz commit: git commit -m "Añade mi feature".

4. Sube tus cambios: git push origin mi-feature.

5. Abre un Pull Request en GitHub.

---

## Licencia
Este proyecto está bajo la licencia MIT.

---

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

Nombre: Edwin Garcia

Email: egarciapame@gmail.com

GitHub: @ealexandergarcia 